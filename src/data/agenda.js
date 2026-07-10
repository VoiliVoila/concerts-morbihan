// Helpers for reading events.json, shared by the pages (home, venues,
// weekend, feeds). All dates handled here are the naive
// "2026-06-20T20:00:00" strings from events.json: we compare/slice strings,
// never through a local new Date() (see src/data/format.js).

import { normalise } from './secteurs.js';

// Concerts for a tracked venue: matched on the `lieu` field
// (case/accent-insensitive), same logic as the Venues page.
export function concertsDeSalle(events, cle) {
  const k = normalise(cle);
  return events.filter((e) => normalise(e.lieu).includes(k));
}

// Groups events (already sorted by date) by month: [{ ym: '2026-07', events }].
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

// Today's date in Paris, as YYYY-MM-DD (the build runs in UTC).
export function aujourdhuiParis() {
  return new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date());
}

// Bounds (inclusive) of the "relevant" upcoming weekend at build time, as
// YYYY-MM-DD: from the next Friday through the following Sunday — or from
// today if we're already in the weekend (Fri/Sat/Sun). The site is rebuilt
// daily, so the page stays fresh.
export function bornesWeekend() {
  const auj = aujourdhuiParis();
  const [y, m, d] = auj.split('-').map(Number);
  const base = Date.UTC(y, m - 1, d);
  const dow = new Date(base).getUTCDay(); // 0 = Sunday … 6 = Saturday
  const ymd = (t) => new Date(t).toISOString().slice(0, 10);
  const JOUR = 864e5;
  if (dow === 5 || dow === 6 || dow === 0) {
    const versDim = (7 - dow) % 7;
    return [auj, ymd(base + versDim * JOUR)];
  }
  const ven = base + (5 - dow) * JOUR;
  return [ymd(ven), ymd(ven + 2 * JOUR)];
}

// Concerts whose date falls within the upcoming weekend.
export function concertsDuWeekend(events) {
  const [debut, fin] = bornesWeekend();
  return events.filter((e) => {
    const j = e.debut.slice(0, 10);
    return j >= debut && j <= fin;
  });
}
