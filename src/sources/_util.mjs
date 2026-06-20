// Utilitaires partagés par les sources (scrapers de salles + API).
// Parsing de dates françaises/anglaises, inférence d'année, fetch HTML.

import * as cheerio from 'cheerio';

const UA = 'Mozilla/5.0 (compatible; concerts-morbihan/0.1; +https://concerts-morbihan.pages.dev)';

// Mois -> numéro (0-11). Couvre formes longues FR, abréviations FR et EN.
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

// Normalise (minuscule, sans accent) pour matcher les noms de mois.
function deburr(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function numeroMois(nom) {
  const k = deburr(nom).replace(/\.$/, '').trim();
  return k in MOIS ? MOIS[k] : null;
}

const pad = (n) => String(n).padStart(2, '0');

// Construit une date « murale » (heure locale française) au format ISO SANS
// fuseau (« 2026-06-20T20:00:00 »). On n'utilise jamais toISOString() ici :
// la conversion UTC ferait reculer le jour pour les événements à minuit quand
// le build tourne sur un serveur en UTC (Cloudflare). Voir format.js qui lit
// ces chaînes telles quelles.
//
// Si l'année est absente, on infère la prochaine occurrence >= aujourd'hui
// (les salles n'affichent souvent pas l'année sur leurs listings).
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

// Convertit un instant UTC (ISO avec fuseau, ex. firstdate_begin d'OpenAgenda)
// en heure « murale » française naïve, pour homogénéiser avec dateISO().
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

// Récupère le HTML d'une URL et renvoie une instance cheerio chargée.
export async function chargerHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return cheerio.load(await res.text());
}

// Nettoie un texte (espaces, entités résiduelles).
export function texte(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

// Résout une URL éventuellement relative par rapport à une base.
export function absolu(base, href) {
  if (!href) return null;
  try { return new URL(href, base).href; } catch { return null; }
}
