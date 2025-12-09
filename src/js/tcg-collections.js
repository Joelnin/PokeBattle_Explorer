import {
  capitalizeFirstLetter,
  getLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function cardTemplate(card) {
  return `
    <li class="pokemon-card go-round">
      <div class="card-side front">
        <img src="${card.image}" alt="${card.name} card picture">
        
      </div>
      <div class="card-side back">
        <a class="collection"  href="/tcg_pages/index.html?card=${card.id}"><img src="${card.image}" alt="${card.name} card picture"></a>
        <div class="pokemon-stats-container">
        <h2>${card.name}</h2>
<p><i>${capitalizeFirstLetter(card.rarity)}</i></p>

          <h3>Stats</h3>
        <div class="pokemon-stats">
        <p><strong>HP: </strong><span id="card-hp">${card.hp}</span></p>
          <p><strong>Types: </strong>${card.types.join(", ")}</span>.</p>
          <p><strong>Weaknesses: </strong><span id="card-weaknesses">${card.weaknesses.join(", ")}</span>.</p>
        </div>
        </div>
        <button title="Remove from Collection" class="remove-item" data-id="${card.id}">🗑️</button>
      </div>
      
    </li>
  `;
}

function renderCollection() {
  const collection = getLocalStorage("so-collection");
  const colList = document.querySelector(".collection-list");
  const colInfo = document.querySelector(".collection-info");

  if (collection == 0 || !collection) {
    colList.innerHTML = `<div class="no-fave"><h2 >No cards added to your collection Yet</h2>
    <p>There are no Cards here yet. Add some from <a href="/tcg_listing/">here</a> by going to any card and clicking "Collection."</p>
    `;
    colInfo.innerHTML = "";
    return;
  }

  const htmlItems = collection.map((item) => cardTemplate(item));
  colList.innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", removeFromCollection);
  });

  let total = collection.length;

  colInfo.innerHTML = `<h2>You have ${total} cards in this collection.</h2>
  `;
}

function removeFromCollection(card) {
  const cardToRemove = card.target.dataset.id;

  let col = getLocalStorage("so-collection") || [];

  let index = col.findIndex((item) => item.id == cardToRemove);

  col.splice(index, 1);

  // Save the collection again.
  localStorage.setItem("so-collection", JSON.stringify(col));

  // Load everything again.
  renderCollection();
}

renderCollection();
