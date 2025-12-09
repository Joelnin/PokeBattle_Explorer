import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        pokemon_listing: resolve(__dirname, "src/pokemon_listing/index.html"),
        pokemon_pages: resolve(__dirname, "src/pokemon_pages/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),

        tcg_listing: resolve(__dirname, "src/tcg_listing/index.html"),
        tcg_pages: resolve(__dirname, "src/tcg_pages/index.html"),
        collections: resolve(__dirname, "src/collections/index.html"),

        battle_lobby: resolve(__dirname, "src/battle_lobby/index.html"),
        battle_pages: resolve(__dirname, "src/battle_pages/index.html"),
      },
    },
  },
});
