// Helpers de lecture d'events.json partagés par les pages (accueil, salles,
// week-end, flux). Toutes les dates manipulées ici sont les chaînes naïves
// « 2026-06-20T20:00:00 » d'events.json : on compare/découpe les chaînes,
// jamais via new Date() local (cf. src/data/format.js).

import { normalise } from './secteurs.js';

// Concerts d'une salle suivie : correspondance sur le champ `lieu`
// (insensible casse/accents), même logique que la page Salles.
export function concertsDeSalle(events, cle) {
  const k = normalise(cle);
  return events.filter((e) => normalise(e.lieu).includes(k));
}

// Regroupe les events (déjà triés par date) par mois : [{ ym: '2026-07', events }].
export function groupesParMois(events) {
  const groupes = [];
  for (const e of events) {
    const ym = e.debut.slice(0, 7);
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.ym === ym) dernier.events.push(e);
    else groupes.push({ ym, events: [e] });
  }
  return groupes;
}

// Date du jour à Paris au format YYYY-MM-DD (le build tourne en UTC).
export function aujourdhuiParis() {
  return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date());
}

// Bornes (incluses) du week-end « pertinent » au moment du build, en YYYY-MM-DD :
// du prochain vendredi au dimanche suivant — ou du jour même si on est déjà
// dans le week-end (ven/sam/dim). Le site est rebâti chaque jour, donc la
// page reste fraîche.
export function bornesWeekend() {
  const auj = aujourdhuiParis();
  const [y, m, d] = auj.split('-').map(Number);
  const base = Date.UTC(y, m - 1, d);
  const dow = new Date(base).getUTCDay(); // 0 = dimanche … 6 = samedi
  const ymd = (t) => new Date(t).toISOString().slice(0, 10);
  const JOUR = 864e5;
  if (dow === 5 || dow === 6 || dow === 0) {
    const versDim = (7 - dow) % 7;
    return [auj, ymd(base + versDim * JOUR)];
  }
  const ven = base + (5 - dow) * JOUR;
  return [ymd(ven), ymd(ven + 2 * JOUR)];
}

// Concerts dont la date tombe dans le week-end à venir.
export function concertsDuWeekend(events) {
  const [debut, fin] = bornesWeekend();
  return events.filter((e) => {
    const j = e.debut.slice(0, 10);
    return j >= debut && j <= fin;
  });
}
