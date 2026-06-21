// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site statique servi par Cloudflare Pages.
export default defineConfig({
  site: 'https://concerts-morbihan.pages.dev',
  integrations: [sitemap()],
  trailingSlash: 'never',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // /vannes.html plutôt que /vannes/index.html : Cloudflare Pages sert alors
    // /vannes en 200 direct, sans redirection 308. Cohérent avec trailingSlash.
    format: 'file',
  },
});
