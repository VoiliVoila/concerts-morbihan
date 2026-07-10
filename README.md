# Concerts Morbihan

Independent listings site for upcoming concerts in Morbihan, France (Vannes,
Auray, Lorient, Rade de Lorient, Erdeven, Étel, Quiberon). Static site built
with [Astro](https://astro.build), no database or backend: data is fetched
at build time, merged, deduplicated, and frozen into a static JSON file.

**→ [concerts.lajetee.fr](https://concerts.lajetee.fr)**

## Features

- Full listings + pages by area, by venue, and "this weekend"
- Client-side search and filters (area, date range), no heavy JS
- RSS feed and iCal export
- JSON-LD (`MusicEvent`) structured data for semantic SEO
- Bilingual FR / EN
- Automatic daily refresh (GitHub Actions)

## Stack

- [Astro 6](https://astro.build) (static, `output: static`), vanilla CSS
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cheerio](https://cheerio.js.org/) for HTML scraping of venue websites

## Architecture

```
src/sources/*.mjs            one source per origin (each exports
        │                    `meta` + `recuperer()` → normalized events)
        │   • opendatasoft.mjs   public OpenAgenda mirror (whole département)
        │   • echonova.mjs       scraper for L'Échonova, Saint-Avé
        │   • hydrophone.mjs     scraper for Hydrophone, Lorient
        │   • coota.mjs          scraper for Le Coota, Erdeven
        │   • fnac.mjs           JSON-LD MusicEvent for venues selling via Fnac
        ▼
scripts/fetch-concerts.mjs   orchestrator: merges, filters, deduplicates,
        │                    sorts → events.json (fault-tolerant: one failing
        │                    source doesn't stop the build)
        ▼
src/data/events.json         generated data (never hand-edited)
        ▼
src/pages/                   home, [secteur].astro, salles/[salle].astro,
                              ce-week-end, RSS feed + iCal export
```

### Data sources

Each source returns events in a normalized shape:
`{ titre, debut, ville, lieu, secteur, description, image, url, source }`.

- **opendatasoft** — public dataset `evenements-publics-openagenda` (OpenAgenda
  mirror), Explore API v2.1, no key required. Covers the whole département but
  the feed is noisy (filtered in 3 passes: excluded sources, music signal,
  non-music exclusion).
- **Venue scrapers** (`echonova`, `hydrophone`, `coota`) — read the venue's
  website HTML directly, since major venues don't publish to OpenAgenda.
- **fnac** — reads the `MusicEvent` JSON-LD from Fnac Spectacles venue pages
  (public, reliable data), for venues booking nationally touring acts.

Posters are never re-hosted: the `image` field always points to the original
source URL (rights reserved to their respective owners, credited in the
footer).

### A timezone trap, solved

Dates in `events.json` are stored as naive French "wall-clock" time
(`2026-06-20T20:00:00`, no `Z`). Rendering never goes through
`new Date().getHours()` or `toISOString()`, to avoid a day/hour shift at
build time (which runs in UTC on Cloudflare). See `src/sources/_util.mjs`
and `src/data/format.js`.

## Local development

```bash
npm ci
npm run dev          # Astro dev server
npm run build:fetch  # fetch data then build (what Cloudflare runs)
npm run preview      # serve dist/ locally
```

## Deployment

The site is fully static and hosted on **Cloudflare Pages**, connected to
the Git repository: every push to `main` triggers a rebuild (`npm run build`,
output `dist/`).

Dates frozen at build time are refreshed daily by a **GitHub Actions**
workflow (`.github/workflows/refresh.yml`): it reruns the data fetch,
commits `events.json` if it changed, and pushes — which automatically
triggers the Cloudflare rebuild. No secrets required.

## License

Source code available under the MIT license. Visual assets (concert
posters) remain the property of their respective rights holders and are
not re-hosted by this project.
