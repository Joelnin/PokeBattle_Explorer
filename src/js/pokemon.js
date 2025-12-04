import PokemonExternalServices from "./PokemonExternalServices.mjs";
import PokemonDetails from "./PokemonDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const pokemonID = getParam("pokemon");

const dataSource = new PokemonExternalServices();

const pokemon = new PokemonDetails(pokemonID, dataSource);

pokemon.init();
