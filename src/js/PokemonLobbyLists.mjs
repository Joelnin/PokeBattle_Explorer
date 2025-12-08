import { setSessionStorage, getSessionStorage, capitalizeFirstLetter, renderListWithTemplate} from "./utils.mjs";

function lobbyCardTemplate(pokemon) {
  return `
    <li class="pokemon-card" data-id="${pokemon.id}">
      <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <p>Type: ${capitalizeFirstLetter(pokemon.types[0])}</p>
    </li>
  `;
}


export default class PokemonLobbyLists {
  constructor(dataSource, listElement, filterElement, chosenContainer) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.filterElement = filterElement;
    this.chosenContainer = chosenContainer;


    this.allPokemon = [];
    this.filteredPokemon = [];
    this.currentPage = 1;
    this.pageSize = 3;
  }

  async init() {
      
    const allowedTypes = ["water", "grass", "fire", "electric", "rock"];

    this.allPokemon = this.dataSource.filter(pokemon =>
      allowedTypes.includes(pokemon.types[0]));
    this.filteredPokemon = [...this.allPokemon];

    this.addListEvents();
    this.renderFilters();
    this.renderPage();
    this.renderBattleButton();
  }

  addListEvents() {
    // Each li element will be an add button
    this.listElement.addEventListener("click", (e) => {
      const card = e.target.closest(".pokemon-card");
      if (!card) return;

      const id = parseInt(card.dataset.id);
      this.toggleSelection(id, card);
    });

    // TODO: See if this is necesary after de CSS designing.
    this.chosenContainer.addEventListener("click", (e) => {
      if (!e.target.matches(".remove-btn")) return;

      const id = parseInt(e.target.dataset.id);
      this.removeFromTeam(id);
    });
  }

  toggleSelection(id, cardElement) {
    let team = getSessionStorage("battle-team") || [];

    const alreadySelected = team.find((p) => p.id === id);

    if (alreadySelected) {
      team = team.filter(p => p.id !== id);
      cardElement.classList.remove("selected");
    } else {
      if (team.length >= 3) {
        alert("You can only choose up to 3 Pokemon!");
        return;
      }

      const pokemon = this.allPokemon.find(p => p.id === id);

      team.push(pokemon);
      cardElement.classList.add("selected"); // For later CSS
    }

    setSessionStorage("battle-team", team);
    this.renderChosenList();
  }


  removeFromTeam(id) {
    let team = getSessionStorage("battle-team") || [];
    team = team.filter(p => p.id !== id);
    setSessionStorage("battle-team", team);

    const card = this.listElement.querySelector(`.pokemon-card[data-id="${id}"]`);
    if (card) card.classList.remove("selected");

    this.renderChosenList();
  }

  renderPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageItems = this.filteredPokemon.slice(start, end);
    document.getElementById("current-page").innerText = this.currentPage;

    renderListWithTemplate(
      lobbyCardTemplate,
      this.listElement,
      pageItems,
      "afterbegin",
      true
    );

        
    this.highlightSelectedCards();
    this.renderChosenList();
    this.renderPagination();
  }

    
  highlightSelectedCards() {
    const team = getSessionStorage("battle-team") || [];

    this.listElement.querySelectorAll(".pokemon-card").forEach(li => {
      const id = parseInt(li.dataset.id);
      if (team.some(p => p.id === id)) {
        li.classList.add("selected");
      }
    });
  }


  renderChosenList() {
    const team = getSessionStorage("battle-team") || [];

    if (team.length === 0) {
      this.chosenContainer.innerHTML = `<p>No Pokemon selected.</p>`;
      return;
    }

    this.chosenContainer.innerHTML = team
      .map(
        p => `
        <div class="chosen-card">
          <button class="remove-btn" data-id="${p.id}">✖</button>
          <img src="${p.image}">
          <h4>${capitalizeFirstLetter(p.name)}</h4>
        </div>
      `
      )
      .join("");
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
        this.filteredPokemon = this.allPokemon.filter(pokemon => pokemon.types[0].includes(type));
      }

      this.currentPage = 1;
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

  renderBattleButton() {
    document.getElementById("battle-btn").addEventListener("click", () => {
      const chosenPokemon = getSessionStorage("battle-team") || [];
      const chosenTrainer = getSessionStorage("so-trainer") || [];

      const hasPokemon = chosenPokemon.length > 0;
      const hasTrainer = chosenTrainer.length > 0;

      if (!hasPokemon || !hasTrainer) {
        alert("Choose a trainer and at least one Pokemon first!");
        return;
      }

      window.location.href = "/battle_pages/index.html";
    });
  }
}