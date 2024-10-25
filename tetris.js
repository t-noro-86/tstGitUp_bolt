const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

// テトロミノの形状
const SHAPES = [
    [],
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = getRandomPiece();
let currentX = 3;
let currentY = 0;

function getRandomPiece() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    ctx.fillStyle = 'red';
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                ctx.fillRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function isValidMove(piece, x, y) {
    for (let py = 0; py < piece.length; py++) {
        for (let px = 0; px < piece[py].length; px++) {
            if (piece[py][px]) {
                let newX = x + px;
                let newY = y + py;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function mergePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[currentY + y][currentX + x] = 1;
            }
        }
    }
}

function removeFullRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function gameLoop() {
    if (isValidMove(currentPiece, currentX, currentY + 1)) {
        currentY++;
    } else {
        mergePiece();
        removeFullRows();
        currentPiece = getRandomPiece();
        currentX = 3;
        currentY = 0;
        if (!isValidMove(currentPiece, currentX, currentY)) {
            alert('ゲームオーバー');
            return;
        }
    }
    drawBoard();
    drawPiece();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (isValidMove(currentPiece, currentX - 1, currentY)) currentX--;
            break;
        case 'ArrowRight':
            if (isValidMove(currentPiece, currentX + 1, currentY)) currentX++;
            break;
        case 'ArrowDown':
            if (isValidMove(currentPiece, currentX, currentY + 1)) currentY++;
            break;
        case 'ArrowUp':
            let rotated = currentPiece[0].map((_, i) => currentPiece.map(row => row[i]).reverse());
            if (isValidMove(rotated, currentX, currentY)) currentPiece = rotated;
            break;
    }
    drawBoard();
    drawPiece();
});

setInterval(gameLoop, 500);
drawBoard();
drawPiece();
