import {
  renderListWithTemplate
} from "./utils.mjs";

function cardTemplate(pokemon) {
  return `
    <li class="user-card ${pokemon.types[0]}" data-id="${pokemon.id}">
      <img src="${pokemon.image}" alt="${pokemon.name} image">
    </li>
  `;
}

function getBattleResult(userType, opponentType) {

  console.log(`Este es el tipo del user "${userType}" y este es el del oponente "${opponentType}"`);

  if (userType == "water") {
    if (opponentType == "fire") {
      return "win";
    }
    if (opponentType == "rock") {
      return "lose";
    }
  }
  if (userType == "rock") {
    if (opponentType == "water") {
      return "win";
    }
    if (opponentType == "fire") {
      return "lose";
    }
  }
  if (userType == "fire") {
    if (opponentType == "rock") {
      return "win";
    }
    if (opponentType == "water") {
      return "lose";
    }
  }

  return "draw"
}

function get3RandomPokemon(data) {
  const numbers = [];
  const pokemon = [];
  while (numbers.length < 3) {
    // Generate a random number between 0 and 5
    const randomNum = Math.floor(Math.random() * 3);
    
    // Chec k if it's in the array
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
      pokemon.push(data[randomNum])// If not, put it on the list
    }
  }
  // console.log(numbers)
  return pokemon;
}

export default class BattleDetails {
  constructor(dataSourceTrainer, listElementTrainer, dataSourcePokemon, listElementPokemon) {
    this.dataSourceTrainer = dataSourceTrainer;
    this.listElementTrainer = listElementTrainer;
    this.dataSourcePokemon = dataSourcePokemon;
    this.listElementPokemon = listElementPokemon;
    
    this.trainerTeam = [];
    this.userTeam = [];
    this.userPokemon = null;
    this.opponentPokemon = null;
  }

  init() {
    document.getElementById("trainerName").innerText = `${this.dataSourceTrainer[0].name}'s Team`;

    this.userTeam = this.dataSourcePokemon || [];

    const trainerFullteam = this.dataSourceTrainer[0].team;

    this.trainerTeam = get3RandomPokemon(trainerFullteam);
    // console.log(this.trainerTeam)

    document.getElementById("fightBtn").addEventListener("click", () => {
      if (!this.userPokemon) {
        alert("Choose a Pokemon first!");
        return;
      }
      this.chooseOpponentPokemon(this.trainerTeam);
      this.startGame(this.userPokemon, this.opponentPokemon);
    });

    this.listElementPokemon.addEventListener("click", (e) => {
      const card = e.target.closest(".user-card");
      if (!card) return;
      
      const id = parseInt(card.dataset.id);
      this.choosePokemon(id);
    });
    

    this.renderPage();
  }

  renderPage() {

    renderListWithTemplate(
      cardTemplate,
      this.listElementPokemon,
      this.userTeam,
      "afterbegin",
      true
    );

    renderListWithTemplate(
      cardTemplate,
      this.listElementTrainer,
      this.trainerTeam,
      "afterbegin",
      true
    );
  }

  choosePokemon(id) {
    const pokemon = this.userTeam.find(p => p.id === id);
    this.userPokemon = pokemon;

    document.querySelector(".pokemon-user").innerHTML = `
        <img data-type=${pokemon.types[0]} src="${pokemon.image}" alt="${pokemon.name} image">
      `;
  }

  chooseOpponentPokemon(team) {
    const index = Math.floor(Math.random() * 2);
    this.opponentPokemon = team[index];

        document.querySelector(".pokemon-comp").innerHTML = `
        <img data-type=${this.opponentPokemon.types[0]} src="${this.opponentPokemon.image}" alt="${this.opponentPokemon.name} image">
      `;
  }

  startGame(user, opponent) {

    const resultMessage = document.querySelector(".battle-result")
    let result = getBattleResult(user.types[0], opponent.types[0]);
    console.log(result)   

    let message;

    if (result == "win") {
      message = "Congratulations! You won!"

    } else if (result == "lose") {
      message = "Sorry, better luck next time. You lose."
    } else {
      message = "Well... it's a draw. Your pokemon is cute though."
    }
    
    resultMessage.innerHTML = `
          <h3>${message}</h3>
      <p>Want to play again?</p>
      <a href="/battle_lobby/">Go to lobby</a>
    `
  }

}
