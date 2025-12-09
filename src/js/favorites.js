import {
  capitalizeFirstLetter,
  getLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function cardTemplate(pokemon) {
  return `
    <li class="pokemon-card ${pokemon.types[0]} go-round">
      <div class="card-side front">
        <img src="${pokemon.image}" alt="${capitalizeFirstLetter(pokemon.name)} original art picture">
        <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
<p><strong>Type: </strong>${capitalizeFirstLetter(pokemon.types[0])}</p>
        
      </div>
      <div class="card-side back ${pokemon.types[0]}">
        <a class="favorite" href="/pokemon_pages/index.html?pokemon=${pokemon.id}"><img src="${pokemon.image}" alt="${capitalizeFirstLetter(pokemon.name)} original art picture"></a>
        <div class="pokemon-stats-container">
          <h2>Stats</h2>
        <div class="pokemon-stats">
        ${pokemon.stats
          .map(
            (stat) => `
        <p><strong>${capitalizeFirstLetter(stat.name.replace(/-/g, " "))}: </strong>${stat.value}</p>
      `,
          )
          .join("")}
        </div>
        </div>
        <button title="Remove from Favorites" class="remove-item" data-id="${pokemon.id}">🗑️</button>
      </div>
      
    </li>
  `;
}

function renderFavorites() {
  const favorites = getLocalStorage("so-favorites");
  const favList = document.querySelector(".favorites-list");
  const favInfo = document.querySelector(".favorites-info");

  if (favorites == 0 || !favorites) {
    favList.innerHTML = `<div class="no-fave"><h2 >No Favorites Yet</h2>
    <p>There are no Favorite Pokemon yet. Add some from <a href="/pokemon_listing/">here</a> by going to your favorite Pokemon and clicking "Favorite."</p>
    <p><strong>Remember:</strong> These will be the ones available for battle.<br>But just the allowed types: Fire, Water, and Rock. Coming soon: Electric and Grass.</p></div>`;
    favInfo.innerHTML = "";
    return;
  }

  const htmlItems = favorites.map((item) => cardTemplate(item));
  favList.innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", removeFavorite);
  });

  let total = favorites.length;

  favInfo.innerHTML = `<h2>You Like ${total} Pokemon.</h2>
  <p>These will be the ones available for battle.<br>But just the allowed types: Fire, Water, and Rock. Coming soon: Electric and Grass.</p>
  
  `;
}

function removeFavorite(pokemon) {
  const pokemonToRemove = pokemon.target.dataset.id;

  let favs = getLocalStorage("so-favorites") || [];

  let index = favs.findIndex((item) => item.id == pokemonToRemove);

  favs.splice(index, 1);

  // Save the favorites again.
  localStorage.setItem("so-favorites", JSON.stringify(favs));

  // Load everything again.
  renderFavorites();
}

renderFavorites();
