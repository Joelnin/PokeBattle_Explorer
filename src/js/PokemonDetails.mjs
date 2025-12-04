import { capitalizeFirstLetter, getLocalStorage, setLocalStorage } from "./utils.mjs";


export default class PokemonDetails {
  constructor(pokemonId, dataSource) {
    this.pokemonId = pokemonId;
    this.pokemon = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.pokemon = await this.dataSource.findPokemonById(this.pokemonId);
    this.renderPokemonDetails();

       

    document.getElementById("addToFavorites").addEventListener("click", this.addToFavorites.bind(this));
  }

  addToFavorites() {

    const favorites = getLocalStorage("so-favorites") || [];

    // const exists = favorites.find((poke) => poke.id === this.pokemon.id);

    if (!pokemonExist(this.pokemon.id)) {
     favorites.push(this.pokemon);
    }


    setLocalStorage("so-favorites", favorites);
    isFavorite(this.pokemon.id);

  }

  renderPokemonDetails() {

    const pokemon = this.pokemon

    // Name of the pokemon
    let pokemonName = document.querySelector(".pokemon-name");
    pokemonName.textContent = capitalizeFirstLetter(pokemon.name);

    // Pokemon image
    let pokemonImage = document.getElementById("pokemonImage");
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = `${capitalizeFirstLetter(pokemon.name)} original art image`;

    // Pokemon Type(s)
    let types = document.querySelector(".pokemon-types");
    types.textContent = capitalizeFirstLetter(pokemon.types.join(", "));

    // Weight of the pokemon
    let pokemonWeight = document.querySelector(".pokemon-weight");
    pokemonWeight.textContent = capitalizeFirstLetter(pokemon.weight);

    // Height of the pokemon
    let pokemonHeight = document.querySelector(".pokemon-height");
    pokemonHeight.textContent = capitalizeFirstLetter(pokemon.height);

    // Pokemon abilities
    let abilities = document.querySelector(".pokemon-abilities");
    abilities.textContent = capitalizeFirstLetter(pokemon.abilities.join(", ").replace(/-/g, " "));

    // Pokemon move(s)
    let moves = document.querySelector(".pokemon-moves");
    moves.textContent = capitalizeFirstLetter(pokemon.moves.join(", ").replace(/-/g, " "));

    // Pokemon Stats
    let stats = document.querySelector(".pokemon-stats");
    stats.innerHTML = pokemon.stats
      .map(
        (stat) => `
        <p><strong>${capitalizeFirstLetter(stat.name.replace(/-/g, " "))}: </strong>${stat.value}</p>
      `)
      .join("");
    
    //Add pokemon to favorites
    let addToFavorites = document.getElementById("addToFavorites")
    addToFavorites.dataset.id = pokemon.id;
    isFavorite(this.pokemon.id);

  }
}

function pokemonExist(pokemonId) {
  const favorites = getLocalStorage("so-favorites") || [];
  const exists = favorites.find((item) => item.id === pokemonId);

  if (exists) {
    return true;
  } else {
    return false;
  }
}

function isFavorite(pokemon) {

  const heart = document.querySelector("#favorite-heart")
  
   if (pokemonExist(pokemon) && !heart.classList.contains("added")) {
      heart.classList.add("added");
    }
}