// Orchestrateur : interroge toutes les sources (miroir OpenAgenda + scrapers de
// salles), fusionne, ne garde que les concerts à venir, dédoublonne, trie par
// date, et écrit src/data/events.json (consommé par les pages Astro).
//
// Lancé avant `astro build` (cf. package.json) et par le Cron Worker Cloudflare.
// Tolérant aux pannes : si une source échoue, on log et on continue avec les
// autres (un site de salle en maintenance ne doit pas casser tout le build).

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import process from 'node:process';

import { SECTEURS } from '../src/data/secteurs.js';
import * as opendatasoft from '../src/sources/opendatasoft.mjs';
import * as echonova from '../src/sources/echonova.mjs';
import * as hydrophone from '../src/sources/hydrophone.mjs';
import * as coota from '../src/sources/coota.mjs';
import * as fnac from '../src/sources/fnac.mjs';

const SOURCES = [opendatasoft, echonova, hydrophone, coota, fnac];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'events.json');

const now = new Date();
const minuit = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Clé de dédoublonnage : même titre normalisé + même jour.
function cle(e) {
  const t = (e.titre || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  return `${t}|${(e.debut || '').slice(0, 10)}`;
}

async function main() {
  const collectes = new Map();
  const rapport = [];

  for (const source of SOURCES) {
    const { id, nom } = source.meta;
    try {
      const bruts = await source.recuperer();
      let retenus = 0;
      for (const e of bruts) {
        if (!e.debut || new Date(e.debut) < minuit) continue; // passés
        if (!e.titre) continue;
        const k = cle(e);
        // Priorité aux sources « salles » sur le miroir générique en cas de doublon.
        if (!collectes.has(k) || (collectes.get(k).source === 'opendatasoft' && e.source !== 'opendatasoft')) {
          collectes.set(k, { id: `${e.source}:${k}`, fin: e.debut, ...e });
          retenus++;
        }
      }
      rapport.push(`  ${nom.padEnd(28)} ${String(retenus).padStart(3)} (${bruts.length} bruts)`);
    } catch (err) {
      rapport.push(`  ${nom.padEnd(28)}  ✗ ÉCHEC : ${err.message}`);
    }
  }

  const events = [...collectes.values()].sort((a, b) => a.debut.localeCompare(b.debut));
  const parSecteur = Object.fromEntries(
    SECTEURS.map((s) => [s.slug, events.filter((e) => e.secteur === s.slug).length]),
  );

  await writeFile(
    OUT,
    JSON.stringify({ genere_le: now.toISOString(), total: events.length, par_secteur: parSecteur, events }, null, 2) + '\n',
    'utf8',
  );

  console.log('Sources :');
  console.log(rapport.join('\n'));
  console.log(`\n✓ ${events.length} concerts au total`);
  for (const s of SECTEURS) console.log(`  ${s.nom.padEnd(28)} ${parSecteur[s.slug]}`);
  console.log(`→ ${OUT}`);
}

main().catch((err) => {
  console.error('✗ Échec global :', err.message);
  process.exit(1);
});
