import ExternalPokemonServices from "./ExternalPokemonServices.mjs";
import PokemonDetails from "./PokemonDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const pokemonID = getParam("pokemon");

const dataSource = new ExternalPokemonServices();

const pokemon = new PokemonDetails(pokemonID, dataSource);

pokemon.init();
