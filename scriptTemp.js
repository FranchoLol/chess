document.addEventListener('DOMContentLoaded', () => {
    const chessboardContainer = document.querySelector('.chessboard-container');
    const chessboard = document.querySelector('.chessboard');
    const moveHistory = document.getElementById('move-history');
    const resetButton = document.getElementById('reset-game');
    const captureScreenshotButton = document.getElementById('capture-screenshot');
    const saveHistoryButton = document.getElementById('save-history');
    const promotionModal = document.getElementById('promotion-modal');
    const gameOverModal = document.getElementById('game-over-modal');
    const newGameButton = document.getElementById('new-game');
    const showMovesWhite = document.getElementById('show-moves-white');
    const showMovesBlack = document.getElementById('show-moves-black');
    const showCheckWhite = document.getElementById('show-check-white');
    const showCheckBlack = document.getElementById('show-check-black');
    const boardThemeSelect = document.getElementById('board-theme-select');
    const themeToggle = document.getElementById('theme-toggle');
    const playFriendModal = document.getElementById('play-friend-modal');
    const playerAInput = document.getElementById('playerA');
    const playerBInput = document.getElementById('playerB');
    const playFriendConfirm = document.getElementById('play-friend-confirm');
    const playFriendCancel = document.getElementById('play-friend-cancel');
    const playWithTimerModal = document.getElementById('play-with-timer-modal');
    const timerSelect = document.getElementById('timer-select');
    const timerConfirm = document.getElementById('timer-confirm');
    const timerCancel = document.getElementById('timer-cancel');
    const playWithTimerButton = document.getElementById('play-with-timer-btn');
    const blackPlayer = document.querySelector('.black-player');
    const lightPlayer = document.querySelector('.light-player');
    const playerTopElement = document.getElementById('player-top');
    const playerBottomElement = document.getElementById('player-bottom');
    const playerTopTimerElement = document.getElementById('player-top-timer');
    const playerBottomTimerElement = document.getElementById('player-bottom-timer');
    const gameResultElement = document.getElementById('game-result');
    const moveBackButton = document.getElementById('move-back');
    const moveForwardButton = document.getElementById('move-forward');
    const moveFastForwardButton = document.getElementById('move-fast-forward');


    // Estado inicial del tablero
    let board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    // Variables de estado del juego
    let selectedPiece = null;
    let isWhiteTurn = true;
    let moveCount = '1';
    let moveCountTotal = 0;
    let lastMove = null;
    let enPassantSquare = null;
    let kingMoved = { white: false, black: false };
    let rooksMoved = { white: { left: false, right: false }, black: { left: false, right: false } };
    let gameOver = false;

    let whiteKingInCheck = false;
    let blackKingInCheck = false;

    // timers de jugadores
    let players = { top: '', bottom: '' };
    let timers = {};
    let currentPlayer = 'bottom'; // Las blancas (jugador inferior) comienzan
    let timerInterval = null;

    // Variables para el historial de movimientos
    let navMoveHistory = []; // Aquí se guardan los movimientos realizados
    let currentMoveIndex = -1; // Índice del movimiento actual en el historial

    // Símbolos de las piezas
    const pieceSymbols = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    // Variables para el juego contra IA
    let aiPlayer = null;
    let aiElo = 1000;
    let playerName = '';
    let aiName = 'ChessAI';
    let playerColor = '';
    let isEngineReady = false;
    let stockfishWorker = null;
    let initializationAttempts = 0;
    const MAX_INITIALIZATION_ATTEMPTS = 5;
    const RETRY_DELAY = 3000;

    // Función para renderizar el tablero
    function renderBoard() {
        chessboard.innerHTML = '';
        const showCheckWhite = document.getElementById('show-check-white').checked;
        const showCheckBlack = document.getElementById('show-check-black').checked;
    
        board.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                const square = document.createElement('div');
                square.className = `chess-square ${(rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'}`;
                if (piece !== '0') {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece === piece.toUpperCase() ? 'white-piece' : 'black-piece'}`;
                    pieceElement.textContent = pieceSymbols[piece];
                    pieceElement.draggable = true;
                    pieceElement.addEventListener('dragstart', handleDragStart);
                    square.appendChild(pieceElement);
                }
                square.dataset.row = rowIndex;
                square.dataset.col = colIndex;
                square.addEventListener('click', handleSquareClick);
                square.addEventListener('dragover', handleDragOver);
                square.addEventListener('drop', handleDrop);
                
                // Resaltar la casilla del rey en jaque si la opción está activada
                if ((piece === 'K' && whiteKingInCheck && showCheckWhite) || 
                    (piece === 'k' && blackKingInCheck && showCheckBlack)) {
                    square.classList.add('check');
                }
                
                chessboard.appendChild(square);
            });
        });
        updateCheckMessage();
    }
    

    // Manejo de inicio de arrastre
    function handleDragStart(event) {
        const square = event.target.parentElement;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        if (canSelectPiece(row, col)) {
            selectedPiece = { row, col };
            event.dataTransfer.setData('text/plain', `${row},${col}`);
            showPossibleMoves(row, col);
        } else {
            event.preventDefault();
        }
    }

    // Manejo de arrastre sobre una casilla
    function handleDragOver(event) {
        event.preventDefault();
    }

    // Manejo de soltar una pieza
    function handleDrop(event) {
        event.preventDefault();
        const [fromRow, fromCol] = event.dataTransfer.getData('text').split(',').map(Number);
        const toRow = parseInt(event.currentTarget.dataset.row);
        const toCol = parseInt(event.currentTarget.dataset.col);
        
        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            movePiece(fromRow, fromCol, toRow, toCol);
        }
        
        selectedPiece = null;
        clearHighlights();
    }

    // Manejo de clics en las casillas
    function handleSquareClick(event) {
        const square = event.target.closest('.chess-square');
        if (!square) return;
    
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
    
        if (selectedPiece) {
            // Si ya hay una pieza seleccionada, intentamos mover
            const fromRow = selectedPiece.row;
            const fromCol = selectedPiece.col;
    
            if (isValidMove(fromRow, fromCol, row, col)) {
                movePiece(fromRow, fromCol, row, col);
                clearHighlights();
                selectedPiece = null;
            } else {
                // Si el movimiento no es válido, deseleccionamos
                clearHighlights();
                selectedPiece = null;
                // Intentamos seleccionar la nueva pieza si es válido
                selectPiece(row, col);
            }
        } else {
            // Si no hay pieza seleccionada, intentamos seleccionar
            selectPiece(row, col);
        }
    }
    

    // Selección de una pieza
    function selectPiece(row, col) {
        if (canSelectPiece(row, col)) {
            selectedPiece = { row, col };
            highlightSquare(row, col);
            showPossibleMoves(row, col);
        }
    }

    // Verificar si se puede seleccionar una pieza
    function canSelectPiece(row, col) {
        const piece = board[row][col];
        return piece !== '0' && ((isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase()));
    }

    // Validación de movimientos
    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol].toLowerCase();
        const dx = toCol - fromCol;
        const dy = toRow - fromRow;
    
        // Verificar si el destino está ocupado por una pieza del mismo color
        if (board[toRow][toCol] !== '0' && 
            ((isWhiteTurn && board[toRow][toCol] === board[toRow][toCol].toUpperCase()) ||
             (!isWhiteTurn && board[toRow][toCol] === board[toRow][toCol].toLowerCase()))) {
            return false;
        }
    
        let validMove = false;
    
        switch (piece) {
            case 'p':
                validMove = isValidPawnMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'r':
                validMove = isValidRookMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'n':
                validMove = (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
                break;
            case 'b':
                validMove = isValidBishopMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'q':
                validMove = isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
                break;
            case 'k':
                validMove = isValidKingMove(fromRow, fromCol, toRow, toCol);
                break;
        }
    
        if (validMove) {
            // Verificar si el movimiento deja al rey en jaque
            const tempBoard = board.map(row => [...row]);
            tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
            tempBoard[fromRow][fromCol] = '0';
            if (isKingInCheck(tempBoard, isWhiteTurn)) {
                return false;
            }
        }
    
        return validMove;
    }

    // Validación de movimientos del peón
    function isValidPawnMove(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol];
        const direction = piece === piece.toUpperCase() ? -1 : 1;
        const startRow = piece === piece.toUpperCase() ? 6 : 1;

        // Movimiento hacia adelante
        if (fromCol === toCol && board[toRow][toCol] === '0') {
            if (toRow === fromRow + direction) {
                return true;
            }
            if (fromRow === startRow && toRow === fromRow + 2 * direction && board[fromRow + direction][fromCol] === '0') {
                return true;
            }
        }

        // Captura
        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
            if (board[toRow][toCol] !== '0' && isOpponentPiece(piece, board[toRow][toCol])) {
                return true;
            }
            // En passant
            if (toRow === enPassantSquare?.row && toCol === enPassantSquare?.col) {
                return true;
            }
        }

        return false;
    }

    // Validación de movimientos de la torre
    function isValidRookMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        const dx = Math.sign(toCol - fromCol);
        const dy = Math.sign(toRow - fromRow);
        let x = fromCol + dx;
        let y = fromRow + dy;

        while (x !== toCol || y !== toRow) {
            if (board[y][x] !== '0') return false;
            x += dx;
            y += dy;
        }

        return true;
    }

    // Validación de movimientos del alfil
    function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
        const dx = Math.sign(toCol - fromCol);
        const dy = Math.sign(toRow - fromRow);
        let x = fromCol + dx;
        let y = fromRow + dy;

        while (x !== toCol && y !== toRow) {
            if (board[y][x] !== '0') return false;
            x += dx;
            y += dy;
        }

        return true;
    }

    // Validación de movimientos del rey (incluyendo enroque)
    function isValidKingMove(fromRow, fromCol, toRow, toCol) {
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);

        // Movimiento normal del rey
        if (dx <= 1 && dy <= 1) {
            return true;
        }

        // Enroque
        if (dy === 0 && dx === 2) {
            const isWhiteKing = board[fromRow][fromCol] === 'K';
            const row = isWhiteKing ? 7 : 0;

            // Verificar si el rey o las torres se han movido
            if (isWhiteKing ? kingMoved.white : kingMoved.black) {
                return false;
            }

            // Enroque corto
            if (toCol > fromCol && !rooksMoved[isWhiteKing ? 'white' : 'black'].right) {
                return canCastle(row, 4, 7);
            }

            // Enroque largo
            if (toCol < fromCol && !rooksMoved[isWhiteKing ? 'white' : 'black'].left) {
                return canCastle(row, 4, 0);
            }
        }

        return false;
    }

    // Verificar si se puede realizar el enroque
    function canCastle(row, fromCol, toCol) {
        const step = toCol > fromCol ? 1 : -1;
        
        // Verificar si las casillas entre el rey y la torre están vacías
        for (let col = fromCol + step; col !== toCol; col += step) {
            if (board[row][col] !== '0') {
                return false;
            }
        }

        // Verificar si el rey pasa por casillas amenazadas
        for (let col = fromCol; col !== toCol + step; col += step) {
            if (isSquareUnderAttack(row, col, !isWhiteTurn)) {
                return false;
            }
        }

        return true;
    }

    // Mover una pieza
    function movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol];
        const capturedPiece = board[toRow][toCol];
        let = isEnPassant = false;

        // Manejar captura en passant
        if (piece.toLowerCase() === 'p' && toRow === enPassantSquare?.row && toCol === enPassantSquare?.col) {
            board[fromRow][toCol] = '0'; // Remover el peón capturado
            isEnPassant = true;
        }

        // Manejar enroque
        if (piece.toLowerCase() === 'k' && Math.abs(toCol - fromCol) === 2) {
            const rookFromCol = toCol > fromCol ? 7 : 0;
            const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
            board[toRow][rookToCol] = board[toRow][rookFromCol];
            board[toRow][rookFromCol] = '0';
        }

        // Actualizar estado de movimiento del rey y las torres
        if (piece.toLowerCase() === 'k') {
            kingMoved[isWhiteTurn ? 'white' : 'black'] = true;
        } else if (piece.toLowerCase() === 'r') {
            const side = fromCol === 0 ? 'left' : 'right';
            rooksMoved[isWhiteTurn ? 'white' : 'black'][side] = true;
        }

        // Establecer casilla para en passant si un peón se mueve dos casillas
        if (piece.toLowerCase() === 'p' && Math.abs(fromRow - toRow) === 2) {
            enPassantSquare = { row: (fromRow + toRow) / 2, col: fromCol };
        } else {
            enPassantSquare = null;
        }

        // Actualizar el tablero
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = '0';

        // Verificar jaque para ambos reyes
        whiteKingInCheck = isInCheck(true);
        blackKingInCheck = isInCheck(false);

        // Actualizar el mensaje de jaque
        updateCheckMessage();

        // Promoción de peón
        if (piece.toLowerCase() === 'p' && (toRow === 0 || toRow === 7)) {
            promotePawn(toRow, toCol);
        } else {
            finalizeTurn();
        }

        if (aiPlayer && isWhiteTurn !== (playerColor === 'white')) {
            setTimeout(makeAiMove, 500);
        }

        updateMoveHistory(fromRow, fromCol, toRow, toCol, piece, capturedPiece, isEnPassant);
        lastMove = {piece, fromRow, fromCol, toRow, toCol};

        recordMove();

        moveCountTotal++;
        updateMoveCount();
    }

    function updateMoveCount() {
        const moveCountElement = document.getElementById('move-count');
        if (moveCountElement) {
            moveCountElement.textContent = `Movidas totales: ${moveCountTotal}`;
        }
    }

    // Promoción de peón
    function promotePawn(row, col) {
        const color = isWhiteTurn ? 'white' : 'black';
        if (document.getElementById(`auto-queen-${color}`).checked) {
            board[row][col] = isWhiteTurn ? 'Q' : 'q';
            renderBoard();
            finalizeTurn();
        } else {
            showPromotionModal(row, col);
        }
    }

    // Mostrar modal de promoción
    function showPromotionModal(row, col) {
        promotionModal.style.display = 'block';
        const pieces = promotionModal.querySelectorAll('.piece');
        pieces.forEach(piece => {
            piece.onclick = () => {
                const promotedPiece = piece.dataset.piece;
                board[row][col] = isWhiteTurn ? promotedPiece.toUpperCase() : promotedPiece.toLowerCase();
                promotionModal.style.display = 'none';
                renderBoard();
                finalizeTurn();
            };
        });
    }
    
    // Mostrar modal de fin de juego
    function showGameOverModal(winner) {
        const resultElement = document.getElementById('game-result');
        resultElement.textContent = winner === 'Empate'
            ? 'El juego ha terminado en empate.'
            : `${winner} han ganado el juego por jaque mate.`;
        gameOverModal.style.display = 'block';

        stopTimers();
    }
    function showGameOverModalTimer(winner, reason) {
        const resultElement = document.getElementById('game-result');
        resultElement.textContent = `${winner} gana por falta de tiempo de ${reason}.`;
        gameOverModal.style.display = 'block';

        stopTimers();
    }

    // Verificar si una pieza es del oponente
    function isOpponentPiece(piece, targetPiece) {
        return (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()) ||
               (piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase());
    }

    // Resaltar casilla seleccionada
    function highlightSquare(row, col) {
        const square = document.querySelector(`.chess-square[data-row="${row}"][data-col="${col}"]`);
        if (square) square.classList.add('selected');
    }

    // Mostrar movimientos posibles
    function showPossibleMoves(row, col) {
        const showMoves = isWhiteTurn ? showMovesWhite.checked : showMovesBlack.checked;
        if (!showMoves) return;
    
        const piece = board[row][col];
        const isKing = piece.toLowerCase() === 'k';
    
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (isValidMove(row, col, i, j)) {
                    const square = document.querySelector(`.chess-square[data-row="${i}"][data-col="${j}"]`);
                    if (square) {
                        if (isKing && Math.abs(j - col) === 2) {
                            square.classList.add('castling-move');
                        } else {
                            square.classList.add('possible-move');
                        }
                    }
                }
            }
        }
    }
    
    // Limpiar resaltados
    function clearHighlights() {
        document.querySelectorAll('.chess-square').forEach(square => {
            square.classList.remove('selected', 'possible-move', 'check', 'legal-move', 'castling-move');
        });
    }

    // Actualizar historial de movimientos
    function updateMoveHistory(fromRow, fromCol, toRow, toCol, piece, capturedPiece, isEnPassant) {
        const from = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}`;
        const to = `${String.fromCharCode(97 + toCol)}${8 - toRow}`;
        let moveText = `${moveCount + 1}. ${pieceSymbols[piece]}${from}-${to}`;

        if (capturedPiece !== '0') {moveText += ` x${pieceSymbols[capturedPiece]}`;}
        if (isEnPassant) {moveText += ' xE.P';}

        const moveElement = document.createElement('div');
        moveElement.textContent = moveText;
        moveElement.className = isWhiteTurn ? 'white-move' : 'black-move';
        moveHistory.appendChild(moveElement);
        moveHistory.scrollTop = moveHistory.scrollHeight;

        if (isWhiteTurn) {moveCount++;}
    }

    // Verificar si el rey está en jaque
    function isInCheck(isWhiteKing) {
        const kingSymbol = isWhiteKing ? 'K' : 'k';
        let kingRow, kingCol;

        // Encontrar el rey
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === kingSymbol) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== undefined) break;
        }

        return isSquareUnderAttack(kingRow, kingCol, !isWhiteKing);
    }

    // Verificar si una casilla está bajo ataque
    function isSquareUnderAttack(row, col, byWhite) {
        // Verificar ataques de peones
        const pawnDirection = byWhite ? 1 : -1;
        const pawnSymbol = byWhite ? 'P' : 'p';
        if (row + pawnDirection >= 0 && row + pawnDirection < 8) {
            if (col - 1 >= 0 && board[row + pawnDirection][col - 1] === pawnSymbol) return true;
            if (col + 1 < 8 && board[row + pawnDirection][col + 1] === pawnSymbol) return true;
        }

        // Verificar ataques de caballos
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        const knightSymbol = byWhite ? 'N' : 'n';
        for (const [dy, dx] of knightMoves) {
            const newRow = row + dy;
            const newCol = col + dx;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (board[newRow][newCol] === knightSymbol) return true;
            }
        }

        // Verificar ataques en línea recta (torre y reina)
        const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (isUnderAttackInDirections(row, col, straightDirections, byWhite, ['r', 'q'])) return true;

        // Verificar ataques en diagonal (alfil y reina)
        const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        if (isUnderAttackInDirections(row, col, diagonalDirections, byWhite, ['b', 'q'])) return true;

        // Verificar ataques del rey
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        const kingSymbol = byWhite ? 'K' : 'k';
        for (const [dy, dx] of kingMoves) {
            const newRow = row + dy;
            const newCol = col + dx;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (board[newRow][newCol] === kingSymbol) return true;
            }
        }

        return false;
    }

    // Función auxiliar para verificar ataques en direcciones específicas
    function isUnderAttackInDirections(row, col, directions, byWhite, pieceTypes) {
        for (const [dy, dx] of directions) {
            let newRow = row + dy;
            let newCol = col + dx;
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const piece = board[newRow][newCol];
                if (piece !== '0') {
                    if (byWhite === (piece === piece.toUpperCase()) &&
                        pieceTypes.includes(piece.toLowerCase())) {
                        return true;
                    }
                    break;
                }
                newRow += dy;
                newCol += dx;
            }
        }
        return false;
    }

    // Verificar jaque mate
    function isCheckmate(isWhiteKing) {
        if (!isInCheck(isWhiteKing)) return false;
    
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = board[fromRow][fromCol];
                if (piece !== '0' && ((isWhiteKing && piece === piece.toUpperCase()) || (!isWhiteKing && piece === piece.toLowerCase()))) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                                const tempBoard = board.map(row => [...row]);
                                tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
                                tempBoard[fromRow][fromCol] = '0';
                                if (!isKingInCheck(tempBoard, isWhiteKing)) {
                                    return false; // Hay al menos un movimiento legal que saca al rey del jaque
                                }
                            }
                        }
                    }
                }
            }
        }
    
        return true; // No hay movimientos legales que saquen al rey del jaque, es jaque mate
    }

    // Verificar si el rey está en jaque (para uso en movimientos temporales)
    function isKingInCheck(tempBoard, isWhiteKing) {
        const kingSymbol = isWhiteKing ? 'K' : 'k';
        let kingRow, kingCol;
    
        // Encontrar el rey
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (tempBoard[row][col] === kingSymbol) {
                    kingRow = row;
                    kingCol = col;
                    return isSquareUnderAttackTemp(tempBoard, kingRow, kingCol, !isWhiteKing);
                }
            }
        }
    
        return false; // No se encontró el rey (esto no debería suceder en un juego normal)
    }

    // Versión temporal de isSquareUnderAttack para usar con el tablero temporal
    function isSquareUnderAttackTemp(tempBoard, row, col, byWhite) {
        // Verificar ataques de peones
        const pawnDirection = byWhite ? 1 : -1;
        const pawnSymbol = byWhite ? 'P' : 'p';
        if (row + pawnDirection >= 0 && row + pawnDirection < 8) {
            if (col - 1 >= 0 && tempBoard[row + pawnDirection][col - 1] === pawnSymbol) return true;
            if (col + 1 < 8 && tempBoard[row + pawnDirection][col + 1] === pawnSymbol) return true;
        }

        // Verificar ataques de caballos
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        const knightSymbol = byWhite ? 'N' : 'n';
        for (const [dy, dx] of knightMoves) {
            const newRow = row + dy;
            const newCol = col + dx;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (tempBoard[newRow][newCol] === knightSymbol) return true;
            }
        }

        // Verificar ataques en línea recta (torre y reina)
        const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (isUnderAttackInDirectionsTemp(tempBoard, row, col, straightDirections, byWhite, ['r', 'q'])) return true;

        // Verificar ataques en diagonal (alfil y reina)
        const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        if (isUnderAttackInDirectionsTemp(tempBoard, row, col, diagonalDirections, byWhite, ['b', 'q'])) return true;

        // Verificar ataques del rey
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        const kingSymbol = byWhite ? 'K' : 'k';
        for (const [dy, dx] of kingMoves) {
            const newRow = row + dy;
            const newCol = col + dx;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (tempBoard[newRow][newCol] === kingSymbol) return true;
            }
        }

        return false;
    }

    // Función auxiliar para verificar ataques en direcciones específicas (versión temporal)
    function isUnderAttackInDirectionsTemp(tempBoard, row, col, directions, byWhite, pieceTypes) {
        for (const [dy, dx] of directions) {
            let newRow = row + dy;
            let newCol = col + dx;
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const piece = tempBoard[newRow][newCol];
                if (piece !== '0') {
                    if (byWhite === (piece === piece.toUpperCase()) &&
                        pieceTypes.includes(piece.toLowerCase())) {
                        return true;
                    }
                    break;
                }
                newRow += dy;
                newCol += dx;
            }
        }
        return false;
    }

    // Finalizar el turno
    function finalizeTurn() {
        isWhiteTurn = !isWhiteTurn;
        switchPlayer();
        renderBoard();
    
        if (isCheckmate(isWhiteTurn)) {
            gameOver = true;
            showGameOverModal(isWhiteTurn ? 'Negras' : 'Blancas');
        } else if (isStalemate(isWhiteTurn)) {
            gameOver = true;
            showGameOverModal('Empate');
        }
    }

    // Verificar tablas por ahogado
    function isStalemate(isWhiteTurn) {
        if (isInCheck(isWhiteTurn)) return false;
    
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = board[fromRow][fromCol];
                if (piece !== '0' && ((isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase()))) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                                return false; // Hay al menos un movimiento legal
                            }
                        }
                    }
                }
            }
        }
    
        return true; // No hay movimientos legales, es ahogado
    }

    // Actualizar mensaje de jaque
    function updateCheckMessage() {
        const messageElement = document.getElementById('check-message');
        const showCheckWhite = document.getElementById('show-check-white').checked;
        const showCheckBlack = document.getElementById('show-check-black').checked;
    
        if (whiteKingInCheck && showCheckWhite) {
            messageElement.textContent = "¡Rey blanco en jaque!";
            messageElement.style.display = 'block';
        } else if (blackKingInCheck && showCheckBlack) {
            messageElement.textContent = "¡Rey negro en jaque!";
            messageElement.style.display = 'block';
        } else {
            messageElement.style.display = 'none';
        }
    }

    // Reiniciar el juego
    function resetGame() {
        board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        selectedPiece = null;
        isWhiteTurn = true;
        moveCount = 1;
        lastMove = null;
        enPassantSquare = null;
        kingMoved = { white: false, black: false };
        rooksMoved = { white: { left: false, right: false }, black: { left: false, right: false } };
        gameOver = false;
        whiteKingInCheck = false;
        blackKingInCheck = false;        
        moveHistory.innerHTML = '';
        renderBoard();
        moveCount = 0;
        updateMoveCount();
    }

// Función para capturar screenshot
function captureScreenshot() {
    console.log("Capturando screenshot...");
    html2canvas(document.querySelector('.chessboard')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'chess-screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
        console.log("Screenshot guardada");
    }).catch(error => {
        console.error("Error al capturar screenshot:", error);
    });
}

// Función para guardar historial
function saveHistory() {
    console.log("Guardando historial...");
    const moveHistoryElement = document.getElementById('move-history');
    if (moveHistoryElement) {
        // Incluir el contador total de movimientos
        const totalMovesText = `\nMovidas totales: ${moveCountTotal}`;

        // Obtener historial de movimientos
        const historyText = Array.from(moveHistoryElement.children).map(move => move.textContent).join('\n');

        // Crear el contenido del archivo
        const fileContent = totalMovesText + historyText;

        // Crear el archivo para descarga
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = 'chess-history.txt';
        link.href = URL.createObjectURL(blob);
        link.click();
        console.log("Historial guardado");
    } else {
        console.error("Elemento de historial de movimientos no encontrado");
    }
}






/* old system theme
    // Cambiar tema de la página
    function togglePageTheme() {
        const root = document.documentElement;
    
        // Alternar entre los temas light y dark
        if (root.classList.contains('light')) {
            root.classList.remove('light');
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
    
        updateThemeIconAndText();
        saveThemePreference();
    }
    
    // Actualizar icono del tema
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');
    
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light');
            document.documentElement.classList.toggle('dark');
        });
    });
   */
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark';
    function togglePageTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme', !isDark);
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i> Dark' : '<i class="fas fa-sun"></i> Light';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    

    
    

    // Cambiar tema del tablero
    function changeBoardTheme(theme) {
        const root = document.documentElement;
    
        // Eliminar las clases actuales relacionadas con el tablero
        root.classList.remove('default', 'chessCapria', 'chessClassic', 'chessClassicTwo', 'chessClassicTree', 'chessClassicFour', 'chessNeon', 'chessCyberpunk', 'chessOcean', 'chessSunset', 'chessForest', 'chessDesert', 'chessSpace', 'chessInvisible');
    
        // Agregar la clase nueva para el esquema del tablero
        root.classList.add(theme);
    
        // Renderizar el tablero nuevamente
        renderBoard();
    }
    // Restaurar preferencias de tema al iniciar
    function restoreThemePreference() {
        const savedBoardTheme = localStorage.getItem('boardTheme') || 'default';

        // Aplica el tema del tablero si corresponde
        changeBoardTheme(savedBoardTheme);
    }
    // Obtener el tema actual del tablero
    function getCurrentBoardTheme() {
        const root = document.documentElement;
        return (
            root.classList.contains('chessClassic') ? 'chessClassic' :
            root.classList.contains('chessCapria') ? 'chessCapria' :
            root.classList.contains('chessClassicTwo') ? 'chessClassicTwo' :
            root.classList.contains('chessClassicTree') ? 'chessClassicTree' :
            root.classList.contains('chessClassicFour') ? 'chessClassicFour' :
            root.classList.contains('chessNeon') ? 'chessNeon' :
            root.classList.contains('chessCyberpunk') ? 'chessCyberpunk' :
            root.classList.contains('chessOcean') ? 'chessOcean' :
            root.classList.contains('chessSunset') ? 'chessSunset' :
            root.classList.contains('chessForest') ? 'chessForest' :
            root.classList.contains('chessDesert') ? 'chessDesert' :
            root.classList.contains('chessSpace') ? 'chessSpace' :
            root.classList.contains('chessInvisible') ? 'chessInvisible' :
            'default'
        );
    }






// Inicializar el juego y restaurar configuraciones
function initGame() {
    resetGame();
    restoreThemePreference();

    const boardThemeSelect = document.getElementById('board-theme-select');
    if (boardThemeSelect) {
        boardThemeSelect.value = getCurrentBoardTheme();
    }

    renderBoard();
    initAIElements();
    initStockfish();
    disableAIControls();
    updateMoveCount();

    // Initialize other elements
    const resetButton = document.getElementById('reset-game');
    const captureScreenshotButton = document.getElementById('capture-screenshot');
    const saveHistoryButton = document.getElementById('save-history');
    const themeToggle = document.getElementById('theme-toggle');
    const newGameButton = document.getElementById('new-game');
    const showCheckWhite = document.getElementById('show-check-white');
    const showCheckBlack = document.getElementById('show-check-black');

    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }

    if (captureScreenshotButton) {
        captureScreenshotButton.addEventListener('click', captureScreenshot);
    }

    if (saveHistoryButton) {
        saveHistoryButton.addEventListener('click', saveHistory);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', togglePageTheme);
    }

    if (boardThemeSelect) {
        boardThemeSelect.addEventListener('change', (e) => changeBoardTheme(e.target.value));
    }

    if (newGameButton) {
        newGameButton.addEventListener('click', () => {
            const gameOverModal = document.getElementById('game-over-modal');
            if (gameOverModal) {
                gameOverModal.style.display = 'none';
            }
        });
    }

    if (showCheckWhite) {
        showCheckWhite.addEventListener('change', renderBoard);
    }

    if (showCheckBlack) {
        showCheckBlack.addEventListener('change', renderBoard);
    }
}

    // Event listeners
    resetButton.addEventListener('click', resetGame);

    document.addEventListener('DOMContentLoaded', () => {
        const captureScreenshotButton = document.getElementById('capture-screenshot');
        const saveHistoryButton = document.getElementById('save-history');
    
        if (captureScreenshotButton) {
            captureScreenshotButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir cualquier comportamiento por defecto
                captureScreenshot();
            });
        } else {
            console.error("Botón de captura de screenshot no encontrado");
        }
    
        if (saveHistoryButton) {
            saveHistoryButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir cualquier comportamiento por defecto
                saveHistory();
            });
        } else {
            console.error("Botón de guardar historial no encontrado");
        }
    });


    themeToggle.addEventListener('click', togglePageTheme);
    boardThemeSelect.addEventListener('change', (e) => changeBoardTheme(e.target.value));
    newGameButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
    });
    // Agregar event listeners para los checkboxes de "Indicar jaque"
    document.getElementById('show-check-white').addEventListener('change', renderBoard);
    document.getElementById('show-check-black').addEventListener('change', renderBoard);
    document.addEventListener('DOMContentLoaded', initGame);








    












// Función para mostrar un modal
function showModal(modal) {
    modal.style.display = 'block';
}

// Función para ocultar un modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Botón "Jugar con amigo" - Configuración inicial
document.getElementById('play-friend-btn').addEventListener('click', () => {
    showModal(playFriendModal);
});

playFriendConfirm.addEventListener('click', () => {
    const playerA = playerAInput.value.trim() || 'Jugador 1';
    const playerB = playerBInput.value.trim() || 'Jugador 2';

    // Asignar posiciones al azar
    const isPlayerAOnTop = Math.random() < 0.5;
    players.top = isPlayerAOnTop ? playerA : playerB;
    players.bottom = isPlayerAOnTop ? playerB : playerA;

    // Mostrar nombres en el tablero
    playerTopElement.textContent = players.top;
    playerBottomElement.textContent = players.bottom;

    blackPlayer.style.display = 'flex';
    lightPlayer.style.display = 'flex';
    chessboardContainer.style.padding = '0 0';

    // Habilitar botón de "Jugar con reloj"
    playWithTimerButton.disabled = false;

    // Cerrar modal
    hideModal(playFriendModal);
});

playFriendCancel.addEventListener('click', () => {
    hideModal(playFriendModal);
});

// Botón "Jugar con reloj"
playWithTimerButton.addEventListener('click', () => {
    if (!players.top || !players.bottom) {
        alert('Primero configura los jugadores con "Jugar con amigo".');
        return;
    }
    showModal(playWithTimerModal);
});

timerConfirm.addEventListener('click', () => {
    const selectedTime = parseInt(timerSelect.value); // Tiempo en segundos
    if (!selectedTime) {
        alert('Selecciona un tiempo válido.');
        return;
    }

    timers.top = selectedTime;
    timers.bottom = selectedTime;

    // Mostrar tiempos al lado de los nombres
    updateTimerDisplay();

    // Iniciar cronómetro
    startTimers();

    // Cerrar modal
    hideModal(playWithTimerModal);
});

timerCancel.addEventListener('click', () => {
    hideModal(playWithTimerModal);
});








// Función para iniciar el temporizador
function startTimers() {
    clearInterval(timerInterval); // Asegurar que no haya intervalos previos

    timerInterval = setInterval(() => {
        if (timers?.[currentPlayer] === null || timers?.[currentPlayer] === 'none') {
            // No hacer nada si el temporizador está en null o "none"
            return;
        }

        if (timers[currentPlayer] > 0) {
            timers[currentPlayer]--; // Reducir el tiempo del jugador actual
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            const loser = currentPlayer === 'top' ? players.top : players.bottom;
            const winner = currentPlayer === 'top' ? players.bottom : players.top;
            // Mostrar el mensaje por falta de tiempo
            showGameOverModalTimer(winner, loser);
        }
    }, 1000);
}

// Función para actualizar los tiempos en pantalla
function updateTimerDisplay() {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    playerTopTimerElement.innerHTML = `${formatTime(timers.top)} <i class="fas fa-hourglass-half"></i>`;
    playerBottomTimerElement.innerHTML = `${formatTime(timers.bottom)} <i class="fas fa-hourglass-half"></i>`;
}

// Función para cambiar de jugador después de un movimiento válido
function switchPlayer() {
    currentPlayer = currentPlayer === 'top' ? 'bottom' : 'top';
}

// Lógica para manejar clics en el tablero (movimientos de piezas)
document.querySelector('.chessboard').addEventListener('click', (event) => {
    const clickedSquare = event.target.closest('.chess-square');

    if (!clickedSquare) return; // Ignorar clics fuera del tablero

    const toRow = parseInt(clickedSquare.dataset.row);
    const toCol = parseInt(clickedSquare.dataset.col);

    if (selectedPiece) {
        // Intentar mover la pieza seleccionada
        const fromRow = selectedPiece.row;
        const fromCol = selectedPiece.col;

        const isValidMove = validateMove(fromRow, fromCol, toRow, toCol);

        if (isValidMove) {
            // Mover pieza y cambiar jugador
            movePiece(fromRow, fromCol, toRow, toCol);

            // Cambiar de jugador y continuar el temporizador
            switchPlayer();
            // Continuar el temporizador solo después de un movimiento válido
            updateTimerDisplay();
        }

        // Deseleccionar la pieza después del intento de movimiento
        selectedPiece = null;
    } else if (clickedSquare.firstChild) {
        // Seleccionar una pieza si pertenece al jugador actual
        const piece = board[toRow][toCol];
        const isPlayerPiece = (currentPlayer === 'bottom' && piece === piece.toUpperCase()) ||
                              (currentPlayer === 'top' && piece === piece.toLowerCase());

        if (isPlayerPiece) {
            selectedPiece = { row: toRow, col: toCol };
        }
    }
});

// Verificar condiciones de fin del juego
function checkEndGameCondition() {
    const isCheckmate = false; // Cambia esto con tu lógica de jaque mate
    const isStalemate = false; // Cambia esto con tu lógica de tablas

    if (isCheckmate) {
        showGameOverModal(`${currentPlayer === 'top' ? players.bottom : players.top} gana por jaque mate.`);
        clearInterval(timerInterval);
    } else if (isStalemate) {
        showGameOverModal('Empate', 'tablas');
        clearInterval(timerInterval);
    }
}

function stopTimers() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log("Temporizadores detenidos.");
    }
}

// Llamar a checkEndGameCondition después de cada movimiento
document.querySelector('.chessboard').addEventListener('click', () => {
    checkEndGameCondition();
});

// Configuración inicial para "Jugar con amigo"
document.getElementById('play-friend-confirm').addEventListener('click', () => {
    players = {
        top: document.getElementById('playerA').value || 'Jugador 1',
        bottom: document.getElementById('playerB').value || 'Jugador 2',
    };

    timers = {top: null, bottom: null};
    updateTimerDisplay();
    startTimers();
});

// Reiniciar el juego
document.getElementById('reset-game').addEventListener('click', () => {
    clearInterval(timerInterval);
    timers = {top: null, bottom: null};
    currentPlayer = 'bottom'; // Reinicia con las blancas
    playerTopElement.textContent = players.top;
    playerBottomElement.textContent = players.bottom;
    startTimers();
});








    

















// Captura el estado actual del tablero en formato de lista (visual)
function captureBoardState() {
    return Array.from(chessboard.querySelectorAll('.cell')).map(cell => cell.dataset.piece || null);
}

// Registra el estado actual del tablero en el historial
function recordMove() {
    const boardState = captureBoardState(); // Captura el estado actual del tablero
    navMoveHistory = navMoveHistory.slice(0, currentMoveIndex + 1); // Elimina movimientos futuros
    navMoveHistory.push(boardState); // Almacena el nuevo estado
    currentMoveIndex = navMoveHistory.length - 1; // Actualiza el índice al último movimiento
    updateButtonStates();
    console.log("Historial actualizado:", navMoveHistory); // Verificar en consola
}

// Retrocede un movimiento
function moveBack() {
    if (currentMoveIndex > 0) {
        currentMoveIndex--; // Retrocede el índice
        updateBoard(navMoveHistory[currentMoveIndex]); // Actualiza el tablero al estado previo
        updateButtonStates();
    }
}

// Avanza un movimiento
function moveForward() {
    if (currentMoveIndex < navMoveHistory.length - 1) {
        currentMoveIndex++; // Avanza el índice
        updateBoard(navMoveHistory[currentMoveIndex]); // Actualiza el tablero al siguiente estado
        updateButtonStates();
    }
}

// Avanza rápidamente al estado más reciente
function moveFastForward() {
    if (currentMoveIndex < navMoveHistory.length - 1) {
        currentMoveIndex = navMoveHistory.length - 1; // Salta al último índice
        updateBoard(navMoveHistory[currentMoveIndex]); // Actualiza el tablero al estado más reciente
        updateButtonStates();
    }
}

// Actualiza los botones según el estado actual
function updateButtonStates() {
    moveBackButton.disabled = currentMoveIndex <= 0;
    moveForwardButton.disabled = currentMoveIndex >= navMoveHistory.length - 1;
    moveFastForwardButton.disabled = currentMoveIndex >= navMoveHistory.length - 2;
}

// Actualiza el tablero visualmente con un estado específico
function updateBoard(boardState) {
    const cells = Array.from(chessboard.querySelectorAll('.cell'));
    cells.forEach((cell, index) => {
        const piece = boardState[index];
        if (piece) {
            cell.dataset.piece = piece;
            cell.textContent = getPieceSymbol(piece); // Actualiza el contenido
        } else {
            cell.removeAttribute('data-piece');
            cell.textContent = '';
        }
    });
}

// Listeners para los botones
moveBackButton.addEventListener('click', moveBack);
moveForwardButton.addEventListener('click', moveForward);
moveFastForwardButton.addEventListener('click', moveFastForward);































    


// Funciones para Stockfish
function initStockfish() {
    console.log('Iniciando Stockfish...');
    Stockfish().then((sf) => {
        stockfishWorker = new Worker('stockfish/stockfish.js');
        console.log('Stockfish inicializado correctamente');
        
        stockfish.addMessageListener(handleStockfishMessage);
        
        console.log('Enviando comando UCI...');
        stockfishWorker.postMessage('uci');
    }).catch((error) => {
        console.error('Error al inicializar Stockfish:', error);
        updateEngineStatus('Error al iniciar el motor de ajedrez');
    });
}

function handleStockfishMessage(message) {
    console.log('Mensaje de Stockfish:', message);
    if (message.includes('uciok')) {
        isEngineReady = true;
        updateEngineStatus('Motor de ajedrez listo');
        configureStockfish();
    } else if (message.includes('bestmove')) {
        const move = message.split(' ')[1];
        makeStockfishMove(move);
    }
}

function handleStockfishError(error) {
    console.error('Error en el motor de ajedrez:', error);
    updateEngineStatus('Error al iniciar el motor de ajedrez');
    
    if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
        initializationAttempts++;
        updateEngineStatus(`Reintentando inicialización (intento ${initializationAttempts})...`);
        setTimeout(initStockfish, RETRY_DELAY);
    } else {
        updateEngineStatus('No se pudo iniciar el motor de ajedrez. Por favor, recarga la página.');
    }
}

function updateEngineStatus(status) {
    const statusElement = document.getElementById('engine-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
    console.log('Estado del motor:', status);
}

function enableAIControls() {
    const aiControls = document.querySelectorAll('.ai-control');
    aiControls.forEach(control => control.disabled = false);
}

function disableAIControls() {
    const aiControls = document.querySelectorAll('.ai-control');
    aiControls.forEach(control => control.disabled = true);
}

function configureStockfish() {
    if (!isEngineReady) return;
    const elo = Math.min(aiElo, 2000);
    stockfishWorker.postMessage(`setoption name Skill Level value ${Math.floor(elo / 100)}`);
    stockfishWorker.postMessage('setoption name UCI_LimitStrength value true');
    stockfishWorker.postMessage(`setoption name UCI_Elo value ${elo}`);
}

function makeStockfishMove(move) {
    const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0);
    const fromRow = 8 - parseInt(move[1]);
    const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(move[3]);
    movePiece(fromRow, fromCol, toRow, toCol);
}

function boardToFen() {
    let fen = '';
    for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece === '0') {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                fen += piece;
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        if (row < 7) {
            fen += '/';
        }
    }
    fen += isWhiteTurn ? ' w ' : ' b ';
    fen += getCastlingRights() + ' - 0 1';
    return fen;
}

function getCastlingRights() {
    let rights = '';
    if (!kingMoved.white) {
        if (!rooksMoved.white.right) rights += 'K';
        if (!rooksMoved.white.left) rights += 'Q';
    }
    if (!kingMoved.black) {
        if (!rooksMoved.black.right) rights += 'k';
        if (!rooksMoved.black.left) rights += 'q';
    }
    return rights || '-';
}

// Funciones para el juego contra IA
function startAiGame(playerColor) {
    resetGame();
    playerColor = playerColor;
    
    if (playerColor === 'white') {
        players.bottom = playerName;
        players.top = aiName;
    } else {
        players.top = playerName;
        players.bottom = aiName;
    }

    updatePlayerDisplay();

    // Cerrar el modal
    const aiModeModal = document.getElementById('ai-mode-modal');
    if (aiModeModal) {
        aiModeModal.style.display = 'none';
    }

    if (playerColor === 'black' && isEngineReady) {
        setTimeout(makeAiMove, 500);
    } else if (!isEngineReady) {
        updateEngineStatus('Esperando que el motor de ajedrez esté listo...');
    }
}

function makeAiMove() {
    if (!isEngineReady) {
        console.error('El motor de ajedrez no está listo');
        updateEngineStatus('Esperando que el motor de ajedrez esté listo...');
        setTimeout(makeAiMove, 1000);
        return;
    }
    
    updateEngineStatus('IA pensando...');
    const fen = boardToFen();
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage('go movetime 1000');
}

function highlightSelectedColor(button) {
    const buttons = [playWhiteButton, playBlackButton, playRandomButton];
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function updatePlayerDisplay() {
    playerTopElement.textContent = players.top;
    playerBottomElement.textContent = players.bottom;
}

function initAIElements() {
    const playVsAiButton = document.getElementById('play-vs-ai');
    const aiModeModal = document.getElementById('ai-mode-modal');
    const playWhiteButton = document.getElementById('play-white');
    const playBlackButton = document.getElementById('play-black');
    const playRandomButton = document.getElementById('play-random');
    const playerNameInput = document.getElementById('player-name');
    const startGameButton = document.getElementById('start-game');

    if (playVsAiButton && aiModeModal) {
        playVsAiButton.addEventListener('click', () => {
            aiModeModal.style.display = 'block';
        });
    }

    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            playerName = playerNameInput.value.trim() || 'Jugador';
            if (isEngineReady) {
                startAiGame(playerColor);
            } else {
                console.error('El motor de Stockfish no está listo. Por favor, espera e intenta de nuevo.');
                // Opcionalmente, puedes mostrar un mensaje de error al usuario aquí
            }
        });
    }

    if (playWhiteButton) {
        playWhiteButton.addEventListener('click', () => {
            playerColor = 'white';
            highlightSelectedColor(playWhiteButton);
            startAiGame('white');
        });
    }

    if (playBlackButton) {
        playBlackButton.addEventListener('click', () => {
            playerColor = 'black';
            highlightSelectedColor(playBlackButton);
            startAiGame('black');
        });
    }

    if (playRandomButton) {
        playRandomButton.addEventListener('click', () => {
            playerColor = Math.random() < 0.5 ? 'white' : 'black';
            highlightSelectedColor(playRandomButton);
            startAiGame(playerColor);
        });
    }
}




/*
    // Clase ChessAI
    class ChessAI {
        constructor(elo) {
            this.elo = elo;
        }
        generateMove(board, isWhiteTurn) {
            const color = isWhiteTurn ? 'white' : 'black';
            const availableMoves = this.getAllAvailableMoves(board, color);
            if (availableMoves.length === 0) {
                return null; // No hay movimientos disponibles
            }
            // Profundidad de búsqueda basada en Elo
            const searchDepth = Math.floor(this.elo / 400);
            let bestMove = null;
            let bestScore = color === 'white' ? -Infinity : Infinity;
            for (const move of availableMoves) {
                const newBoard = this.makeTemporaryMove(board, move);
                const score = this.minimax(newBoard, searchDepth - 1, -Infinity, Infinity, color === 'black');
                if (color === 'white' && score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                } else if (color === 'black' && score < bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
            return bestMove;
        }
        minimax(board, depth, alpha, beta, isMaximizingPlayer) {
            if (depth === 0) {
                return this.evaluateBoard(board);
            }
            const availableMoves = this.getAllAvailableMoves(board, isMaximizingPlayer ? 'white' : 'black');
            if (isMaximizingPlayer) {
                let maxEval = -Infinity;
                for (const move of availableMoves) {
                    const newBoard = this.makeTemporaryMove(board, move);
                    const evaluation = this.minimax(newBoard, depth - 1, alpha, beta, false);
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) break;
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (const move of availableMoves) {
                    const newBoard = this.makeTemporaryMove(board, move);
                    const evaluation = this.minimax(newBoard, depth - 1, alpha, beta, true);
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) break;
                }
                return minEval;
            }
        }
        evaluateBoard(board) {
            const pieceValues = {
                'p': -1, 'n': -3, 'b': -3, 'r': -5, 'q': -9, 'k': -100,
                'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 100
            };
            let score = 0;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = board[row][col];
                    if (piece !== '0') {
                        score += pieceValues[piece];
                        // Bonificación por posición
                        if (piece.toLowerCase() === 'p') {
                            score += (piece === 'P' ? 7 - row : row - 0) * 0.1;
                        }
                        if (piece.toLowerCase() === 'n' || piece.toLowerCase() === 'b') {
                            score += (piece === piece.toUpperCase() ? 7 - row : row - 0) * 0.05;
                        }
                    }
                }
            }
            return score;
        }
        getAllAvailableMoves(board, color) {
            const moves = [];
            for (let fromRow = 0; fromRow < 8; fromRow++) {
                for (let fromCol = 0; fromCol < 8; fromCol++) {
                    const piece = board[fromRow][fromCol];
                    if (piece !== '0' && this.isPieceColor(piece, color)) {
                        for (let toRow = 0; toRow < 8; toRow++) {
                            for (let toCol = 0; toCol < 8; toCol++) {
                                if (isValidMove(fromRow, fromCol, toRow, toCol, board)) {
                                    moves.push({ fromRow, fromCol, toRow, toCol });
                                }
                            }
                        }
                    }
                }
            }
            return moves;
        }
        makeTemporaryMove(board, move) {
            const newBoard = board.map(row => [...row]);
            newBoard[move.toRow][move.toCol] = newBoard[move.fromRow][move.fromCol];
            newBoard[move.fromRow][move.fromCol] = '0';
            return newBoard;
        }
        isPieceColor(piece, color) {
            return color === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
        }
    }
    // Funciones para el juego contra IA
    function startAiGame(color) {
        playerColor = color;
        aiPlayer = new ChessAI(aiElo);
        resetGame();
        aiModeModal.style.display = 'none';
        isWhiteTurn = true; // Siempre comienza el juego con el turno de las blancas
        if (playerColor === 'black') {
            makeAiMove(); // Si el jugador elige negras, la IA (blancas) hace el primer movimiento
        }
    }
    function makeAiMove() {
        const aiMove = aiPlayer.generateMove(board, isWhiteTurn);
        if (aiMove) {
            movePiece(aiMove.fromRow, aiMove.fromCol, aiMove.toRow, aiMove.toCol);
        } else {
            // Si la IA no puede hacer un movimiento, verifica si es jaque mate o tablas
            if (isCheckmate(isWhiteTurn)) {
                showGameOverModal(isWhiteTurn ? 'Black' : 'White');
            } else if (isStalemate(isWhiteTurn)) {
                showGameOverModal('Draw');
            }
        }
    }
*/

    // Event listeners
    resetButton.addEventListener('click', resetGame);
    captureScreenshotButton.addEventListener('click', captureScreenshot);
    saveHistoryButton.addEventListener('click', saveHistory);
    themeToggle.addEventListener('click', togglePageTheme);
    boardThemeSelect.addEventListener('change', (e) => changeBoardTheme(e.target.value));
    newGameButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
    });
    document.getElementById('show-check-white').addEventListener('change', renderBoard);
    document.getElementById('show-check-black').addEventListener('change', renderBoard);

    // Nuevos event listeners para la funcionalidad de IA
    const playVsAiButton = document.getElementById('play-vs-ai');
    const aiModeModal = document.getElementById('ai-mode-modal');
    const playWhiteButton = document.getElementById('play-white');
    const playBlackButton = document.getElementById('play-black');
    const playRandomButton = document.getElementById('play-random');
    const aiEloSlider = document.getElementById('ai-elo');
    const aiEloValue = document.getElementById('ai-elo-value');

    playVsAiButton.addEventListener('click', () => {
        aiModeModal.style.display = 'block';
    });

    playWhiteButton.addEventListener('click', () => startAiGame('white'));
    playBlackButton.addEventListener('click', () => startAiGame('black'));
    playRandomButton.addEventListener('click', () => startAiGame(Math.random() < 0.5 ? 'white' : 'black'));

    aiEloSlider.addEventListener('input', () => {
        aiElo = parseInt(aiEloSlider.value);
        aiEloValue.textContent = aiElo;
        if (isEngineReady) {
            configureStockfish();
        }
    });

    // Inicializar el juego
    document.addEventListener('DOMContentLoaded', initGame);
    
    // Inicializar el juego
    initGame();
    initStockfish();
});

    