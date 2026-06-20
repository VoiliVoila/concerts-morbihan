// Génère public/og.png (1200x630) — image de partage social brandée.
// Rasterise un SVG avec @resvg/resvg-js + la police Bricolage (fontsource).
import { Resvg } from '@resvg/resvg-js';
import { writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const FDIR = 'node_modules/@fontsource-variable/bricolage-grotesque/files';
const files = await readdir(FDIR);
// resvg gère mieux le woff (pas woff2) ; on prend un woff latin si dispo, sinon woff2.
const pick = files.find(f => /latin-wght-normal\.woff$/.test(f))
  || files.find(f => /latin-standard-normal\.woff$/.test(f))
  || files.find(f => /latin-wght-normal\.woff2$/.test(f));
console.log('police utilisée:', pick);
const fontBuf = await import('node:fs').then(m => m.promises.readFile(join(FDIR, pick)));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="78%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#ff5d3b" stop-opacity="0.35"/>
      <stop offset="55%" stop-color="#0a0c14" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0c14"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g font-family="Bricolage Grotesque Variable">
    <text x="80" y="150" fill="#ffd166" font-size="30" font-weight="700" letter-spacing="6">✦ AGENDA DES CONCERTS · MORBIHAN</text>
    <text x="76" y="290" fill="#f6f4ee" font-size="130" font-weight="800" letter-spacing="-5">CE QUI VA</text>
    <text x="76" y="410" fill="#f6f4ee" font-size="130" font-weight="800" letter-spacing="-5">FAIRE DU <tspan fill="#ff5d3b">BRUIT.</tspan></text>
    <text x="80" y="540" fill="#98a3c0" font-size="34" font-weight="500">Lorient · Vannes · Auray · Erdeven · Étel · Quiberon</text>
  </g>
</svg>`;

const r = new Resvg(svg, { font: { fontBuffers: [fontBuf], defaultFontFamily: 'Bricolage Grotesque Variable' }, fitTo: { mode: 'width', value: 1200 } });
await writeFile('public/og.png', r.render().asPng());
console.log('✓ public/og.png généré');
