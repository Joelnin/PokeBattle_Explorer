import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class PokemonDetails {
  constructor(pokemonId, dataSource) {
    this.pokemonId = pokemonId;
    this.pokemon = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.pokemon = await this.dataSource.findPokemonById(this.pokemonId);
    this.renderPokemonDetails();

    document
      .getElementById("addToFavorites")
      .addEventListener("click", this.addToFavorites.bind(this));
  }

  addToFavorites() {
    const favorites = getLocalStorage("favorites") || [];

    const exists = favorites.find((p) => p.id === this.pokemon.id);

    if (!exists) {
      favorites.push(this.pokemon);
    }

    setLocalStorage("favorites", favorites);
  }

  renderPokemonDetails() {
    const p = this.pokemon;

    // Nombre
    document.querySelector(".pokemon__name").textContent =
      p.name.charAt(0).toUpperCase() + p.name.slice(1);

    // Imagen
    const img = document.getElementById("pokemonImage");
    img.src = p.image;
    img.alt = p.name;

    // Tipos
    document.querySelector(".pokemon__types").textContent =
      "Type(s): " + p.types.join(", ");

    // Habilidades
    document.querySelector(".pokemon__abilities").textContent =
      "Abilities: " + p.abilities.join(", ");

    // Stats
    document.querySelector(".pokemon__stats").innerHTML =
      `<h3>Stats:</h3>` +
      p.stats
        .map(
          (s) => `
        <p><strong>${s.name}:</strong> ${s.value}</p>
      `
        )
        .join("");

    // ID en el botón
    const favBtn = document.getElementById("addToFavorites");
    favBtn.dataset.id = p.id;
  }
}
