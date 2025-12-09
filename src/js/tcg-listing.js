import TcgExternalServices from "./TcgExternalServices.mjs";
import TCGList from "./TCGList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new TcgExternalServices();

const searchInput = document.getElementById("searchInput");
const listElement = document.querySelector(".TCG-list");

const cardList = new TCGList(searchInput, dataSource, listElement);

cardList.init();
