// Orchestrator: queries all sources (OpenAgenda mirror + venue scrapers),
// merges them, keeps only upcoming concerts, deduplicates, sorts by date,
// and writes src/data/events.json (consumed by the Astro pages).
//
// Run before `astro build` (see package.json) and by the daily GitHub
// Actions workflow. Fault-tolerant: if a source fails, it's logged and the
// others still run (a venue site under maintenance shouldn't break the
// whole build).

import { writeFile, readFile } from 'node:fs/promises';
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

// Deduplication key: same normalized title + same day.
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
        if (!e.debut || new Date(e.debut) < minuit) continue; // past events
        if (!e.titre) continue;
        const k = cle(e);
        // Venue-specific sources win over the generic mirror on duplicates.
        if (!collectes.has(k) || (collectes.get(k).source === 'opendatasoft' && e.source !== 'opendatasoft')) {
          collectes.set(k, { id: `${e.source}:${k}`, fin: e.debut, ...e });
          retenus++;
        }
      }
      rapport.push(`  ${nom.padEnd(28)} ${String(retenus).padStart(3)} (${bruts.length} raw)`);
    } catch (err) {
      rapport.push(`  ${nom.padEnd(28)}  ✗ FAILED: ${err.message}`);
    }
  }

  const events = [...collectes.values()].sort((a, b) => a.debut.localeCompare(b.debut));
  const parSecteur = Object.fromEntries(
    SECTEURS.map((s) => [s.slug, events.filter((e) => e.secteur === s.slug).length]),
  );

  // Safety net: if sources get blocked/throttled (typically in a CI
  // environment), we might fetch far fewer concerts than before. In that
  // case, don't overwrite the existing file (keep the good data from the
  // last successful run) rather than degrade the site.
  try {
    const ancien = JSON.parse(await readFile(OUT, 'utf8'));
    if (ancien.total >= 8 && events.length < ancien.total * 0.6) {
      console.error(`✗ Suspicious result: ${events.length} concerts vs ${ancien.total} previously (` +
        `≥40% drop). Likely throttling on a source. File kept as-is, not overwritten.`);
      console.log('Sources:\n' + rapport.join('\n'));
      process.exit(1);
    }
  } catch { /* no existing file: first run, write normally */ }

  await writeFile(
    OUT,
    JSON.stringify({ genere_le: now.toISOString(), total: events.length, par_secteur: parSecteur, events }, null, 2) + '\n',
    'utf8',
  );

  console.log('Sources:');
  console.log(rapport.join('\n'));
  console.log(`\n✓ ${events.length} concerts total`);
  for (const s of SECTEURS) console.log(`  ${s.nom.padEnd(28)} ${parSecteur[s.slug]}`);
  console.log(`→ ${OUT}`);
}

main().catch((err) => {
  console.error('✗ Global failure:', err.message);
  process.exit(1);
});
