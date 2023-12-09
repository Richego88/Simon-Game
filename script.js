"strict";
const buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let level = 0;
let playerPattern = [];
let record = 0;
const DQS = function (element) {
  return document.querySelector(element);
};

function changeLevel() {
  level++;
  DQS(".level").innerText = `Level: ${level}`;
}

const pressKey = function () {
  document.addEventListener("keydown", function (event) {
    if (level === 0) {
      playSound("StartGame");
      setTimeout(() => {
        startGame();
        changeLevel();
      }, 3000);
    }
  });
};
pressKey();

function startGame() {
  level = 0;
  gamePattern = [];
  playerPattern = [];
  showSequence();
}

function nextSequence() {
  const randomNumber = Math.floor(Math.random() * 4);
  gamePattern.push(buttonColors[randomNumber]);
  console.log(gamePattern);
}

function showSequence() {
  playerPattern = [];
  nextSequence();
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(() => {
      highlightButton(gamePattern[i]);
      playSound(gamePattern[i]);
    }, (i + 1) * 800);
  }

  // After showing the sequence, allow the player to start clicking
  setTimeout(() => {
    enableButtonClicks();
  }, gamePattern.length * 800);
}

const enableButtonClicks = () => {
  // Enable the button clicks for the player
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
};

const highlightButton = (color) => {
  let button = DQS(`.${color}`);

  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 100);
};

const checkSequence = () => {
  for (let i = 0; i < playerPattern.length; i++) {
    if (playerPattern[i] !== gamePattern[i]) {
      playSound("loser");
      return false;
    }
  }
  return true;
};

function handleButtonClick(event) {
  const color = event.target.classList[1];
  highlightButton(color);
  playerPattern.push(color);
  console.log(playerPattern);
  playSound(color);

  if (!checkSequence()) {
    // Player made a mistake
    if (level > record) {
      record = level;
      console.log("New Record:", record);
      DQS(".record").innerText = `Record: ${record}`;
    }
    document.body.style.backgroundColor = "red";
    DQS("#level-title").innerText = "GAME OVER";
    setTimeout(() => {
      document.body.style.backgroundColor = "#011f3f";

      level = 0;
      restartGame();
    }, 6000);
  } else if (playerPattern.length === gamePattern.length) {
    // Player finished the sequence
    disableButtonClicks(); // Disable clicks while showing the next sequence
    setTimeout(() => {
      changeLevel();
      showSequence();
    }, 1000);
  }
}

const playSound = (name) => {
  let audio = new Audio(`${name}.mp3`);
  audio.play();
};

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

const disableButtonClicks = () => {
  // Disable the button clicks for the player
  document.querySelectorAll(".btn").forEach((button) => {
    button.removeEventListener("click", handleButtonClick);
  });
};

const restartGame = function () {
  DQS("#level-title").innerText = "Press A Key to Start";
  gamePattern = [];
  playerPattern = [];
  level = 0;
  disableButtonClicks();
  DQS(".level").innerText = `Level: ${level}`;
  pressKey();
};
