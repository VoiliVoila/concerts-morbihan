// Date formatting for displaying concert cards.
//
// Dates stored in events.json are naive French "wall-clock" times in the
// format "2026-06-20T20:00:00" (no timezone, see sources/_util.mjs). They
// are read here by parsing the string — definitely NOT via
// new Date() + getHours(), which would reinterpret them according to the
// build server's timezone (UTC on Cloudflare) and shift the day/hour.

const NOMS = {
  fr: {
    jours: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
    mois: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  },
  en: {
    jours: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    mois: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
};

function parts(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  return { y, mo, d, h, mi, dow: new Date(Date.UTC(y, mo - 1, d)).getUTCDay() };
}

// "sam. 20 juin · 20:30" / "Sat 20 June · 20:30" (long form).
export function formatDate(iso, lang = 'fr') {
  const p = parts(iso);
  if (!p) return '';
  const n = NOMS[lang] || NOMS.fr;
  const base = `${n.jours[p.dow]} ${p.d} ${n.mois[p.mo - 1]}`;
  const h = formatHeure(iso);
  return h ? `${base} · ${h}` : base;
}

// Compact date for card badges: "sam. 20 juin" / "Sat 20 Jun".
export function formatBadge(iso, lang = 'fr') {
  const p = parts(iso);
  if (!p) return '';
  const n = NOMS[lang] || NOMS.fr;
  return `${n.jours[p.dow]} ${p.d} ${n.mois[p.mo - 1].slice(0, lang === 'en' ? 3 : 4)}${lang === 'en' ? '' : '.'}`;
}

// Month name for group headings: "Juillet 2026" (ym = "2026-07").
export function formatMois(ym, lang = 'fr') {
  const m = String(ym).match(/^(\d{4})-(\d{2})/);
  if (!m) return '';
  const n = NOMS[lang] || NOMS.fr;
  const nom = n.mois[Number(m[2]) - 1];
  return `${nom.charAt(0).toUpperCase()}${nom.slice(1)} ${m[1]}`;
}

// Time only "20:30", or null at midnight (time not specified).
export function formatHeure(iso) {
  const p = parts(iso);
  if (!p || (p.h === 0 && p.mi === 0)) return null;
  return `${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}
