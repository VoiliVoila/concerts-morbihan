// Salles « suivies » : celles pour lesquelles on a une source dédiée (scraper
// ou JSON-LD Fnac). Le reste du Morbihan est couvert via le miroir OpenAgenda.
//
// `cle` sert à rattacher les concerts d'events.json à la salle (correspondance
// sur le champ `lieu`, insensible casse/accents).

export const SALLES = [
  {
    id: 'echonova',
    nom: "L'Échonova",
    cle: 'échonova',
    ville: 'Saint-Avé',
    secteur: 'vannes',
    type: { fr: 'Scène de musiques actuelles (SMAC)', en: 'Contemporary music venue (SMAC)' },
    site: 'https://lechonova.com',
    desc: {
      fr: "La SMAC du pays de Vannes : salle de 600 places dédiée aux musiques actuelles, des découvertes aux têtes d'affiche.",
      en: 'The Vannes-area contemporary music venue: a 600-capacity room for live music, from new acts to headliners.',
    },
  },
  {
    id: 'hydrophone',
    nom: 'Hydrophone',
    cle: 'hydrophone',
    ville: 'Lorient',
    secteur: 'lorient',
    type: { fr: 'Scène de musiques actuelles (SMAC)', en: 'Contemporary music venue (SMAC)' },
    site: 'https://www.hydrophone.fr',
    desc: {
      fr: "La scène de musiques actuelles de Lorient (ex-Manège), programmation pointue rock, électro, chanson et indé.",
      en: "Lorient's contemporary music venue (formerly Le Manège), with a sharp rock, electro, chanson and indie line-up.",
    },
  },
  {
    id: 'coota',
    nom: 'Le Coota',
    cle: 'coota',
    ville: 'Erdeven',
    secteur: 'erdeven',
    type: { fr: 'Bar-concert', en: 'Live music bar' },
    site: 'https://lecoota.fr',
    desc: {
      fr: "Bar-concert convivial à Kerhillio (Erdeven), concerts live tout au long de la saison estivale.",
      en: 'A friendly live music bar in Kerhillio (Erdeven), with gigs throughout the summer season.',
    },
  },
  {
    id: 'palais-arts',
    nom: 'Palais des Arts (Salle Lesage)',
    cle: 'palais des arts',
    ville: 'Vannes',
    secteur: 'vannes',
    type: { fr: 'Salle de spectacle', en: 'Concert hall' },
    site: 'https://www.fnacspectacles.com/venue/palais-des-arts-salle-lesage-vannes-84776/',
    desc: {
      fr: "Grande salle de spectacle de Vannes, accueillant concerts, tournées et spectacles musicaux.",
      en: 'A large Vannes concert hall hosting gigs, touring shows and musical events.',
    },
  },
  {
    id: 'palais-congres',
    nom: 'Palais des Congrès',
    cle: 'palais des congrès',
    ville: 'Lorient',
    secteur: 'lorient',
    type: { fr: 'Salle de spectacle', en: 'Concert hall' },
    site: 'https://www.fnacspectacles.com/city/lorient-2112/venue/palais-des-congres-lorient-69238/',
    desc: {
      fr: "Salle de spectacle lorientaise programmant concerts et tournées nationales.",
      en: 'A Lorient concert hall programming gigs and national touring shows.',
    },
  },
  {
    id: 'parc-expos',
    nom: 'Parc des Expositions',
    cle: 'parc des expositions',
    ville: 'Lanester',
    secteur: 'lorient',
    type: { fr: 'Grande salle / Zénith', en: 'Arena / large venue' },
    site: 'https://www.fnacspectacles.com/venue/parc-des-expositions-lorient-lanester-79877/',
    desc: {
      fr: "Le grand équipement de l'agglomération lorientaise pour les concerts de grande capacité.",
      en: "The Lorient area's large-capacity venue for big concerts.",
    },
  },
];
