// script.js
const columns = 7;
const rows = 6;
const board = Array.from({ length: rows }, () => Array(columns).fill(null));
let currentPlayer = 'red';  // Start with the red player
let gameOver = false;

const grid = document.getElementById('grid');
const status = document.getElementById('status');

// Create the game board with clickable cells
function createBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            grid.appendChild(cell);
        }
    }
}

// Handle player's click on a column
function handleCellClick(event) {
    if (gameOver) return;
    
    const col = parseInt(event.target.dataset.col);
    const row = getAvailableRow(col);
    
    if (row === -1) return; // Column is full, do nothing
    
    // Update the board state
    board[row][col] = currentPlayer;
    
    // Place the player's piece on the UI
    const cell = grid.children[row * columns + col];
    cell.classList.add(currentPlayer);

    // Check for a winner or tie
    if (checkWinner(row, col)) {
        status.textContent = `Player ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`;
        gameOver = true;
    } else if (board.flat().every(cell => cell !== null)) {
        status.textContent = "It's a tie!";
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        status.textContent = `Player ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    }
}

// Get the lowest empty row in the selected column
function getAvailableRow(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === null) {
            return row;
        }
    }
    return -1;  // Column is full
}

// Check if there's a winner after a move
function checkWinner(row, col) {
    return (
        checkDirection(row, col, 1, 0) ||  // Horizontal
        checkDirection(row, col, 0, 1) ||  // Vertical
        checkDirection(row, col, 1, 1) ||  // Diagonal /
        checkDirection(row, col, 1, -1)    // Diagonal \
    );
}

// Check if there are four consecutive pieces in one direction
function checkDirection(row, col, deltaRow, deltaCol) {
    let count = 1;
    
    // Check one direction (deltaRow, deltaCol)
    let r = row + deltaRow;
    let c = col + deltaCol;
    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
        count++;
        r += deltaRow;
        c += deltaCol;
    }
    
    // Check the opposite direction (-deltaRow, -deltaCol)
    r = row - deltaRow;
    c = col - deltaCol;
    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
        count++;
        r -= deltaRow;
        c -= deltaCol;
    }
    
    return count >= 4;
}

// Initialize the board and status
createBoard();
