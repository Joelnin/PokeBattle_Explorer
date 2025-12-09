import BattleDetails from "./BattleDetails.mjs";
import { getSessionStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSourcePlayer = getSessionStorage("battle-team") || [];
const dataSourceComputer = getSessionStorage("so-trainer") || "{}";

const listElementPlayer = document.querySelector(".pokemon-list");
const listElemenComputer = document.querySelector(".opponent-list");

const battle = new BattleDetails(
  dataSourceComputer,
  listElemenComputer,
  dataSourcePlayer,
  listElementPlayer,
);

battle.init();
