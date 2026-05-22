// @ts-check
import { defineConfig, svgoOptimizer } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import sitemap from "@astrojs/sitemap"
import { loadEnv } from "vite"

const { URL } = loadEnv(import.meta.env.MODE, process.cwd(), "")

// https://astro.build/config
export default defineConfig({
  site: URL,
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
})

