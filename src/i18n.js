// i18n: FR (default, at the root) / EN (under /en/).
// A single dictionary; pages receive `lang` and call t(lang).

export const LANGS = ['fr', 'en'];

// Infers the language from the URL path.
export function getLang(url) {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'fr';
}

// Equivalent path in the other language (for the language switcher).
export function otherLangPath(pathname) {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/en') return '/';
  if (p.startsWith('/en/')) return p.slice(3); // /en/salles -> /salles
  return p === '/' ? '/en' : '/en' + p;
}

// Language prefix for building internal links.
export const prefix = (lang) => (lang === 'en' ? '/en' : '');

const STR = {
  fr: {
    'nav.concerts': 'Concerts',
    'nav.weekend': 'Ce week-end',
    'nav.venues': 'Salles',
    'nav.about': 'À propos',
    'home.eyebrow': 'Agenda des concerts · Morbihan',
    'home.title1': 'Ce qui va', 'home.titleTrait': 'faire', 'home.title2': 'du', 'home.titleAccent': 'bruit.',
    'home.sub': 'Tous les concerts à venir dans le Morbihan — de Lorient à Vannes, en passant par Auray, Erdeven, Étel et Quiberon.',
    'home.subStats': (t, w) => `<b>${t} dates</b> à venir, dont <b>${w} cette semaine</b>. Mis à jour chaque jour.`,
    'home.allTitle': 'Tous les concerts',
    'home.shown': (n) => `${n} dates affichées`,
    'filter.area': 'Secteur', 'filter.allAreas': 'Tous les secteurs',
    'filter.when': 'Quand', 'filter.anytime': "N'importe quand",
    'filter.weekend': 'Ce week-end', 'filter.week': 'Cette semaine (7 j)', 'filter.month': 'Ce mois-ci',
    'filter.search': 'Rechercher', 'filter.searchPh': 'Artiste, salle, ville…',
    'filter.reset': 'Réinitialiser', 'filter.empty': 'Aucun concert ne correspond à ces filtres.',
    'list.empty': 'Aucun concert à venir recensé ici pour le moment. Revenez bientôt !',
    'back': '← Tous les concerts',
    'sector.eyebrow': 'Secteur', 'sector.upcoming': 'À venir',
    'sector.nearby': 'En attendant, pas loin',
    'wk.eyebrow': 'Sortir ce week-end', 'wk.title': 'Ce', 'wk.titleAccent': 'week-end.',
    'wk.sub': (n, plage) => n > 0
      ? `${n} concert${n > 1 ? 's' : ''} dans le Morbihan ${plage} — recalculé chaque jour.`
      : `Aucun concert recensé ${plage} — les prochaines dates sont sur l'agenda complet.`,
    'wk.upcoming': 'Au programme',
    'venue.eyebrow': 'Salle', 'venue.allVenues': '← Toutes les salles',
    'venue.dates': (n) => n > 0 ? `${n} date${n > 1 ? 's' : ''} à venir dans cette salle.` : 'Aucune date à venir recensée pour le moment — revenez bientôt.',
    'venue.upcoming': 'Prochains concerts',
    'venues.prog': 'Programmation →',
    'sector.count': (n) => `${n} date${n > 1 ? 's' : ''}`,
    'sector.sub': (n) => n > 0 ? `${n} concert${n > 1 ? 's' : ''} à venir sur ce secteur du Morbihan.` : 'Aucun concert recensé sur ce secteur pour le moment — revenez bientôt.',
    'venues.eyebrow': 'Les lieux', 'venues.titleAccent': 'salles.', 'venues.title': 'Les',
    'venues.sub': 'Les salles du Morbihan dont nous suivons la programmation au plus près. Le reste des concerts du département est couvert via l\'agenda public OpenAgenda.',
    'venues.upcoming': 'à venir', 'venues.areaGigs': 'Concerts du secteur →', 'venues.site': 'Site officiel ↗',
    'about.eyebrow': 'À propos', 'about.title': 'Le', 'about.titleAccent': 'projet.',
    'about.sub': 'Un agenda local et indépendant pour ne plus rater un concert près de chez soi, de Lorient à Vannes.',
    'foot.tagline': "L'agenda indépendant des concerts à venir autour de Vannes, Auray, Lorient, Erdeven, Étel et Quiberon. Mis à jour chaque jour.",
    'foot.byArea': 'Concerts par secteur',
    'foot.follow': 'Suivre l\'agenda :', 'foot.rss': 'flux RSS', 'foot.ics': 'calendrier (.ics)',
    'foot.credit': 'Conçu par',
  },
  en: {
    'nav.concerts': 'Gigs',
    'nav.weekend': 'This weekend',
    'nav.venues': 'Venues',
    'nav.about': 'About',
    'home.eyebrow': 'Live music guide · Morbihan',
    'home.title1': 'Where it', 'home.titleTrait': 'gets', 'home.title2': '', 'home.titleAccent': 'loud.',
    'home.sub': 'Every upcoming gig in Morbihan — from Lorient to Vannes, via Auray, Erdeven, Étel and Quiberon.',
    'home.subStats': (t, w) => `<b>${t} dates</b> ahead, <b>${w} this week</b>. Updated daily.`,
    'home.allTitle': 'All gigs',
    'home.shown': (n) => `${n} dates shown`,
    'filter.area': 'Area', 'filter.allAreas': 'All areas',
    'filter.when': 'When', 'filter.anytime': 'Anytime',
    'filter.weekend': 'This weekend', 'filter.week': 'This week (7d)', 'filter.month': 'This month',
    'filter.search': 'Search', 'filter.searchPh': 'Artist, venue, town…',
    'filter.reset': 'Reset', 'filter.empty': 'No gigs match these filters.',
    'list.empty': 'No upcoming gigs listed here yet. Check back soon!',
    'back': '← All gigs',
    'sector.eyebrow': 'Area', 'sector.upcoming': 'Upcoming',
    'sector.nearby': 'Meanwhile, not far away',
    'wk.eyebrow': 'Going out this weekend', 'wk.title': 'This', 'wk.titleAccent': 'weekend.',
    'wk.sub': (n, plage) => n > 0
      ? `${n} gig${n > 1 ? 's' : ''} in Morbihan ${plage}. Recomputed daily.`
      : `No gigs listed ${plage} — upcoming dates are on the full guide.`,
    'wk.upcoming': 'On this weekend',
    'venue.eyebrow': 'Venue', 'venue.allVenues': '← All venues',
    'venue.dates': (n) => n > 0 ? `${n} upcoming date${n > 1 ? 's' : ''} at this venue.` : 'No upcoming dates listed yet — check back soon.',
    'venue.upcoming': 'Upcoming gigs',
    'venues.prog': 'Programme →',
    'sector.count': (n) => `${n} date${n > 1 ? 's' : ''}`,
    'sector.sub': (n) => n > 0 ? `${n} upcoming gig${n > 1 ? 's' : ''} in this area of Morbihan.` : 'No gigs listed in this area yet — check back soon.',
    'venues.eyebrow': 'The venues', 'venues.titleAccent': 'venues.', 'venues.title': 'The',
    'venues.sub': 'The Morbihan venues whose programme we track closely. The rest of the county is covered via the public OpenAgenda directory.',
    'venues.upcoming': 'upcoming', 'venues.areaGigs': 'Area gigs →', 'venues.site': 'Official site ↗',
    'about.eyebrow': 'About', 'about.title': 'The', 'about.titleAccent': 'project.',
    'about.sub': 'An independent local guide so you never miss a gig near you, from Lorient to Vannes.',
    'foot.tagline': 'The independent guide to upcoming gigs around Vannes, Auray, Lorient, Erdeven, Étel and Quiberon. Updated daily.',
    'foot.byArea': 'Gigs by area',
    'foot.follow': 'Follow the guide:', 'foot.rss': 'RSS feed', 'foot.ics': 'calendar (.ics)',
    'foot.credit': 'Designed by',
  },
};

export function t(lang, key, ...args) {
  const v = (STR[lang] || STR.fr)[key];
  return typeof v === 'function' ? v(...args) : v;
}
