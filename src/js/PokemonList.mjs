import { renderListWithTemplate, capitalizeFirstLetter } from "./utils.mjs";

function pokemonCardTemplate(pokemon) {
    return `
      <li class="pokemon-card">
        <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
        <img src="${pokemon.image}" alt="${capitalizeFirstLetter(pokemon.name)} imahe">
        <a href="/pokemon_pages/index.html?pokemon=${pokemon.id}">Know More</a>
        <p>Type: ${capitalizeFirstLetter(pokemon.types.join(", "))}</p>
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
    this.pageSize = 10;
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

    renderListWithTemplate(
      pokemonCardTemplate,
      this.listElement,
      pageItems,
      "afterbegin",
      true
    );

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
}
