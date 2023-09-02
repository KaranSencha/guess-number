"use strict";

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};
const checkButton = document.querySelector(".check");

// add event listener to enter key
const inputValue = document.querySelector(".guess");
inputValue.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkButton.click();
  }
});

checkButton.addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  // When there is no input
  if (!guess) {
    displayMessage("⛔️ No number!");

    // When player wins
  } else if (guess === secretNumber) {
    displayMessage("🎉 Correct Number!");
    document.querySelector(".number").textContent = secretNumber;

    document.querySelector("body").style.backgroundColor = "#198754";
    startFlower();

    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }

    // When guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "📈 Too high!" : "📉 Too low!");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      displayMessage("💥 You lost the game!");
      document.querySelector(".score").textContent = 0;
    }
  }

  // Again Button - Restart Game logic
  const againButton = document.querySelector(".again");
  againButton.addEventListener("click", function () {
    score = 20;
    secretNumber = Math.trunc(Math.random() * 20) + 1;

    displayMessage("Start guessing...");
    document.querySelector(".score").textContent = score;
    document.querySelector(".number").textContent = "?";
    document.querySelector(".guess").value = "";

    document.querySelector("body").style.backgroundColor = "#222";
    stopFlower();
  });
});

// Flower Effect - when player win
const flowerContainer = document.getElementById("flower-container");
let flowers = []; // Array to store created flowers
let flag = false;

function startFlower() {
  if (flag) {
    return;
  }
  flag = true;
  for (let i = 0; i < 80; i++) {
    const flower = document.createElement("div");

    let classRandom = Math.trunc(Math.random() * 3) + 1;
    if (classRandom == 1) {
      flower.classList.add("square");
    } else if (classRandom == 2) {
      flower.classList.add("circle");
    } else {
      flower.classList.add("triangle");
    }
    flower.style.left = `${Math.random() * 100}%`;

    flower.style.animation = `fall ${Math.random() * 2 + 2}s linear ${Math.random() * 2}s infinite`;
    flowerContainer.appendChild(flower);

    flowers.push(flower);
  }
}

// Stop Flower
function stopFlower() {
  for (const flower of flowers) {
    flowerContainer.removeChild(flower);
  }
  // Clear the flowers array
  flowers = [];
  flag = false;
}
