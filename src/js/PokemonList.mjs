import { renderListWithTemplate } from "./utils.mjs";

function pokemonCardTemplate(pokemon) {
    return `
      <li class="pokemon-card">
        <h3>${pokemon.name}</h3>
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <a href="/pokemon_pages/index.html?pokemon=${pokemon.id}">Detail</a>
        <p>Type: ${pokemon.types.join(", ")}</p>
      </li>
    `;
  }

export default class PokemonList {
  constructor(dataSource, listElement, filterElement) {
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

    this.renderFilters();
    this.renderPage();
  }

  // ---------- TEMPLATE PARA UNA TARJETA ----------
  

  // ---------- RENDER TARJETAS ----------
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

    this.renderPagination();
  }

  // ---------- PAGINACIÓN ----------
  renderPagination() {
    const totalPages = Math.ceil(this.filteredPokemon.length / this.pageSize);
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("page-btn");
      if (i === this.currentPage) btn.classList.add("active");

      btn.addEventListener("click", () => {
        this.currentPage = i;
        this.renderPage();
      });

      paginationContainer.appendChild(btn);
    }
  }

  // ---------- GENERAR FILTROS AUTOMÁTICOS ----------
  renderFilters() {
    const types = new Set();

    this.allPokemon.forEach(p => p.types.forEach(t => types.add(t)));

    this.filterElement.innerHTML = `
      <button class="filter-btn active" data-type="all">All</button>
      ${[...types].map(t => `<button class="filter-btn" data-type="${t}">${t}</button>`).join("")}
    `;

    this.filterElement.addEventListener("click", (e) => {
      if (!e.target.matches(".filter-btn")) return;

      const type = e.target.dataset.type;

      document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");

      if (type === "all") {
        this.filteredPokemon = [...this.allPokemon];
      } else {
        this.filteredPokemon = this.allPokemon.filter(p => p.types.includes(type));
      }

      this.currentPage = 1;
      this.renderPage();
    });
  }
}
