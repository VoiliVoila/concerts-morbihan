// Utilities shared by all sources (venue scrapers + API).
// French/English date parsing, year inference, HTML fetching.

import * as cheerio from 'cheerio';

const UA = 'Mozilla/5.0 (compatible; concerts-morbihan/0.1; +https://concerts-morbihan.pages.dev)';

// Month -> number (0-11). Covers long-form French, and FR/EN abbreviations.
const MOIS = {
  janvier: 0, janv: 0, jan: 0,
  fevrier: 1, fevr: 1, fev: 1, feb: 1,
  mars: 2, mar: 2,
  avril: 3, avr: 3, apr: 3,
  mai: 4, may: 4,
  juin: 5, jun: 5,
  juillet: 6, juil: 6, jui: 6, jul: 6,
  aout: 7, aug: 7,
  septembre: 8, sept: 8, sep: 8,
  octobre: 9, oct: 9,
  novembre: 10, nov: 10,
  decembre: 11, dec: 11,
};

// Normalizes (lowercase, no accents) to match month names.
function deburr(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function numeroMois(nom) {
  const k = deburr(nom).replace(/\.$/, '').trim();
  return k in MOIS ? MOIS[k] : null;
}

const pad = (n) => String(n).padStart(2, '0');

// Builds a "wall-clock" date (French local time) in ISO format WITHOUT a
// timezone ("2026-06-20T20:00:00"). Never use toISOString() here: the UTC
// conversion would roll the day back for midnight events when the build
// runs on a UTC server (Cloudflare). See format.js, which reads these
// strings as-is.
//
// If the year is missing, infer the next occurrence >= today (venues often
// don't show the year on their listings).
export function dateISO({ jour, mois, annee = null, heure = 0, minute = 0 }) {
  const m = typeof mois === 'number' ? mois : numeroMois(mois);
  if (m === null || !jour) return null;
  const now = new Date();
  let y = annee ?? now.getFullYear();
  if (annee === null) {
    const candidat = new Date(y, m, jour, heure, minute);
    if (candidat < new Date(now.getFullYear(), now.getMonth(), now.getDate())) y += 1;
  }
  return `${y}-${pad(m + 1)}-${pad(jour)}T${pad(heure)}:${pad(minute)}:00`;
}

// Converts a UTC instant (ISO with timezone, e.g. OpenAgenda's
// firstdate_begin) into a naive French "wall-clock" time, to keep it
// consistent with dateISO().
const PARTS = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
});
export function versParis(isoUtc) {
  if (!isoUtc) return null;
  const d = new Date(isoUtc);
  if (Number.isNaN(d.getTime())) return null;
  const p = Object.fromEntries(PARTS.formatToParts(d).map((x) => [x.type, x.value]));
  let h = p.hour === '24' ? '00' : p.hour;
  return `${p.year}-${p.month}-${p.day}T${h}:${p.minute}:00`;
}

// Fetches the HTML of a URL and returns a loaded cheerio instance.
export async function chargerHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return cheerio.load(await res.text());
}

// Cleans up text (whitespace, leftover entities).
export function texte(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

// Resolves a possibly relative URL against a base.
export function absolu(base, href) {
  if (!href) return null;
  try { return new URL(href, base).href; } catch { return null; }
}
