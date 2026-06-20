// Source : dataset public Opendatasoft « evenements-publics-openagenda »
// (miroir OpenAgenda, sans clé). Couvre le Morbihan « tout venant » — flux très
// bruité, d'où le filtrage musical. Complète les sources « salles » dédiées.

import { SECTEURS, secteurDeVille, normalise } from '../data/secteurs.js';
import { versParis } from './_util.mjs';

const DATASET = 'evenements-publics-openagenda';
const BASE = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/${DATASET}/records`;
const PAGE = 100;
const MAX_PAGES = 40;

export const meta = { id: 'opendatasoft', nom: 'OpenAgenda (miroir public)', url: 'https://public.opendatasoft.com/explore/dataset/evenements-publics-openagenda/' };

// Agendas sources à ignorer entièrement (bruit récurrent sur le 56).
const SOURCES_EXCLUES = ['mes événements france travail', 'france travail'];

const MUSIQUE = /\b(concerts?|musique|musical|musicale|live|festival|fest[- ]?noz|chanson|chant|jazz|rock|rap|hip[- ]?hop|metal|punk|reggae|blues|folk|funk|soul|electro|électro|techno|house|fanfare|r[eé]cital|chorale|d[ée]ambulation musicale|dj set|showcase|sc[eè]ne ouverte|open mic|bal (?:trad|populaire|folk|breton)|bagad|orchestre|symphoni|op[ée]ra|trio|quartet|quintet)\b/i;
const MUSIQUE_FORTE = /\b(concerts?|fest[- ]?noz|dj set|fanfare|bagad|chorale|orchestre|r[eé]cital|fête de la musique)\b/i;
const NON_MUSICAL = /\b(exposition|visite|conf[eé]rence|jobdating|job dating|recrut|emploi|atelier|patrimoine|marathon photo|photographie|photo|formation|permanence|forum|portes ouvertes|braderie|march[eé]\b|randonn[eé]e|conte\b|contes\b|th[eé][aâ]tre|cin[eé]ma|d[ée]bat|nettoyage|chauve-souris|biblioth[eè]que)\b/i;

const today = new Date().toISOString().slice(0, 10);

async function fetchPage(offset) {
  const url = new URL(BASE);
  url.searchParams.set('where', `location_department="Morbihan" AND firstdate_begin >= "${today}"`);
  url.searchParams.set('order_by', 'firstdate_begin');
  url.searchParams.set('limit', String(PAGE));
  url.searchParams.set('offset', String(offset));
  const res = await fetch(url, { headers: { 'User-Agent': 'concerts-morbihan/0.1' } });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} (offset ${offset})`);
  return res.json();
}

function sourceExclue(r) {
  const src = normalise(r.originagenda_title || r.contributor_organization || '');
  return SOURCES_EXCLUES.some((s) => src.includes(normalise(s)));
}

function estMusical(r) {
  const titre = r.title_fr || '';
  const kw = Array.isArray(r.keywords_fr) ? r.keywords_fr.join(' ') : r.keywords_fr || '';
  const texte = `${titre} ${kw}`;
  if (!MUSIQUE.test(texte)) return false;
  if (NON_MUSICAL.test(titre) && !MUSIQUE_FORTE.test(titre)) return false;
  return true;
}

export async function recuperer() {
  const events = [];
  for (let p = 0; p < MAX_PAGES; p++) {
    const data = await fetchPage(p * PAGE);
    const results = data.results || [];
    if (results.length === 0) break;
    for (const r of results) {
      const secteur = secteurDeVille(r.location_city);
      if (!secteur || sourceExclue(r) || !estMusical(r)) continue;
      events.push({
        titre: (r.title_fr || '').trim(),
        debut: versParis(r.firstdate_begin),
        ville: (r.location_city || '').trim(),
        lieu: (r.location_name || '').trim(),
        secteur,
        description: (r.description_fr || '').trim(),
        image: r.image || r.originalimage || null,
        url: r.canonicalurl || null,
        source: meta.id,
      });
    }
    if (results.length < PAGE) break;
  }
  return events;
}

export { SECTEURS };
