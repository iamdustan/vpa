// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://iamdustan.github.io',
  base: '/vpa',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [markdoc(), react(), keystatic()]
});
