// Source : Le Coota (bar-concert, Vannes → secteur Vannes).
// Scrape /concert. Cartes .card.event ; date « Le 26 Jun 2026 » (mois anglais).

import { chargerHtml, dateISO, texte, numeroMois } from './_util.mjs';

const URL_CONCERT = 'https://lecoota.fr/concert';
const VILLE = 'Vannes';
const SECTEUR = 'vannes';

export const meta = { id: 'coota', nom: 'Le Coota', url: URL_CONCERT };

export async function recuperer() {
  const $ = await chargerHtml(URL_CONCERT);
  const events = [];

  $('.card.event').each((_, el) => {
    const $el = $(el);
    const titre = texte($el.find('.card-title').first().text());
    if (!titre) return;

    // Date dans un <p> : « Le 26 Jun 2026 »
    let debut = null;
    $el.find('.card-body p').each((__, p) => {
      const m = texte($(p).text()).match(/(\d{1,2})\s+([\p{L}.]+)\.?\s+(\d{4})/u);
      if (m && numeroMois(m[2]) !== null) {
        debut = dateISO({ jour: Number(m[1]), mois: m[2], annee: Number(m[3]) });
      }
    });
    if (!debut) return;

    const style = texte($el.find('h6').first().text()).replace(/^style\s*:\s*/i, '');
    const img = $el.find('img').first().attr('src') || null;

    events.push({
      titre,
      debut,
      ville: VILLE,
      lieu: 'Le Coota',
      secteur: SECTEUR,
      description: style,
      image: img,
      url: URL_CONCERT,
      source: meta.id,
    });
  });

  return events;
}
