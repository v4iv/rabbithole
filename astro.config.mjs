// @ts-check
import { defineConfig, svgoOptimizer } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import sitemap from "@astrojs/sitemap"
import { loadEnv } from "vite"

import partytown from "@astrojs/partytown"

const { URL = "https://rabbitholeartstudio.com" } = loadEnv(
  import.meta.env.MODE,
  process.cwd(),
  "",
)

// https://astro.build/config
export default defineConfig({
  site: URL || "https://rabbitholeartstudio.com",
  image: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
})
