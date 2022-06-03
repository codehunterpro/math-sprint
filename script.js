// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let countdownTime = 4;
let bestScoreArray = [];
let timeUp;

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimmeDisplay = '0.0';

// Scroll
let ScrollY = 0;

// ALL helper Function
// -------------------------------------------------
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//------------------------------------------
function updateBestScores() {
  bestScoreArray.forEach((score, index) => {
    if (questionAmount == score.questions) {
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimmeDisplay;
      }
    }
  });

  bestScoreToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function bestScoreToDOM() {
  bestScores.forEach((el, i) => {
    const bestScoreEl = el;
    bestScoreEl.textContent = `${bestScoreArray[i].bestScore}s`;
  });
}

// -------------------------------------------------------------------

function getSavedBestScore() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimmeDisplay },
      { questions: 25, bestScore: finalTimmeDisplay },
      { questions: 50, bestScore: finalTimmeDisplay },
      { questions: 99, bestScore: finalTimmeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}
// -----------------------------------------------------
function switchSplashPaage() {
  scorePage.hidden = true;
  splashPage.hidden = false;
}
//---------------------------------------------------------
function playAgain() {
  timePlayed = 0;
  baseTime = 0;
  penaltyTime = 0;
  finalTime = 0;
  questionAmount = 0;
  scrollY = 0;
  countdownTime = 4;
  playerGuessArray = [];
  equationsArray = [];
  gamePage.addEventListener('click', startTimer);
  switchSplashPaage();
}
//---------------------------------------------------------
function switchScorPage() {
  gamePage.hidden = true;
  scorePage.hidden = false;
}
// -------------------------------------------------------
function scoreDOMupdate() {
  finalTimmeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimmeDisplay}s`;
  updateBestScores();
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  switchScorPage();
}

// -------------------------------------------------------------------
function checkTimeUp() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    equationsArray.forEach((equations, index) => {
      if (equations.evaluated == playerGuessArray[index]) {
        // no penalty time evaluated
      } else {
        penaltyTime += 0.5;
      }
      finalTime = timePlayed + penaltyTime;
    });

    scoreDOMupdate();
  }
}

// ---------------------------------------

function countTime() {
  timePlayed += 0.1;
  checkTimeUp();
}

// --------------------------------------------

function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(countTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// ----------------------------------------------------------

function select(playerGuess) {
  scrollY += 80;
  itemContainer.scroll(0, scrollY);
  playerGuess ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// -------------------------------------------------
function switchGamePage() {
  countdownPage.hidden = true;
  gamePage.hidden = false;
}

//-------------------------------------------------

function equationToDOM() {
  equationsArray.forEach(equation => {
    const item = document.createElement('div');
    item.classList.add('item');

    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
  switchGamePage();
}

// -------------------------------------------------
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;

  console.log('correct Equation', correctEquations);
  console.log('wrong Equation', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(8);
    secondNumber = getRandomInt(8);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(8);
    secondNumber = getRandomInt(8);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

//------------------------------------------------------
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// -------------------------------------------------
function updateCountdownDOM() {
  countdown.textContent = `${countdownTime}`;
  countdownTime--;

  if (countdownTime < 0) {
    countdown.textContent = 'GO!';
    clearInterval(timeUp);
    setTimeout(populateGamePage, 1000);
  }
}

// -------------------------------------------------
function showCountdown() {
  if (questionAmount) {
    splashPage.hidden = true;
    countdownPage.hidden = false;
    countdown.textContent = `Ready!`;
    timeUp = setInterval(updateCountdownDOM, 1000);
  } else {
    alert('Please Select a Question Field');
  }
}

// -------------------------------------------------
function getRadioValue() {
  let radioValue;
  radioInputs.forEach(input => {
    if (input.checked) {
      radioValue = input.value;
    }
  });

  return radioValue;
}

// -------------------------------------------------

function selectQuestionAmount(e) {
  e.preventDefault();

  questionAmount = getRadioValue();
  //  show countdown page
  showCountdown();
}

// -------------------------------------------------

startForm.addEventListener('click', () => {
  radioContainers.forEach(radioEl => {
    radioEl.classList.remove('selected-label');
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScore();
