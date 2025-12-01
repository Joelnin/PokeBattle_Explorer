import ExternalTCGServices from "./ExternalTCGServices.mjs";
import TCGSearch from "./TCGSearch.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ExternalTCGServices();

const searchInput = document.getElementById("tcgSearchInput");
const listElement = document.querySelector(".TCG-list");
const paginationElement = document.querySelector(".pagination");

const search = new TCGSearch(searchInput, dataSource, listElement, paginationElement);
search.init();
