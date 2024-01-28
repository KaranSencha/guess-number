"use strict";

let levelInfo = "";
let secretNumber = randomNum();
let score = 20;
let highscore = 0;

// DOM elements
const checkButton = document.querySelector(".check");
const inputValue = document.querySelector(".guess");
const againButton = document.querySelector(".again");
const flowerContainer = document.getElementById("flower-container");
const bestScore = document.querySelector(".score-best");
const recentScore = document.querySelector(".score-recent");

// Flower effect state
let flowers = []; // Array to store created flowers
let flag = false; // check flowers state

// Local Storage data
let recentScoresInfo = [];
let bestHighscoreInfo = [];
let tooltipFlag = true;
let updateScoreFlag = true;

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
    if (updateScoreFlag) {
      updateRecentScoresInfo(score);
      updateBestHighscoreInfo(score);
      updateScoreFlag = !updateScoreFlag;
    }

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
  updateScoreFlag = true;
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

document.getElementById("level").addEventListener("change", function () {
  const level = document.getElementById("level").value;
  updateLevel(level);
  again();
});

// random for different levels
function randomNum() {
  let levelValue = "";
  changeLevelValue();
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

// Start the flower effect when player wins
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

// Stop the flower effect
function stopFlower() {
  for (const flower of flowers) {
    flowerContainer.removeChild(flower);
  }
  // Clear the flowers array
  flowers = [];
  flag = false;
}

// Recent Score open & close
bestScore.addEventListener("click", function () {
  recentScore.classList.toggle("score-hide");

  // tooltip text change
  document.querySelector(".tooltip").textContent = tooltipFlag ? "hide recent" : "show recent";

  tooltipFlag = !tooltipFlag;

  displayRecentScores();
});

// Local Storage
// Update recent scores information in local storage
function updateRecentScoresInfo(scoreValue = "20") {
  const level = document.getElementById("level").value;
  const currentTime = Date.now();

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

// Display recent scores in the UI
function displayRecentScores() {
  let allRecentScores = "";

  recentScoresInfo = JSON.parse(localStorage.getItem("recentScores")) ?? [];
  const currentTime = Date.now();
  recentScoresInfo.forEach((element) => {
    const scoreTimestamp = element.date;
    let timeValue;

    // Time between now and scoreTimestamp
    // and convert millisecond to seconds
    const differenceTime = (currentTime - scoreTimestamp) / 1000;

    if (differenceTime < 60) {
      timeValue = (differenceTime % 60).toFixed(0) + "s";
    } else if (differenceTime < 3600) {
      timeValue = Math.floor(differenceTime / 60) + "m";
    } else if (differenceTime < 86400) {
      timeValue = Math.floor(differenceTime / 3600) + "h";
    } else {
      timeValue = Math.floor(differenceTime / 86400) + "d";
    }
    allRecentScores += `
	    <div>
              <div><span class="heading">level</span> <span class="value">${element.level}</span></div>
              <div><span class="heading">score</span><span class="value">${element.score}</span></div>
              <div>
                <span class="time">${timeValue}</span><span class="time">ago</span>
              </div>
       </div>
	`;
  });

  recentScore.innerHTML = allRecentScores;
}

displayRecentScores();

function updateBestHighscoreInfo(scoreValue = "10") {
  const level = document.getElementById("level").value;
  const currentTime = Date.now();

  bestHighscoreInfo = JSON.parse(localStorage.getItem("bestHighscore")) ?? [];

  // return if score is less
  if (score < (bestHighscoreInfo[0]?.score || 1)) return;

  const bestScoreInfo = {
    date: currentTime,
    level,
    score: scoreValue,
  };

  bestHighscoreInfo[0] = bestScoreInfo;

  localStorage.setItem("bestHighscore", JSON.stringify(bestHighscoreInfo));

  displayBestScore();
}

// Display best score in the UI
function displayBestScore() {
  bestHighscoreInfo = JSON.parse(localStorage.getItem("bestHighscore")) ?? [];

  if (bestHighscoreInfo.length === 0) return;

  const score = bestHighscoreInfo[0].score;
  const level = bestHighscoreInfo[0].level;

  bestScore.innerHTML = `
   <div><span class="heading">level</span> <span class="value">${level}</span></div>
            <div><span class="heading">score</span><span class="value">${score}</span></div>
            <div>
              <div class="tooltip-btn">
                (O)
                <div class="tooltip">show recent</div>
              </div>
            </div>
  `;
}

displayBestScore();

// Update user game level in local storage
function updateLevel(level) {
  levelInfo = level;
  localStorage.setItem("level", levelInfo);
}

function changeLevelValue() {
  const levelSelect = document.getElementById("level");

  let newValue = localStorage.getItem("level");

  for (let i = 0; i < levelSelect.options.length; i++) {
    if (levelSelect.options[i].value === newValue) {
      levelSelect.selectedIndex = i;
      break;
    }
  }
}

// Copyright Year update automatically
function updateCopyrightYear() {
  const yearElement = document.getElementById("copyrightYear");

  const newYear = new Date().getFullYear();
  yearElement.textContent = newYear;
}

updateCopyrightYear();
