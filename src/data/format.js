// Formatage des dates pour l'affichage des cartes concert.
//
// Les dates stockées dans events.json sont des heures « murales » françaises au
// format naïf « 2026-06-20T20:00:00 » (sans fuseau, cf. sources/_util.mjs). On
// les lit ici par parsing de chaîne — surtout PAS via new Date() + getHours(),
// qui réinterpréterait selon le fuseau du serveur de build (UTC sur Cloudflare)
// et décalerait jour/heure.

const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// "sam. 20 juin · 20:30" — l'heure est omise si elle vaut minuit (souvent
// l'heure n'est pas renseignée et tombe à 00:00).
export function formatDate(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return '';
  const [, y, mo, d, h, mi] = m.map(Number);
  // Jour de la semaine : on construit une date UTC neutre (calcul de jour
  // uniquement, aucune influence horaire).
  const jourSem = JOURS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  const base = `${jourSem} ${d} ${MOIS[mo - 1]}`;
  const heure = h === 0 && mi === 0 ? null : `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
  return heure ? `${base} · ${heure}` : base;
}
