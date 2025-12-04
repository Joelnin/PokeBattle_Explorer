import {renderListWithTemplate } from "./utils.mjs";

function cardTemplate(card) {

  let favorite = ""

  if (cardExist(card.id)) {
    favorite = "♥"
  }
  
  return `
    <li class="pokemon-card">
      <h3>${card.name}</h3><span class="added">${favorite}</span></h3>
      <img src="${card.image}" alt="${card.name} TCGcard image">
      <a href="/tcg_pages/index.html?card=${card.id}">More Details</a>
    </li>
  `;
}

export default class TCGList {
  constructor(searchInput, dataSource, listElement) {
    this.searchInput = searchInput;
    this.dataSource = dataSource;
    this.listElement = listElement;

    this.allResults = [];
    this.filteredResults = [];
    this.currentPage = 1;
    this.pageSize = 15;
  }

  async init() {

    this.allResults = await this.dataSource.getCardsList();
    this.filteredResults = [...this.allResults];

    document.getElementById("searchBtn").addEventListener("click", () => {
      this.performSearch();
    });

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

    renderPage() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      const pageItems = this.filteredResults.slice(start, end);
      // console.log(`Esta es la current antes de gettear ${this.currentPage}`)
      document.getElementById("current-page").innerText = this.currentPage;
      // console.log(`Esta es la current despues de gettear ${this.currentPage}`)
  
      renderListWithTemplate(
        cardTemplate,
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

    const filteredBeforeSearch = this.filteredResults;

    this.filteredResults = this.filteredResults.filter(card => card.name.includes(query));

    if (this.filteredResults.length === 0) {
      this.listElement.innerHTML = "<p>No matching cards found.</p>";
      return;
    }

    this.renderPage();

    this.filteredResults = filteredBeforeSearch;
  }

  // Button for pagination
  renderPagination() {

    const tPage = document.getElementById("total-pages");
    // const cPage = document.getElementById("current-page");

    const nextPagebtn = document.getElementById("next-page");
    const backPagebtn = document.getElementById("back-page");

    // Total pages
    const totalPages = Math.ceil(this.filteredResults.length / this.pageSize);

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

function cardExist(cardId) {
  const collections = getLocalStorage("so-collection") || [];
  const exists = favorites.find((item) => item.id === cardId);

  if (exists) {
    return true;
  } else {
    return false;
  }
}
