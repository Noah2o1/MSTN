const board = document.querySelector('.game-board');
const resetButton = document.querySelector('.reset-button');
const congratulationsMessage = document.querySelector('.congratulations-message');
const timerDisplay = document.getElementById('timer');

const cards = [
  'peach', 'cherry', 'pear', 'apple', 'grape', 'banana', 'mango', 'lemon',
  'peach', 'cherry', 'pear', 'apple', 'grape', 'banana', 'mango', 'lemon'
];

let flippedCards = [];
let matchedCards = 0;
let isFlipping = false;
let timerInterval = null;
let gameStarted = false; // New variable to track game start

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  board.innerHTML = '';
  shuffle(cards);

  cards.forEach((cardValue) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const frontImage = document.createElement('img');
    frontImage.src = 'pictures/back.png'; // Back image (now .png)
    cardFront.appendChild(frontImage);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const backImage = document.createElement('img');
    backImage.src = `pictures/${cardValue}.png`; // Fruit image (now .png)
    cardBack.appendChild(backImage);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    cardElement.appendChild(cardInner);
    cardElement.dataset.value = cardValue;
    board.appendChild(cardElement);

    // Enable flipping behavior
    cardElement.addEventListener('click', handleCardClick);
  });

  board.classList.add('zoom-in');
  setTimeout(() => {
    initialCardFlipSequence();
  }, 2000); // Adjust delay (2 seconds here)
}

function handleCardClick(event) {
  const card = event.currentTarget;

  if (!gameStarted) {
    gameStarted = true; // Start the game on the first click
    startTimer();
  }

  if (
    isFlipping || // Prevent flipping during animations
    card.classList.contains('matched') || // Ignore already matched cards
    card.classList.contains('flip') // Ignore cards already flipped
  ) {
    return;
  }

  card.classList.add('flip');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    isFlipping = true;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.value === card2.dataset.value;

  setTimeout(() => {
    if (isMatch) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedCards += 2;

      if (matchedCards === cards.length) {
        clearInterval(timerInterval);
        showCongratulations();
      }
    } else {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
    }

    flippedCards = [];
    isFlipping = false;
  }, 1000); // Adjust match delay here
}

function initialCardFlipSequence() {
  const cardElements = Array.from(document.querySelectorAll('.card'));

  cardElements.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('flip');

      if (index === cardElements.length - 1) {
        // After all cards flip to the number side, flip them back
        setTimeout(() => {
          cardElements.forEach((card) => card.classList.remove('flip'));
        }, 2000); // Delay before flipping back (2 seconds here)
      }
    }, index * 400); // Staggered flipping (400ms per card)
  });
}

function startTimer() {
  let timeLeft = 60;
  timerDisplay.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showGameOver();
    }
  }, 1000);
}

function showCongratulations() {
  congratulationsMessage.style.display = 'block';
}

function showGameOver() {
  board.innerHTML = '<div class="congratulations-message">You lost! Try again.</div>';
}

resetButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  flippedCards = [];
  matchedCards = 0;
  isFlipping = false;
  gameStarted = false; // Reset game start
  congratulationsMessage.style.display = 'none';
  createBoard();
});

createBoard();
