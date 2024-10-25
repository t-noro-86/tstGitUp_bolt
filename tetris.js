// canvas要素の取得
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

// ゲームボードの設定
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

// テトロミノの形状定義
const SHAPES = [
    [],
    [[1, 1, 1, 1]],  // I
    [[1, 1], [1, 1]],  // O
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1, 1], [1, 0, 0]],  // L
    [[1, 1, 1], [0, 0, 1]],  // J
    [[1, 1, 0], [0, 1, 1]],  // S
    [[0, 1, 1], [1, 1, 0]]   // Z
];

// ゲームボードの初期化
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = getRandomPiece();
let currentX = 3;
let currentY = 0;

// ランダムなテトロミノを取得する関数
function getRandomPiece() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

// ゲームボードを描画する関数
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

// 現在のテトロミノを描画する関数
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

// テトロミノの移動が有効かチェックする関数
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

// テトロミノをボードに固定する関数
function mergePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[currentY + y][currentX + x] = 1;
            }
        }
    }
}

// 揃った行を削除する関数
function removeFullRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

// ゲームのメインループ
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

// キーボード入力のイベントリスナー
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

// ゲームループの開始（500ミリ秒ごとに実行）
setInterval(gameLoop, 500);

// 初期描画
drawBoard();
drawPiece();
