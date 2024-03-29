("use strict");
// Game variables
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
const levelOption = document.querySelector("#level");

// Flower effect state
let flowers = []; // Array to store created flowers
let flag = false; // check flowers state

// Local Storage data
let recentScoresInfo = [];
let bestHighscoreInfo = [];
let tooltipFlag = true;
let updateScoreFlag = true;

// Helper function to display messages
const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

// Event listener for Enter key (same as clicking the check button)
inputValue.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkButton.click();
  }
});

// Focus on the input element when the page loads
document.addEventListener("DOMContentLoaded", function () {
  inputValue.focus();
});

// Event listeners for button clicks
checkButton.addEventListener("click", checkNumber);
againButton.addEventListener("click", restartGame);

// Function to check the user's guess
function checkNumber() {
  const guess = Number(inputValue.value);
  inputValue.focus();

  if (!guess) {
    displayMessage("No number 🙅‍♀️");
  } else if (guess === secretNumber) {
    handleWin();
  } else {
    handleWrongGuess(guess);
  }
}

// Function to handle a winning guess
function handleWin() {
  displayMessage("You Win");
  document.querySelector(".number").textContent = secretNumber;
  inputValue.blur();
  document.querySelector("body").style.backgroundColor = "#198754";
  document.querySelector(".number").style.backgroundColor = "#8fbc8f";
  startFlower();

  updateScores();
}

// Function to handle a wrong guess
function handleWrongGuess(guess) {
  if (score > 1) {
    displayMessage(guess > secretNumber ? "📈 Too high!" : "📉 Too low!");
    score--;
    document.querySelector(".score").textContent = score;
  } else {
    displayMessage("Game over 😔");
    document.querySelector(".score").textContent = 0;
  }
}

// Function to restart the game
function restartGame() {
  score = 20;
  secretNumber = randomNum();
  inputValue.focus();
  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  inputValue.value = "";

  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.backgroundColor = "#ddd";
  stopFlower();
  updateScoresFlag();
}

// Function to update scores (highscore and recent scores)
function updateScores() {
  if (score > highscore) {
    highscore = score;
    document.querySelector(".highscore").textContent = highscore;
  }
  updateRecentScoresInfo(score);
  updateBestHighscoreInfo(score);
  updateScoresFlag();
}

// Function to update a flag for score updates
function updateScoresFlag() {
  updateScoreFlag = !updateScoreFlag;
}

// Event listener for level change
levelOption.addEventListener("change", function (event) {
  const level = event.target.value;
  updateLevel(level);
  restartGame();
});

// Function to generate random numbers based on the chosen level:
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
  // Prevent duplicate flower creation
  if (flag) {
    return;
  }
  flag = true;

  // Number of flowers to create
  let bubbleNum = 70;
  if (window.innerWidth < 700) {
    bubbleNum = 40;
  }

  for (let i = 0; i < bubbleNum; i++) {
    const flower = document.createElement("div");

    // Choose a random flower shape
    let classRandom = Math.trunc(Math.random() * 3) + 1;
    if (classRandom == 1) {
      flower.classList.add("square");
    } else if (classRandom == 2) {
      flower.classList.add("circle");
    } else {
      flower.classList.add("triangle");
    }

    // Set random position and animation for each flower
    flower.style.left = `${Math.random() * 100}%`;
    flower.style.animation = `fall ${Math.random() * 5 + 3}s linear ${Math.random() * 2}s infinite`;
    flowerContainer.appendChild(flower);

    flowers.push(flower); // Keep track of created flowers
  }
}

// Stop the flower effect
function stopFlower() {
  for (const flower of flowers) {
    // Remove all created flowers
    flowerContainer.removeChild(flower);
  }
  // Clear the flowers array
  flowers = [];
  flag = false;
}

// toggle recent scores and tooltip text
bestScore.addEventListener("click", function () {
  recentScore.classList.toggle("score-hide");

  // tooltip text change
  document.querySelector(".tooltip").textContent = tooltipFlag ? "hide recent" : "show recent";

  tooltipFlag = !tooltipFlag;

  displayRecentScores();
});

// Local Storage
// update and display recent scores in local storage
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

  // Limit the number of stored scores to 10, remove the oldest if exceed
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
       <span class="material-symbols-outlined">
           keyboard_arrow_up
       </span>
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
