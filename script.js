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

// Local Storage variables
let recentScoresInfo = [];
let bestHighscoreInfo = [];

// Display message after click check button
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

// Add event to -- Check Button
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

    // call updateRecentScoresInfo
    updateRecentScoresInfo(score);

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
    levelValue = 100;
  } else if (level === "hard") {
    levelValue = 500;
  } else if (level === "extreme") {
    levelValue = 10000;
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

// Recent Score open & close
const bestScore = document.querySelector(".score-best");
const recentScore = document.querySelector(".score-recent");
bestScore.addEventListener("click", function () {
  recentScore.classList.toggle("score-hide");
});

// Local Storage

// if highscore value is higher than - best score than again change this value with new highscore

// best score is always one value

function updateRecentScoresInfo(scoreValue = "20") {
  const level = document.getElementById("level").value;
  const currentTime = Date.now();
  console.log(currentTime);
  const recentScoreInfo = {
    date: currentTime,
    level,
    score: scoreValue,
  };

  recentScoresInfo = JSON.parse(localStorage.getItem("recentScores")) ?? [];

  recentScoresInfo.push(recentScoreInfo);

  // remove previous element if already 10 element in local storage
  let recentLength = recentScoresInfo.length;
  if (recentLength > 10) {
    for (let i = recentLength; i > 10; i--) {
      recentScoresInfo.shift();
    }
  }

  localStorage.setItem("recentScores", JSON.stringify(recentScoresInfo));

  displayRecentScores();
}

function displayRecentScores() {
  let allRecentScores = "";

  recentScoresInfo = JSON.parse(localStorage.getItem("recentScores")) ?? [];
  const currentTime = Date.now();
  recentScoresInfo.forEach((element) => {
    const scoreTimestamp = element.date;
    let timeValue;
    let timeType = "";

    // Time between now and scoreTimestamp
    const differenceTime = currentTime - scoreTimestamp;
    if (differenceTime < 60000) {
      timeValue = ((differenceTime % (1000 * 60)) / 1000).toFixed(0);
      timeType = "s";
    } else if (differenceTime < 3600000) {
      timeValue = Math.floor(differenceTime / (1000 * 60));
      timeType = "m";
    } else if (differenceTime < 86400000) {
      timeValue = Math.floor((differenceTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timeType = "h";
    } else {
      timeValue = Math.floor(differenceTime / (1000 * 60 * 60 * 24));
      timeType = "d";
    }
    allRecentScores += `
	    <div>
              <div><span class="heading">level</span> <span class="value">${element.level}</span></div>
              <div><span class="heading">highscore</span><span class="value">${element.score}</span></div>
              <div>
                <span class="time">${timeValue}${timeType}</span><span class="time">ago</span>
              </div>
            </div>
	`;
  });

  recentScore.innerHTML = allRecentScores;
}

displayRecentScores();
