import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { siteConfig } from "./src/app/site-config.js";

const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: siteConfig.name,
        short_name: siteConfig.shortName,
        description: siteConfig.description,
        start_url: base,
        scope: base,
        display: "standalone",
        background_color: siteConfig.backgroundColor,
        theme_color: siteConfig.themeColor,
        icons: [
          { src: `${base}icons/esmes-playground-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${base}icons/esmes-playground-512.png`, sizes: "512x512", type: "image/png" },
          {
            src: `${base}icons/esmes-playground-maskable-512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
