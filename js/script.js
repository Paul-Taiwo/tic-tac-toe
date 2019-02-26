// Note: Minimax algorithm according to Ahmad Abdolsaheb

let origBoard;

// Players
const huPlayer = 'X';
const aiPlayer = 'O';

// All possible win
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];

// All squares
const cells = document.querySelectorAll('.cell');

startGame();

// Start game function
function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  document.getElementById('turnDisplay').innerText = 'Your turn';

  // Id of all squares in the table
  origBoard = Array.from(Array(9).keys());

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

// Take turns
function turnClick(square) {
  if (typeof (origBoard[square.target.id]) == 'number') {
    turn(square.target.id, huPlayer);
      if (!checkTie()) {
        setTimeout(()=> {
          turn(bestSpot(), aiPlayer);
        }, 700);
      }
    }
  }

// Turn
function turn(squareId, player) {

  let turnDisp = document.getElementById('turnDisplay');
  if (player === huPlayer) {
    turnDisp.innerText = 'AI\'s turn';
  } else {
    turnDisp.innerText = 'Your turn';
  }

  origBoard[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

// Return empty squares
function emptySquares() {
  return origBoard.filter(s => typeof (s) == 'number');
}

// Best Spot for aiPlayer
function bestSpot() {
  // Generate a random spot for the AI to play
  // return emptySquares()[Math.floor(Math.random() * emptySquares().length)];

  // Minimax Algorithm
  return minimax(origBoard, aiPlayer).index;
}

// Check Winner
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

  let gameWon = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)){
      gameWon = {index: index, player: player};
      break;
    };
  }
  return gameWon;
}

// Declare Winner
function declareWinner(who){
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame .text').innerHTML = who;
}

// Check Tie
function checkTie() {
  if (emptySquares().length === 0){
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = '#0ba90b';
      cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner('Tie Game');
    return true;
  }
  return false;
}

// End game
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? '#29298e' : '#f50505';
  }

  for (let i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click', turnClick, false)
  }
  declareWinner(gameWon.player == huPlayer ? 'You win' : 'You Lose');
  turnClick('');
}

// Minimax algorithm Unbeatable

function minimax(newBoard, player) {
  // Check for available spots
  let availSpots = emptySquares(newBoard);

  // Check Win and assign a score
  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++){
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer){
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
