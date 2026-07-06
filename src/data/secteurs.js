// Définition des 6 secteurs et des communes rattachées.
// Source unique partagée par le script de récupération (scripts/fetch-concerts.mjs)
// et les pages Astro. Communes en minuscules, sans accent (cf. normalise()).
//
// NB : certaines communes limitrophes pourraient appartenir à 2 secteurs
// (ex. Plouharnel entre Auray et Quiberon). Chaque commune n'est listée
// qu'une fois : l'ordre des secteurs ci-dessous fait foi en cas de doublon.

export const SECTEURS = [
  {
    slug: 'vannes',
    nom: 'Vannes',
    communes: [
      'vannes', 'saint-ave', 'sene', 'arradon', 'ploeren', 'theix', 'theix-noyalo',
      'surzur', 'le bono', 'baden', 'larmor-baden', 'plescop', 'meucon', 'elven',
      'saint-nolff', 'trefflean', 'la trinite-surzur', 'monterblanc',
    ],
  },
  {
    slug: 'auray',
    nom: 'Auray',
    communes: [
      'auray', 'pluneret', "brec'h", 'brech', 'crach', "sainte-anne-d'auray",
      'sainte-anne-d auray', 'carnac', 'la trinite-sur-mer', 'locmariaquer',
      'pluvigner', 'camors', 'sainte-anne', 'plougoumelen',
    ],
  },
  {
    slug: 'lorient',
    nom: 'Lorient',
    communes: [
      'lorient', 'lanester', 'ploemeur', 'larmor-plage', 'hennebont', 'queven',
      'caudan', 'guidel', 'gestel', 'pont-scorff', 'inzinzac-lochrist',
      'languidic', 'cleguer',
    ],
  },
  {
    slug: 'lorient-rade',
    nom: 'Rade de Lorient (Port-Louis)',
    communes: ['port-louis', 'riantec', 'gavres', 'locmiquelic', 'plouhinec',
      'sainte-helene', 'nostang'],
  },
  {
    slug: 'erdeven',
    nom: 'Erdeven',
    communes: ['erdeven', 'ploemel', 'belz'],
  },
  {
    slug: 'etel',
    nom: 'Étel',
    communes: ['etel', 'locoal-mendon', 'belz', 'merlevenez'],
  },
  {
    slug: 'quiberon',
    nom: 'Quiberon',
    communes: ['quiberon', 'saint-pierre-quiberon', 'plouharnel', 'carnac-plage'],
  },
];

// Secteurs voisins (du plus proche au plus lointain) : sert à suggérer des
// concerts « pas loin » quand un secteur n'a aucune date recensée.
export const VOISINS = {
  vannes: ['auray', 'lorient'],
  auray: ['vannes', 'quiberon', 'erdeven', 'etel'],
  lorient: ['lorient-rade', 'etel'],
  'lorient-rade': ['lorient', 'etel', 'erdeven'],
  erdeven: ['etel', 'quiberon', 'auray', 'lorient-rade'],
  etel: ['erdeven', 'lorient-rade', 'auray'],
  quiberon: ['erdeven', 'auray'],
};

// Normalise une chaîne pour comparaison : minuscule, sans accent, espaces nettoyés.
export function normalise(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Construit l'index commune -> slug de secteur (premier secteur gagnant).
const indexCommunes = new Map();
for (const s of SECTEURS) {
  for (const c of s.communes) {
    const key = normalise(c);
    if (!indexCommunes.has(key)) indexCommunes.set(key, s.slug);
  }
}

// Retourne le slug du secteur d'une ville, ou null si hors périmètre.
export function secteurDeVille(ville) {
  return indexCommunes.get(normalise(ville)) ?? null;
}
