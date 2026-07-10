// iCalendar feed of upcoming concerts: subscribable in Google Calendar,
// Apple Calendar, etc. Hand-rolled (no dependency). The naive dates from
// events.json (French wall-clock time) become DTSTART;TZID=Europe/Paris —
// the VTIMEZONE block below makes the file self-contained.
import data from '../data/events.json';

// Escaping of text values (RFC 5545 §3.3.11).
const esc = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

// Folds lines to 74 bytes max (RFC 5545 §3.1), continuation lines start with a space.
function plie(ligne) {
  const out = [];
  let reste = ligne;
  while (reste.length > 74) {
    out.push(reste.slice(0, 74));
    reste = ' ' + reste.slice(74);
  }
  out.push(reste);
  return out.join('\r\n');
}

// "2026-06-20T20:00:00" → "20260620T200000" (wall-clock time, TZID separate).
const dtLocal = (iso) => iso.replace(/[-:]/g, '').slice(0, 15);

export async function GET({ site }) {
  const base = (site?.href ?? 'https://concerts-morbihan.pages.dev/').replace(/\/$/, '');
  const estampille = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const events = data.events.map((e) => {
    const props = [
      'BEGIN:VEVENT',
      `UID:${esc(e.id)}@concerts-morbihan`,
      `DTSTAMP:${estampille}`,
      `DTSTART;TZID=Europe/Paris:${dtLocal(e.debut)}`,
      `SUMMARY:${esc(e.titre)}`,
      `LOCATION:${esc(`${e.lieu ? e.lieu + ', ' : ''}${e.ville}`)}`,
    ];
    if (e.description) props.push(`DESCRIPTION:${esc(e.description)}`);
    if (e.url) props.push(`URL:${esc(e.url)}`);
    props.push('END:VEVENT');
    return props;
  });

  const lignes = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Concerts Morbihan//Agenda//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Concerts Morbihan',
    `X-WR-CALDESC:Les concerts à venir dans le Morbihan — ${base}`,
    'X-WR-TIMEZONE:Europe/Paris',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Paris',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    ...events.flat(),
    'END:VCALENDAR',
  ];

  const ics = lignes.map(plie).join('\r\n') + '\r\n';
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="concerts-morbihan.ics"',
    },
  });
}
