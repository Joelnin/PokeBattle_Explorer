import ExternalPokemonServices from "./ExternalPokemonServices.mjs";
import PokemonList from "./PokemonList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalPokemonServices();

const listElement = document.querySelector(".pokemon-list");
const filterElement = document.querySelector(".type-filter");

const pokemonList = new PokemonList(dataSource, listElement, filterElement);
pokemonList.init();
