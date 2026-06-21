// Formatage des dates pour l'affichage des cartes concert.
//
// Les dates stockées dans events.json sont des heures « murales » françaises au
// format naïf « 2026-06-20T20:00:00 » (sans fuseau, cf. sources/_util.mjs). On
// les lit ici par parsing de chaîne — surtout PAS via new Date() + getHours(),
// qui réinterpréterait selon le fuseau du serveur de build (UTC sur Cloudflare)
// et décalerait jour/heure.

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

// "sam. 20 juin · 20:30" / "Sat 20 June · 20:30".
export function formatDate(iso, lang = 'fr') {
  const p = parts(iso);
  if (!p) return '';
  const n = NOMS[lang] || NOMS.fr;
  const base = `${n.jours[p.dow]} ${p.d} ${n.mois[p.mo - 1]}`;
  const h = formatHeure(iso);
  return h ? `${base} · ${h}` : base;
}

// Date compacte pour les badges de carte : "sam. 20 juin" / "Sat 20 Jun".
export function formatBadge(iso, lang = 'fr') {
  const p = parts(iso);
  if (!p) return '';
  const n = NOMS[lang] || NOMS.fr;
  return `${n.jours[p.dow]} ${p.d} ${n.mois[p.mo - 1].slice(0, lang === 'en' ? 3 : 4)}${lang === 'en' ? '' : '.'}`;
}

// Heure seule "20:30", ou null si minuit (heure non renseignée).
export function formatHeure(iso) {
  const p = parts(iso);
  if (!p || (p.h === 0 && p.mi === 0)) return null;
  return `${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}
