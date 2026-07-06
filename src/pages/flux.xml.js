// Flux RSS des concerts à venir, généré au build (rebâti chaque jour).
// Fait main (pas de dépendance) : le format RSS 2.0 tient en quelques lignes.
import data from '../data/events.json';
import { formatDate } from '../data/format.js';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function GET({ site }) {
  const base = (site?.href ?? 'https://concerts-morbihan.pages.dev/').replace(/\/$/, '');
  const items = data.events
    .map((e) => `    <item>
      <title>${esc(`${e.titre} — ${formatDate(e.debut, 'fr')}`)}</title>
      <link>${esc(e.url ?? base)}</link>
      <guid isPermaLink="false">${esc(e.id)}</guid>
      <description>${esc(`${e.lieu ? e.lieu + ', ' : ''}${e.ville} — ${formatDate(e.debut, 'fr')}.${e.description ? ' ' + e.description : ''}`)}</description>
    </item>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Concerts Morbihan</title>
    <link>${base}</link>
    <atom:link href="${base}/flux.xml" rel="self" type="application/rss+xml"/>
    <description>Les concerts à venir dans le Morbihan : Vannes, Auray, Lorient et alentours. Mis à jour chaque jour.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
