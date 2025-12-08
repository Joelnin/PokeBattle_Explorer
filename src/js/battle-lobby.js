import PokemonLobbyLists from "./PokemonLobbyLists.mjs";
import TrainerData from "./TrainerData";
import TrainerLobbyList from "./TrainerLobbyList.mjs";
import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElementPoke = document.querySelector(".pokemon-list");
const listElementTrainer = document.querySelector(".trainer-list");

const chosenContainerPoke = document.querySelector("#chosen-pokemon");
const chosenContainerTrainer = document.querySelector("#chosen-trainer");

const dataSourcePoke = getLocalStorage("so-favorites") || [];
const dataSourceTrainer = new TrainerData();

const filterElement = document.querySelector(".type-filter");

const pokemonLists = new PokemonLobbyLists(
  dataSourcePoke,
  listElementPoke,
  filterElement,
  chosenContainerPoke,
);

const trainerList = new TrainerLobbyList(
  dataSourceTrainer,
  listElementTrainer,
  chosenContainerTrainer,
);

pokemonLists.init();
trainerList.init();
