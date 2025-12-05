import { capitalizeFirstLetter, getLocalStorage, setLocalStorage } from "./utils.mjs";


export default class TCGDetails {
  constructor(cardId, dataSource) {
    this.cardId = cardId;
    this.card = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.card = await this.dataSource.findCardById(this.cardId);
    this.renderCardDetails();

    document.getElementById("addToCollections").addEventListener("click", this.addToCollections.bind(this));
  }

  addToCollections() {
    const collection = getLocalStorage("so-collection") || [];

    if (!cardExist(this.card.id)) {
      collection.push(this.card);
    }

    setLocalStorage("so-collection", collection);
    inCollection(this.card.id);
  }

  renderCardDetails() {
    const card = this.card

    // Card Category
    let cardCategory = document.querySelector(".card-category");
    cardCategory.textContent = card.category;
    
    // CardName
    let cardName = document.querySelector(".card-name");
    cardName.textContent = card.name;
    
    // Card Image
    let cardImage = document.getElementById("card-image");
    cardImage.src = card.image;
    cardImage.alt = `${card.name} TCG card image`;

    // Rarity for the image
    let rarity = document.getElementById("card-rarity")
    rarity.textContent = card.rarity;
    
    // Known Variants

    let variants = document.getElementById("card-variants")
    variants.innerHTML = "";

    card.variants.forEach(variant => {
      const li = document.createElement("li");
      li.textContent = capitalizeFirstLetter(variant);
      variants.appendChild(li);
    });
    
    // Stats
    let hp = document.getElementById("card-hp");
    hp.textContent = card.hp;
    let types = document.getElementById("card-types");
    types.textContent = card.types.join(", ");
    let weaknesses = document.getElementById("card-weaknesses");
    weaknesses.textContent = card.weaknesses.join(", ");

    // Render attacks
    const attacks = document.getElementById("card-attacks");
    attacks.innerHTML = "";

    card.attacks.forEach((atk) => {
      const div = document.createElement("div");
      div.classList.add("attack");

      div.innerHTML = `
      <h3>${atk.name}</h3>
      <p class="attack-effect">${atk.effect}</p>
      <p><strong>Cost:</strong> ${Object.entries(atk.cost)
          .map(([type, count]) => `<span class="${type.toLowerCase()}">${type}</span> x${count} `)
          .join(", ")}</p>
    `;

      attacks.appendChild(div);
    });
    
    //Add card to collection
    let addToCollections = document.getElementById("addToCollections");
    addToCollections.dataset.id = card.id;
    inCollection(this.card.id);
  }
}

function cardExist(cardId) {
  const collection = getLocalStorage("so-collection") || [];
  const exists = collection.find((item) => item.id === cardId);

  if (exists) {
    return true;
  } else {
    return false;
  }
}

function inCollection(card) {
  const check = document.querySelector("#collection-added");
  
  if (cardExist(card) && check.classList.contains("hide")) {
    check.classList.remove("hide");
  }
}