"use strict";

let secretNumber = randomNum();
let score = 20;
let highscore = 0;
const checkButton = document.querySelector(".check");
const inputValue = document.querySelector(".guess");
const againButton = document.querySelector(".again");
const flowerContainer = document.getElementById("flower-container");
let flowers = []; // Array to store created flowers
let flag = false; // check flowers state

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

// add event listener to enter key
inputValue.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkButton.click();
  }
});

//By default Focus on the input element
document.addEventListener("DOMContentLoaded", function () {
  inputValue.focus();
});

// Ad
checkButton.addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);
  inputValue.focus();
  // When there is no input
  if (!guess) {
    displayMessage("No number 🙅‍♀️");

    // When player wins
  } else if (guess === secretNumber) {
    displayMessage("You Win");
    document.querySelector(".number").textContent = secretNumber;
    inputValue.blur();
    document.querySelector("body").style.backgroundColor = "#198754";
    document.querySelector(".number").style.backgroundColor = "#8fbc8f";
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
      displayMessage("Game over 😔");
      document.querySelector(".score").textContent = 0;
    }
  }
});

// Again Function
function again() {
  score = 20;
  secretNumber = randomNum();
  inputValue.focus();
  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";

  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.backgroundColor = "#ddd";
  stopFlower();
}
// Again Button - Restart Game logic
againButton.addEventListener("click", again);

// Call Again function when - level is changed
document.getElementById("level").addEventListener("change", again);

// random for different levels
function randomNum() {
  let levelValue = 0;
  const level = document.getElementById("level").value;
  const between = document.getElementById("betweenValue");
  if (level === "easy") {
    levelValue = 20;
  } else if (level === "midium") {
    levelValue = 50;
  } else if (level === "hard") {
    levelValue = 200;
  } else if (level === "extreme") {
    levelValue = 1000;
  }
  between.textContent = levelValue;
  return Math.trunc(Math.random() * levelValue) + 1;
}

// Flower Effect - when player win
function startFlower() {
  if (flag) {
    return;
  }
  flag = true;

  let bubbleNum = 70;
  if (window.innerWidth < 700) {
    bubbleNum = 40;
  }

  for (let i = 0; i < bubbleNum; i++) {
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

    flower.style.animation = `fall ${Math.random() * 5 + 3}s linear ${Math.random() * 2}s infinite`;
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
