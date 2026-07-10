// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site served by Cloudflare Pages, under the concerts.lajetee.fr subdomain.
export default defineConfig({
  site: 'https://concerts.lajetee.fr',
  integrations: [sitemap()],
  trailingSlash: 'never',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // /vannes.html rather than /vannes/index.html: Cloudflare Pages then serves
    // /vannes directly with a 200, no 308 redirect. Consistent with trailingSlash.
    format: 'file',
  },
});
