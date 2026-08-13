// Source: Fnac Spectacles (ticketing platform). Venue pages expose
// schema.org `MusicEvent` JSON-LD (public data meant for search engines) →
// a single parser covers every venue selling through Fnac.
//
// We only read @type MusicEvent: the schema.org typing does the music
// filtering for us (plays, magic shows... are other @type values).
//
// ⚠️ Don't add a venue here that's already covered by a dedicated scraper
// (e.g. Hydrophone via hydrophone.mjs): Fnac titles often differ ("Ciel + Cq
// Wrestling" vs "CIEL"), so deduplication wouldn't match them → duplicates.

import { versParis, texte, signalTimeout } from './_util.mjs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

export const meta = { id: 'fnac', nom: 'Fnac Spectacles', url: 'https://www.fnacspectacles.com/' };

// Venues to query (Fnac venue-page URL + area assignment).
const SALLES = [
  { url: 'https://www.fnacspectacles.com/venue/palais-des-arts-salle-lesage-vannes-84776/', ville: 'Vannes', lieu: 'Palais des Arts (Salle Lesage)', secteur: 'vannes' },
  { url: 'https://www.fnacspectacles.com/city/lorient-2112/venue/palais-des-congres-lorient-69238/', ville: 'Lorient', lieu: 'Palais des Congrès', secteur: 'lorient' },
  { url: 'https://www.fnacspectacles.com/venue/parc-des-expositions-lorient-lanester-79877/', ville: 'Lanester', lieu: 'Parc des Expositions', secteur: 'lorient' },
];

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Extracts MusicEvent JSON-LD objects from an HTML page.
function extraireEvents(html) {
  const events = [];
  const blocs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [, brut] of blocs) {
    let json;
    try { json = JSON.parse(brut); } catch { continue; }
    for (const obj of Array.isArray(json) ? json : [json]) {
      const type = obj && obj['@type'];
      const estMusique = Array.isArray(type) ? type.includes('MusicEvent') : type === 'MusicEvent';
      if (estMusique) events.push(obj);
    }
  }
  return events;
}

// schema.org image: string | string[] | ImageObject | ImageObject[].
function premiereImage(img) {
  if (!img) return null;
  const v = Array.isArray(img) ? img[0] : img;
  if (typeof v === 'string') return v;
  return v && typeof v === 'object' ? v.url || null : null;
}

async function recupererSalle(salle) {
  const res = await fetch(salle.url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'fr' },
    signal: signalTimeout(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return extraireEvents(html)
    .filter((e) => e.name && e.startDate)
    .map((e) => ({
      titre: texte(e.name),
      debut: versParis(e.startDate),
      ville: salle.ville,
      lieu: salle.lieu,
      secteur: salle.secteur,
      description: '',
      image: premiereImage(e.image),
      url: typeof e.url === 'string' ? e.url : salle.url,
      source: meta.id,
    }))
    .filter((e) => e.debut);
}

export async function recuperer() {
  const events = [];
  for (const salle of SALLES) {
    try {
      const lot = await recupererSalle(salle);
      events.push(...lot);
    } catch (err) {
      // A venue that's down (or Fnac throttling) shouldn't fail the others.
      console.error(`  [fnac] ${salle.lieu}: ${err.message}`);
    }
    await attendre(1500); // rate limiting / anti-throttling
  }
  return events;
}
