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
    type: 'Scène de musiques actuelles (SMAC)',
    site: 'https://lechonova.com',
    desc: "La SMAC du pays de Vannes : salle de 600 places dédiée aux musiques actuelles, des découvertes aux têtes d'affiche.",
  },
  {
    id: 'hydrophone',
    nom: 'Hydrophone',
    cle: 'hydrophone',
    ville: 'Lorient',
    secteur: 'lorient',
    type: 'Scène de musiques actuelles (SMAC)',
    site: 'https://www.hydrophone.fr',
    desc: "La scène de musiques actuelles de Lorient (ex-Manège), programmation pointue rock, électro, chanson et indé.",
  },
  {
    id: 'coota',
    nom: 'Le Coota',
    cle: 'coota',
    ville: 'Erdeven',
    secteur: 'erdeven',
    type: 'Bar-concert',
    site: 'https://lecoota.fr',
    desc: "Bar-concert convivial à Kerhillio (Erdeven), concerts live tout au long de la saison estivale.",
  },
  {
    id: 'palais-arts',
    nom: 'Palais des Arts (Salle Lesage)',
    cle: 'palais des arts',
    ville: 'Vannes',
    secteur: 'vannes',
    type: 'Salle de spectacle',
    site: 'https://www.fnacspectacles.com/venue/palais-des-arts-salle-lesage-vannes-84776/',
    desc: "Grande salle de spectacle de Vannes, accueillant concerts, tournées et spectacles musicaux.",
  },
  {
    id: 'palais-congres',
    nom: 'Palais des Congrès',
    cle: 'palais des congrès',
    ville: 'Lorient',
    secteur: 'lorient',
    type: 'Salle de spectacle',
    site: 'https://www.fnacspectacles.com/city/lorient-2112/venue/palais-des-congres-lorient-69238/',
    desc: "Salle de spectacle lorientaise programmant concerts et tournées nationales.",
  },
  {
    id: 'parc-expos',
    nom: 'Parc des Expositions',
    cle: 'parc des expositions',
    ville: 'Lanester',
    secteur: 'lorient',
    type: 'Grande salle / Zénith',
    site: 'https://www.fnacspectacles.com/venue/parc-des-expositions-lorient-lanester-79877/',
    desc: "Le grand équipement de l'agglomération lorientaise pour les concerts de grande capacité.",
  },
];
