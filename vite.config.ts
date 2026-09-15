import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
  base: "/geo-ai-explorer/",

  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-start",
    ],
  },

  plugins: [
    devtools(),

    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),

    tailwindcss(),

    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),

    viteReact(),
  ],
});