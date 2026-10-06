const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const resetScoresBtn = document.getElementById('reset-scores-btn');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const xWinsEl = document.getElementById('x-wins');
const oWinsEl = document.getElementById('o-wins');
const drawsEl = document.getElementById('draws');2

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isPvC = false;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let scores = {
    X: 0,
    O: 0,
    Draws: 0
};

function init() {
    loadScores();
    updateScoreBoard();

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    resetScoresBtn.addEventListener('click', resetScores);
    
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            isPvC = e.target.value === 'pvc';
            resetGame();
        });
    });

    updateStatus();
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== '' || !isGameActive) {
        return;
    }

    makeMove(index, currentPlayer);

    if (isGameActive && isPvC && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());

    checkWinner();

    if (isGameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function makeComputerMove() {
    const availableIndices = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableIndices.push(i);
        }
    }

    if (availableIndices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const move = availableIndices[randomIndex];

    makeMove(move, 'O');
}

function checkWinner() {
    let roundWon = false;
    let winningCombo = null;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombo = winConditions[i];
            break;
        }
    }

    if (roundWon) {
        const winningPlayer = board[winningCombo[0]];
        statusText.textContent = `Player ${winningPlayer} Wins!`;
        isGameActive = false;

        winningCombo.forEach(index => {
            cells[index].classList.add('winner-cell');
        });

        updateScore(winningPlayer);
        return;
    }

    if (!board.includes('')) {
        statusText.textContent = 'Game is a Draw!';
        isGameActive = false;
        updateScore('Draws');
        return;
    }
}

function updateStatus() {
    if (isGameActive) {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function updateScore(result) {
    if (result === 'X') scores.X++;
    else if (result === 'O') scores.O++;
    else if (result === 'Draws') scores.Draws++;

    saveScores();
    updateScoreBoard();
}

function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

function updateScoreBoard() {
    xWinsEl.textContent = scores.X;
    oWinsEl.textContent = scores.O;
    drawsEl.textContent = scores.Draws;
}

function resetScores() {
    scores = { X: 0, O: 0, Draws: 0 };
    saveScores();
    updateScoreBoard();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner-cell');
    });

    updateStatus();
}

init();