// Source : L'Échonova (SMAC, Saint-Avé → secteur Vannes).
// Scrape la page /programmation/ (WordPress ; l'API REST n'expose pas la date
// du concert, on lit donc le HTML où elle figure dans l'aria-label des tuiles).

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

    // aria-label : « ...sur le concert de <TITRE> le <Jour>, <JJ> <mois> »
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
      titre: decode(texte(titreMatch[1])),
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

// Décode les quelques entités HTML présentes dans les aria-labels.
function decode(s) {
  return s
    .replace(/&#0?38;|&amp;/g, '&')
    .replace(/&rsquo;|&#8217;/g, '’')
    .replace(/&eacute;/g, 'é')
    .replace(/&[a-z]+;|&#\d+;/gi, '');
}
