import { renderListWithTemplate, capitalizeFirstLetter, getLocalStorage } from "./utils.mjs";

function pokemonCardTemplate(pokemon) {

  let favorite = ""

  if (pokemonExist(pokemon.id)) {
    favorite = "♥"    
  }

  return `
      <li class="pokemon-card">
        <h3>${capitalizeFirstLetter(pokemon.name)} <span class="added">${favorite}</span></h3>
        <img src="${pokemon.image}" alt="${capitalizeFirstLetter(pokemon.name)} Original Art Picture">
        <p>Type: ${capitalizeFirstLetter(pokemon.types.join(", "))}</p>
        <a href="/pokemon_pages/index.html?pokemon=${pokemon.id}">Know More</a>
      </li>
    `;
}

export default class PokemonList {
  constructor(searchInput, dataSource, listElement, filterElement) {
    this.searchInput = searchInput;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.filterElement = filterElement;

    this.allPokemon = [];
    this.filteredPokemon = [];
    this.currentPage = 1;
    this.pageSize = 15;
  }

  async init() {
    this.allPokemon = await this.dataSource.getPokemonList();
    this.filteredPokemon = [...this.allPokemon];

    document.getElementById("searchBtn").addEventListener("click", () => {
      this.performSearch();
    });

    this.renderFilters();
    this.renderPage();
  }

  renderPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageItems = this.filteredPokemon.slice(start, end);
    // console.log(`Esta es la current antes de gettear ${this.currentPage}`)
    document.getElementById("current-page").innerText = this.currentPage;
    // console.log(`Esta es la current despues de gettear ${this.currentPage}`)

    renderListWithTemplate(
      pokemonCardTemplate,
      this.listElement,
      pageItems,
      "afterbegin",
      true
    );

    this.renderPagination()
  }


  performSearch() {
    const query = this.searchInput.value.trim().toLowerCase();

    this.currentPage = 1;

    const filteredBeforeSearch = this.filteredPokemon;

    this.filteredPokemon = this.filteredPokemon.filter(pokemon => pokemon.name.includes(query));

    if (this.filteredPokemon.length === 0) {
      this.listElement.innerHTML = "<p>No matching pokemon found.</p>";
      return;
    }

    this.renderPage();

    this.filteredPokemon = filteredBeforeSearch;
  }

  renderFilters() {

    this.filterElement.addEventListener("click", (element) => {
      if (!element.target.matches(".filter-btn")) return;

      const type = element.target.dataset.type;

      document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));
      element.target.classList.add("active");

      if (type === "all") {
        this.filteredPokemon = [...this.allPokemon];
      } else {
        this.filteredPokemon = this.allPokemon.filter(pokemon => pokemon.types.includes(type));
      }

      this.currentPage = 1;
      this.searchInput.value = "";
      this.renderPage();
    });
  }

  // Button for pagination
  renderPagination() {

    const tPage = document.getElementById("total-pages");
    // const cPage = document.getElementById("current-page");

    const nextPagebtn = document.getElementById("next-page");
    const backPagebtn = document.getElementById("back-page");

    // Total pages
    const totalPages = Math.ceil(this.filteredPokemon.length / this.pageSize);

    tPage.innerText = totalPages;

    if (totalPages <= 1) return; // Just a page doesn't need pagination

    // Prev button
    if (this.currentPage > 1) {

      if (!backPagebtn.classList.contains("active")) {
        const bbtn = document.createElement("button");
        bbtn.innerText = "◀"
        backPagebtn.appendChild(bbtn);
        bbtn.addEventListener("click", () => {
          this.currentPage = this.currentPage - 1;
          this.renderPage();

        });
      }
      backPagebtn.setAttribute("class", "active")
    } else {
      backPagebtn.classList.remove("active");
      backPagebtn.innerHTML = "";
    }

    // Next button
    if (this.currentPage < totalPages) {
      if (!nextPagebtn.classList.contains("active")) {
        const nbtn = document.createElement("button");
        nbtn.innerText = "▶"
        nextPagebtn.appendChild(nbtn);
        
        nbtn.addEventListener("click", () => {
          this.currentPage = this.currentPage + 1;
          this.renderPage();

        });
      }
      nextPagebtn.setAttribute("class", "active")
    } else {
      nextPagebtn.classList.remove("active")
      nextPagebtn.innerHTML = "";
    }
  }
}

function pokemonExist(pokemonId) {
  const favorites = getLocalStorage("so-favorites") || [];
  const exists = favorites.find((item) => item.id === pokemonId);

  if (exists) {
    return true;
  } else {
    return false;
  }
}
