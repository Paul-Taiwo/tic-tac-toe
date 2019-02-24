var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
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
const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
  document.querySelector('.endgame').style.display = 'none';

  origBoard = Array.from(Array(9).keys());

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof (origBoard[square.target.id]) == 'number') {
    turn(square.target.id, huPlayer);
    setTimeout(()=> {
      if (!checkTie()) turn(bestSpot(), aiPlayer);
    }, 1000);
    ;
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gamewon = checkWin(origBoard, player)
  if (gamewon) gameOver(gamewon)
}

function declareWinner(who){
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof(s) == 'number' );
}

function bestSpot(){
  return emptySquares()[0];
}

function checkTie() {
  if (emptySquares().length === 0){
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner('Tie Game');
    return true;
  }
  return false;
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

  let gamewon = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)){
      gamewon = {index: index, player: player};
      break;
    };
  }
  return gamewon;

}

function gameOver(gamewon) {
  for (let index of winCombos[gamewon.index]) {
    document.getElementById(index).style.backgroundColor = gamewon.player == huPlayer ? 'blue' : 'red';
  }

  for (var i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click', turnClick, false)
  }
  declareWinner(gamewon.player == huPlayer ? 'You win' : 'You Lose');
}