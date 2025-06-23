// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  site: 'https://dnd35api.com',
});
