// Definition of the 6 areas and their associated towns (communes).
// Single source of truth shared by the fetch script (scripts/fetch-concerts.mjs)
// and the Astro pages. Town names lowercase, no accents (see normalise()).
//
// NB: some border towns could arguably belong to 2 areas (e.g. Plouharnel
// between Auray and Quiberon). Each town is listed only once: the order of
// the areas below wins in case of overlap.

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

// Neighboring areas (closest to farthest): used to suggest concerts "nearby"
// when an area has no listed dates.
export const VOISINS = {
  vannes: ['auray', 'lorient'],
  auray: ['vannes', 'quiberon', 'erdeven', 'etel'],
  lorient: ['lorient-rade', 'etel'],
  'lorient-rade': ['lorient', 'etel', 'erdeven'],
  erdeven: ['etel', 'quiberon', 'auray', 'lorient-rade'],
  etel: ['erdeven', 'lorient-rade', 'auray'],
  quiberon: ['erdeven', 'auray'],
};

// Normalizes a string for comparison: lowercase, no accents, trimmed whitespace.
export function normalise(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Builds the town -> area slug index (first area wins).
const indexCommunes = new Map();
for (const s of SECTEURS) {
  for (const c of s.communes) {
    const key = normalise(c);
    if (!indexCommunes.has(key)) indexCommunes.set(key, s.slug);
  }
}

// Returns the area slug for a town, or null if outside the covered area.
export function secteurDeVille(ville) {
  return indexCommunes.get(normalise(ville)) ?? null;
}
