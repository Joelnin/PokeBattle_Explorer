import ExternalTCGServices from "./ExternalTCGServices.mjs";
import TCGList from "./TCGList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalTCGServices();

const searchInput = document.getElementById("tcgSearchInput");
const listElement = document.querySelector(".TCG-list");
const paginationElement = document.querySelector(".pagination");

const search = new TCGList(
  searchInput,
  dataSource,
  listElement,
  paginationElement,
);
search.init();
