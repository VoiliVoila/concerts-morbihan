# Concerts Morbihan

Agenda indépendant des concerts à venir dans le Morbihan (Vannes, Auray,
Lorient, Rade de Lorient, Erdeven, Étel, Quiberon). Site statique généré avec
[Astro](https://astro.build), sans base de données ni backend : les données
sont récupérées au build, agrégées, dédoublonnées, puis figées dans un JSON
statique.

**→ [concerts.lajetee.fr](https://concerts.lajetee.fr)**

## Fonctionnalités

- Agenda complet + pages par secteur, par salle, et « ce week-end »
- Recherche et filtres (secteur, période) côté client, sans JS lourd
- Flux RSS et export iCal
- Données JSON-LD (`MusicEvent`) pour le SEO sémantique
- Bilingue FR / EN
- Rafraîchissement quotidien automatique (GitHub Actions)

## Stack

- [Astro 6](https://astro.build) (statique, `output: static`), CSS vanilla
- Hébergement [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cheerio](https://cheerio.js.org/) pour le scraping HTML des sites de salles

## Architecture

```
src/sources/*.mjs            une source par origine (chacune exporte
        │                    `meta` + `recuperer()` → événements normalisés)
        │   • opendatasoft.mjs   miroir public OpenAgenda (tout le département)
        │   • echonova.mjs       scraper L'Échonova, Saint-Avé
        │   • hydrophone.mjs     scraper Hydrophone, Lorient
        │   • coota.mjs          scraper Le Coota, Erdeven
        │   • fnac.mjs           JSON-LD MusicEvent des salles vendant via Fnac
        ▼
scripts/fetch-concerts.mjs   orchestrateur : fusionne, filtre, dédoublonne,
        │                    trie → events.json (tolérant : une source en
        │                    panne n'arrête pas le build)
        ▼
src/data/events.json         données générées (non éditées à la main)
        ▼
src/pages/                   accueil, [secteur].astro, salles/[salle].astro,
                              ce-week-end, flux RSS + export iCal
```

### Sources de données

Chaque source renvoie des événements au format normalisé
`{ titre, debut, ville, lieu, secteur, description, image, url, source }`.

- **opendatasoft** — dataset public `evenements-publics-openagenda` (miroir
  OpenAgenda), API Explore v2.1, sans clé. Couvre tout le département mais
  flux bruité (filtré en 3 temps : sources exclues, signal musical, exclusion
  du non-musical).
- **Scrapers de salles** (`echonova`, `hydrophone`, `coota`) — lecture directe
  du HTML des sites de salles, car les grandes salles ne publient pas sur
  OpenAgenda.
- **fnac** — lecture du JSON-LD `MusicEvent` des pages salles Fnac Spectacles
  (données publiques, robustes), pour les salles programmant des concerts en
  tournée nationale.

Les affiches ne sont jamais réhébergées : le champ `image` pointe toujours
vers l'URL d'origine (droits réservés à leurs ayants droit, mention en pied
de page).

### Un piège de fuseau horaire résolu

Les dates dans `events.json` sont stockées en heure « murale » française
naïve (`2026-06-20T20:00:00`, sans `Z`). Le rendu ne passe jamais par
`new Date().getHours()` ni `toISOString()`, pour éviter un décalage de
jour/heure au build (qui tourne en UTC sur Cloudflare). Voir
`src/sources/_util.mjs` et `src/data/format.js`.

## Développement local

```bash
npm ci
npm run dev          # serveur de dev Astro
npm run build:fetch  # récupère les données puis build (= ce que fait Cloudflare)
npm run preview      # sert dist/ en local
```

## Déploiement

Le site est entièrement statique et hébergé sur **Cloudflare Pages**, connecté
au dépôt Git : chaque push sur `main` déclenche un rebuild (`npm run build`,
sortie `dist/`).

Les dates figées au build sont rafraîchies chaque jour par un workflow
**GitHub Actions** (`.github/workflows/refresh.yml`) : il relance la
récupération des données, committe `events.json` s'il a changé, et pousse —
ce qui déclenche automatiquement le rebuild Cloudflare. Aucun secret requis.

## Licence

Code source disponible sous licence MIT. Les visuels (affiches de concerts)
restent la propriété de leurs ayants droit respectifs et ne sont pas
réhébergés par ce projet.
