//array equality function
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}


/*
We store our game status element here to allow us to more easily 
use it later on 
*/
const statusDisplay = document.querySelector('.game--status');
/*
Here we declare some variables that we will use to track the 
game state throught the game. 
*/
/*
We will use gameActive to pause the game in case of an end scenario
*/
let gameActive = true;
/*
We will store our current player here, so we know whos turn 
*/
let currentPlayer = "🔴";
const red_win = ["🔴", "🔴", "🔴", "🔴"];
const yellow_win = ["🟡","🟡", "🟡", "🟡"];
/*
We will store our current game state here, the form of empty strings in an array
 will allow us to easily track played cells and validate the game state later on
*/
let gameState = new Array(42);

for (var i = 0; i < 42; i++) {
    gameState[i] = "";
}
/*
Here we have declared some messages we will display to the user during the game.
Since we have some dynamic factors in those messages, namely the current player,
we have declared them as functions, so that the actual message gets created with 
current data every time we need it.
*/
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
/*
We set the inital message to let the players know whose turn it is
*/
statusDisplay.innerHTML = currentPlayerTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    quotient = Math.floor(clickedCellIndex/7);
    remainder = clickedCellIndex % 7;

    for (var i = 5; i > -1; i--){
        if (gameState[(i*7)+remainder] == ""){
            gameState[(i*7)+remainder] = currentPlayer;
            clickedCell = document.getElementsByClassName("cell")[(i*7)+remainder];
            clickedCell.innerHTML = currentPlayer;
            break;
        }
    }


}
function handlePlayerChange() {
    currentPlayer = currentPlayer === "🔴" ? "🟡" : "🔴";
    statusDisplay.innerHTML = currentPlayerTurn()
}
function handleResultValidation() {
    let roundWon = false;

    //horizontal check
    for (var row = 0; row < 6; row++){
        for (var s = 0; s < 4; s++){
            cell1 = document.getElementsByClassName("cell")[(row*7)+s];
            cell2 = document.getElementsByClassName("cell")[(row*7)+s+1];
            cell3 = document.getElementsByClassName("cell")[(row*7)+s+2];
            cell4 = document.getElementsByClassName("cell")[(row*7)+s+3];

            horizontal = [cell1.innerHTML, cell2.innerHTML, cell3.innerHTML, cell4.innerHTML];
            
            if (arraysEqual(horizontal, red_win) || arraysEqual(horizontal, yellow_win)){
                roundWon = true;
            }
        }
    }

    //vertical win check
    for (var col = 0; col < 7; col++){
        for (var s = 0; s < 3; s++){
            cell1 = document.getElementsByClassName("cell")[col + (s)*7];
            cell2 = document.getElementsByClassName("cell")[col + (s+1)*7];
            cell3 = document.getElementsByClassName("cell")[col + (s+2)*7];
            cell4 = document.getElementsByClassName("cell")[col + (s+3)*7];

            vertical = [cell1.innerHTML, cell2.innerHTML, cell3.innerHTML, cell4.innerHTML];
            
            if (arraysEqual(vertical, red_win) || arraysEqual(vertical, yellow_win)){
                roundWon = true;
            }
        }
    }

    lskip = [4, 5, 6, 12, 13, 20, 21, 28, 29, 35, 36, 37];
    //diagonal check (top left to bottom right \)

    for (var ind = 0; ind < 42; ind++){

        ind_arr = ["0", "0","0","0"];

        for (var i = 0; i < 4; i++){
            if (ind + (8*i) < 42 && !(lskip.includes(ind+(8*i)))){
                ind_arr[i] = document.getElementsByClassName("cell")[ind+(8*i)].innerHTML;
            }
        }

        if (arraysEqual(ind_arr, red_win) || arraysEqual(ind_arr, yellow_win)){
            roundWon = true;
        }
    }

    rskip = [0, 1, 2, 7, 8, 14, 27, 33, 34, 39, 40, 41];
    //diagonal check (top right to bottom left /)
    for (var ind = 0; ind < 42; ind++){

        ind_arr = ["0", "0","0","0"];

        for (var i = 0; i < 4; i++){
            if (ind + (6*i) < 42 && !(rskip.includes(ind+(6*i)))){
                ind_arr[i] = document.getElementsByClassName("cell")[ind+(6*i)].innerHTML;
            }
        }

        if (arraysEqual(ind_arr, red_win) || arraysEqual(ind_arr, yellow_win)){
            roundWon = true;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}
function handleCellClick(clickedCellEvent) {
/*
We will save the clicked html element in a variable for easier further use
*/    
const clickedCell = clickedCellEvent.target;
/*
Here we will grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid. 
Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an 
integer(number)
*/
    const clickedCellIndex = parseInt(
      clickedCell.getAttribute('data-cell-index')
    );;
/* 
Next up we need to check whether the call has already been played, 
or if the game is paused. If either of those is true we will simply ignore the click.
*/
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
/* 
If everything if in order we will proceed with the game flow
*/    
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "🔴";

    gameState = new Array(42);
    for (var i = 0; i < 42; i++) {
        gameState[i] = "";
    }
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
}
/*
And finally we add our event listeners to the actual game cells, as well as our 
restart button
*/
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);