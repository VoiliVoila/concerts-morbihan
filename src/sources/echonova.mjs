// Source: L'Échonova (SMAC venue, Saint-Avé → vannes area).
// Scrapes the /programmation/ page (WordPress; the REST API doesn't expose
// the concert date, so we read it from the HTML, in the tiles' aria-label).

import { chargerHtml, dateISO, texte, absolu, numeroMois } from './_util.mjs';

const URL_PROG = 'https://lechonova.com/programmation/';
const VILLE = 'Saint-Avé';
const SECTEUR = 'vannes';

export const meta = { id: 'echonova', nom: "L'Échonova", url: URL_PROG };

export async function recuperer() {
  const $ = await chargerHtml(URL_PROG);
  const events = [];

  $('article.c-tile-artist').each((_, el) => {
    const $el = $(el);
    const aria = $el.attr('aria-label') || '';

    // aria-label: "...sur le concert de <TITLE> le <Day>, <DD> <month>"
    const titreMatch = aria.match(/concert de\s+(.+?)\s+le\s+/i);
    const dateMatch = aria.match(/le\s+\w+,?\s*(\d{1,2})\s+([\p{L}.]+)/u);
    if (!titreMatch || !dateMatch) return;
    if (numeroMois(dateMatch[2]) === null) return;

    const debut = dateISO({ jour: Number(dateMatch[1]), mois: dateMatch[2] });
    if (!debut) return;

    const lien = absolu(URL_PROG, $el.find('a[href*="/evenement/"]').first().attr('href'));
    const img = $el.find('img').first().attr('src') || null;
    const styles = ($el.attr('data-styles') || '').split(';').filter(Boolean).join(', ');

    events.push({
      titre: texte(titreMatch[1]),
      debut,
      ville: VILLE,
      lieu: "L'Échonova",
      secteur: SECTEUR,
      description: styles,
      image: img,
      url: lien || URL_PROG,
      source: meta.id,
    });
  });

  return events;
}
