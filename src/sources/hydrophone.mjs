// Source: Hydrophone (Lorient's SMAC venue, formerly Le Manège → lorient area).
// Scrapes /-Agenda-.html (SPIP). nb=50 to load the whole season.

import { chargerHtml, dateISO, texte, absolu } from './_util.mjs';

const BASE = 'https://www.hydrophone.fr/';
const URL_AGENDA = `${BASE}-Agenda-.html?nb=50`;
const VILLE = 'Lorient';
const SECTEUR = 'lorient';

export const meta = { id: 'hydrophone', nom: 'Hydrophone', url: `${BASE}-Agenda-.html` };

export async function recuperer() {
  const $ = await chargerHtml(URL_AGENDA);
  const events = [];

  $('.agenda-item').each((_, el) => {
    const $el = $(el);
    const titre = texte($el.find('.agenda-item-nom h3').first().text());
    // First h3: "jeu. 17 sept. /&nbsp;20h"
    const dateBrute = texte($el.find('.divTexte h3').first().text());
    if (!titre || !dateBrute) return;

    const m = dateBrute.match(/(\d{1,2})\s+([\p{L}.]+)\.?\s*\/?\s*(\d{1,2})?\s*h\s*(\d{2})?/u);
    if (!m) return;
    const debut = dateISO({
      jour: Number(m[1]),
      mois: m[2],
      heure: m[3] ? Number(m[3]) : 20, // default to 8pm if not specified
      minute: m[4] ? Number(m[4]) : 0,
    });
    if (!debut) return;

    const lien = absolu(BASE, $el.find('a').first().attr('href'));
    const img = absolu(BASE, $el.find('img').first().attr('src'));

    events.push({
      titre,
      debut,
      ville: VILLE,
      lieu: 'Hydrophone',
      secteur: SECTEUR,
      description: '',
      image: img,
      url: lien || meta.url,
      source: meta.id,
    });
  });

  return events;
}
