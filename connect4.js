  /** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */

let WIDTH = 7;
let HEIGHT = 6;
  /* currPlayer- player one or two*/
  /* board- rows are arrays of cells and there are arrays of rows [y][x] */
let currPlayer = 1; 
let board = []; 

  /*the makeBoard function creates a for loop that basically creates a 6x7 board of null squares */
  /* () => null creates the empty cells and the array for each row is pushed to the board array */

function makeBoard() {
    for (let y = 0; y < HEIGHT; y++){
        board.push(Array.from({length: WIDTH}));
    }
}


  /*makeHTMLboard() function creates the game board through HTML, 
  creating table structure along with the clickable areas for adding a game piece to each respective column.
  Appends rows and cells to table creating main board */

function makeHtmlBoard() {
  const board = document.getElementById('board');

  /* make column tops (clickable area for adding a piece to that column)*/

  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  /*creates clickable areas to game board for game pieces*/

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  /*creates main part of board*/

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

  /* findSpotForCol- gives a column index [x] which finds the top empty row of board [y] in the column.
  then will iterate from bottom row --> top row and returns first empty row found.
  returns null if filled */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}


  /* placeInTable- places a game piece at the specified row/column.
  creates a div representing the game piece
  assigns classes for styling 
  appends it to a cell in the HTML table */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}


  /* endGame- announces end of game by displaying an alert message (see checkForWin for message) */

function endGame(msg) {
  alert(msg);
}

  /* handleClick- handles the click event when player clicks a column to drop game piece */

function handleClick(evt) {
  const x = +evt.target.id;

    /* checks if there's a spot to place game piece in clicked column.
    if column is filled and no spot available, click is ignored */
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

    /* place game piece and add to board */
  board[y][x] = currPlayer;
  placeInTable(y, x);
  
    /* check game for win */
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} is the winner!`);
  }
  
    /* check game for tie */
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
    
    /* switch current player*/
  currPlayer = currPlayer === 1 ? 2 : 1;

  const columnTop = document.getElementById('column-top');
  columnTop.classList.toggle('p1');
  columnTop.classList.toggle('p2');
}


  /* checkForWin- checks each cell of game board to determine if there's a winning condition.
  checks for four cells in a row/column/diagonal belonging to a singular player and will return true if so */

function checkForWin() {
  function _win(cells) {

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

 /* _win- helper function to check if four cells belong to a singular player.
 takes an array of cells of four coordinates
 returns true if cells are correct coordinates within the board (and belong to singular player)*/

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
