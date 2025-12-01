import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),
        pokemon_pages: resolve(__dirname, "src/pokemon_pages/index.html"),
        pokemon_listing: resolve(__dirname, "src/pokemon_listing/index.html"),
        tcg_listing: resolve(__dirname, "src/tcg_listing/index.html"),
      },
    },
  },
});
