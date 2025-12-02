import ExternalPokemonServices from "./ExternalPokemonServices.mjs";
import PokemonList from "./PokemonList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalPokemonServices();

const searchInput = document.getElementById("searchInput");
const listElement = document.querySelector(".pokemon-list");
const filterElement = document.querySelector(".type-filter");

const pokemonList = new PokemonList(
  searchInput,
  dataSource,
  listElement,
  filterElement,
);
pokemonList.init();
