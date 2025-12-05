import TcgExternalServices from "./TcgExternalServices.mjs";
import TCGDetails from "./TCGDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const cardID = getParam("card");

const dataSource = new TcgExternalServices();

const card = new TCGDetails(cardID, dataSource);

card.init();
