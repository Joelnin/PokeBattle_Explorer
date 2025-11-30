import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// KEY name for favorites in localStorage
const FAVORITES_KEY = "so-favorites";

function renderFavorites() {
  const favorites = getLocalStorage(FAVORITES_KEY) || [];
  const favList = document.querySelector(".favorites-list");
  const favFooter = document.querySelector(".favorites-footer");

  if (favorites.length === 0) {
    favList.innerHTML = `<div class="divider"><h2>No Favorites Yet</h2></div>`;
    favFooter.classList.add("hide");
    return;
  }

  const htmlItems = favorites.map((item) => favoriteItemTemplate(item));
  favList.innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-favorite").forEach((btn) => {
    btn.addEventListener("click", removeFavorite);
  });

  favFooter.classList.remove("hide");
}

function favoriteItemTemplate(item) {
  return `<li class="fav-card divider">
    <a href="#" class="fav-card__image">
      <img src="${item.Images.PrimaryLarge}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="fav-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
    <p class="fav-card__price">$${item.FinalPrice}</p>

    <button class="remove-favorite" data-id="${item.Id}">Remove</button>
  </li>`;
}

export function addToFavorites(product) {
  let favs = getLocalStorage(FAVORITES_KEY) || [];

  const exists = favs.find((p) => p.Id === product.Id);
  if (!exists) {
    favs.push(product);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}

function removeFavorite(e) {
  const id = e.target.dataset.id;
  let favs = getLocalStorage(FAVORITES_KEY) || [];

  favs = favs.filter((item) => item.Id != id);

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));

  renderFavorites();
}

renderFavorites();
