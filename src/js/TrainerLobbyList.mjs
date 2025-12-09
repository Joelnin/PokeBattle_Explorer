import {
  capitalizeFirstLetter,
  getSessionStorage,
  setSessionStorage,
  renderListWithTemplate
} from "./utils.mjs";

function lobbyCardTemplate(trainer) {
  return `
    <li class="trainer-card" data-id="${trainer.id}">
      <h3>${trainer.name} ${trainer.lastName}</h3>
      <img src="${trainer.image}" alt="${trainer.name} profile picture">
      <p>Location: ${capitalizeFirstLetter(trainer.country)}</p>
    </li>
  `;
} // TODO: See about the name display. (Review JSON so it has a name and last name.)

export default class TrainerLobbyList {
  constructor(dataSource, listElement, chosenContainer) {
    this.dataSource = dataSource;       
    this.listElement = listElement;     
    this.chosenContainer = chosenContainer; 
    this.trainers = [];
  }

  async init() {
    this.trainers = await this.dataSource.getData();

    console.log(this.trainers)

    this.renderList();
    this.addListEvents();
    this.renderChosenList();
  }

  addListEvents() {
    this.listElement.addEventListener("click", (e) => {
      const card = e.target.closest(".trainer-card");
      if (!card) return;

      const id = parseInt(card.dataset.id);
      this.toggleSelection(id);
    });

    // remove from list (TODO: see if it's necessary the button. If it's not, fdelete this secton of code)
    this.chosenContainer.addEventListener("click", (e) => {
      if (!e.target.matches(".remove-btn")) return;

      const id = parseInt(e.target.dataset.id);
      this.removeTrainer(id);
    });
  }

  toggleSelection(id) {
    let chosen = getSessionStorage("so-trainer") || [];

    const already = chosen.find(t => t.id === id);

    if (already) {
      // Delete
      chosen = [];
    } else {
      // Just one
      if (chosen.length >= 1) {
        alert("You can only choose 1 Trainer to fight with!");
        return;
      }

      const trainer = this.trainers.find(t => t.id === id);
      chosen = [trainer];
    }

    setSessionStorage("so-trainer", chosen);
    this.renderChosenList();
    this.highlightSelectedCard();
  }

  removeTrainer(id) {
    let chosen = getSessionStorage("so-trainer") || [];

    chosen = chosen.filter(t => t.id !== id);
    setSessionStorage("so-trainer", chosen);

    this.renderChosenList();
    this.highlightSelectedCard();
  }

  renderList() {
    renderListWithTemplate(
      lobbyCardTemplate,
      this.listElement,
      this.trainers,
      "afterbegin",
      true
    );

    this.highlightSelectedCard();
  }

  renderChosenList() {
    const chosen = getSessionStorage("so-trainer") || [];

    if (chosen.length === 0) {
      this.chosenContainer.innerHTML = `<p>No Opponent selected.</p>`;
      return;
    }

    const t = chosen[0];

    this.chosenContainer.innerHTML = `
      <div class="chosen-card">
      <button class="remove-btn" data-id="${t.id}">✖</button>
        <img src="${t.image}" alt="${t.lastName} profile">
        <h4>${t.lastName}</h4>
        
      </div>
    `;
  } // See if the name looks good after CSS

  highlightSelectedCard() {
    const chosen = getSessionStorage("so-trainer") || [];
    const chosenId = chosen.length ? chosen[0].id : null;

    this.listElement.querySelectorAll(".trainer-card").forEach(card => {
      const id = parseInt(card.dataset.id);
      card.classList.toggle("selected", id === chosenId);
    });
  }
}
