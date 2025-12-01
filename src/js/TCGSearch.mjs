import { renderListWithTemplate } from "./utils.mjs";

function cardTemplate(card) {
  return `
    <li class="pokemon-card">
      <h3>${card.name}</h3>
      <img src="${card.image}" alt="${card.name} card image">
      <a href="/tcg_pages/index.html?card=${card.id}">Detail</a>
    </li>
  `;
}

export default class TCGSearch {
  constructor(searchInput, dataSource, listElement, paginationElement) {
    this.searchInput = searchInput;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.paginationElement = paginationElement;

    this.allResults = [];
    this.pageSize = 10;
    this.currentPage = 1;
  }

  init() {

    console.log("Pagina empezo")
    this.startPage();
    console.log("Pagina termino")


    document.getElementById("tcgSearchBtn")
      .addEventListener("click", () => this.performSearch());
    
  }

  async startPage() {
    this.allResults = await this.dataSource.getStartData();
    this.renderPage();
  }

  async performSearch() {
    const query = this.searchInput.value.trim().toLowerCase();
    if (!query) return;

    this.currentPage = 1;
    this.allResults = await this.dataSource.getData(query);

    if (this.allResults.length === 0) {
      this.listElement.innerHTML = "<p>No matching cards found.</p>";
      this.paginationElement.innerHTML = "";
      return;
    }

    this.renderPage();
  }

  // Just 10 for now
  renderPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    const pageItems = this.allResults.slice(start, end);

    renderListWithTemplate(
      cardTemplate,
      this.listElement,
      pageItems,
      "afterbegin",
      true
    );

    this.renderPagination();
  }

  // Button for pagination
  renderPagination() {
    const totalPages = Math.ceil(this.allResults.length / this.pageSize);
    this.paginationElement.innerHTML = "";

    if (totalPages <= 1) return;

    // Prev button
    if (this.currentPage > 1) {
      const prevBtn = this.createPageButton("Prev", this.currentPage - 1);
      this.paginationElement.appendChild(prevBtn);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = this.createPageButton(i, i);
      if (i === this.currentPage) btn.classList.add("active");
      this.paginationElement.appendChild(btn);
    }

    // Next button
    if (this.currentPage < totalPages) {
      const nextBtn = this.createPageButton("Next", this.currentPage + 1);
      this.paginationElement.appendChild(nextBtn);
    }
  }

  createPageButton(label, page) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.classList.add("page-btn");
    btn.addEventListener("click", () => {
      this.currentPage = page;
      this.renderPage();
    });

    return btn;
  }
}
