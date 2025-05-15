// Constants for game configuration
const SHAPES = ['circle', 'square', 'triangle'];
const COLORS = ['red', 'green', 'blue'];
const MAX_BAR_LENGTH = 10;

// Change these variables at the top of the file
let nextPiece = null; // Only one next piece instead of two

// GamePiece class to represent each game object
class GamePiece {
    constructor(shape, color) {
        if (!SHAPES.includes(shape) || !COLORS.includes(color)) {
            throw new Error('Invalid shape or color');
        }
        this.shape = shape;
        this.color = color;
    }
}

// Main game class
class TestristeGame {
    constructor() {
        this.gameBar = [];
        this.score = 0;
        this.isGameOver = false;
    }

    // Generate a random piece for testing
    generateRandomPiece() {
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        return new GamePiece(randomShape, randomColor);
    }

    // Insert piece at the left of the bar
    insertLeft(piece) {
        if (this.isGameOver) return false;
        if (this.gameBar.length >= MAX_BAR_LENGTH) {
            this.isGameOver = true;
            return false;
        }
        
        this.gameBar.unshift(piece);
        this.checkAndRemoveMatches();
        return true;
    }

    // Insert piece at the right of the bar
    insertRight(piece) {
        if (this.isGameOver) return false;
        if (this.gameBar.length >= MAX_BAR_LENGTH) {
            this.isGameOver = true;
            return false;
        }

        this.gameBar.push(piece);
        this.checkAndRemoveMatches();
        return true;
    }

    // Check for matches and remove them
    checkAndRemoveMatches() {
        let matches = [];
        
        // Check for color matches
        for (let i = 0; i < this.gameBar.length - 2; i++) {
            let colorMatches = [i];
            for (let j = i + 1; j < this.gameBar.length; j++) {
                if (this.gameBar[j].color === this.gameBar[i].color) {
                    colorMatches.push(j);
                } else {
                    break;
                }
            }
            if (colorMatches.length >= 3) {
                matches.push(colorMatches);
            }
        }

        // Check for shape matches
        for (let i = 0; i < this.gameBar.length - 2; i++) {
            let shapeMatches = [i];
            for (let j = i + 1; j < this.gameBar.length; j++) {
                if (this.gameBar[j].shape === this.gameBar[i].shape) {
                    shapeMatches.push(j);
                } else {
                    break;
                }
            }
            if (shapeMatches.length >= 3) {
                matches.push(shapeMatches);
            }
        }

        // Remove matches and update score
        if (matches.length > 0) {
            // Flatten and make unique
            let indicesToRemove = [...new Set(matches.flat())].sort((a, b) => b - a);
            
            // Remove matched pieces
            for (let index of indicesToRemove) {
                this.gameBar.splice(index, 1);
            }
            
            // Update score (10 points per piece removed)
            this.score += indicesToRemove.length * 10;
        }
    }

    // Get current game state
    getGameState() {
        return {
            bar: this.gameBar,
            score: this.score,
            isGameOver: this.isGameOver
        };
    }
}

// Create global game instance
let game = new TestristeGame();

// UI Integration Functions
function updateUI() {
    const gameState = game.getGameState();
    // These functions should be implemented in HTML/CSS
    updateGameBar(gameState.bar);
    updateScore(gameState.score);
    if (gameState.isGameOver) {
        showGameOver();
    }
}

// Modify the generateNextPieces function to generate only one piece
function generateNextPiece() {
    nextPiece = game.generateRandomPiece();
    updateNextPiecePreview();
}

// Update the preview function to show only one piece
function updateNextPiecePreview() {
    const nextPieceElement = document.getElementById('next-piece');
    if (nextPieceElement) {
        nextPieceElement.className = `next-piece ${nextPiece.shape} ${nextPiece.color}`;
    }
}

// Modify both insert functions to use the same next piece
function insertLeft() {
    if (nextPiece) {
        game.insertLeft(nextPiece);
        nextPiece = game.generateRandomPiece();
        updateNextPiecePreview();
        updateUI();
    }
}

function insertRight() {
    if (nextPiece) {
        game.insertRight(nextPiece);
        nextPiece = game.generateRandomPiece();
        updateNextPiecePreview();
        updateUI();
    }
}

// Update the newGame function
function newGame() {
    game = new TestristeGame();
    generateNextPiece();
    hideGameOver();
    updateUI();
}

// UI Update Functions (to be implemented based on your HTML structure)
function updateGameBar(bar) {
    const gameBarElement = document.getElementById('game-bar');
    if (!gameBarElement) return;
    
    gameBarElement.innerHTML = '';
    bar.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `game-piece ${piece.shape} ${piece.color}`;
        gameBarElement.appendChild(pieceElement);
    });
}

function updateScore(score) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function showGameOver() {
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'block';
    }
}

// Add this function to hide game over message
function hideGameOver() {
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'none';
    }
}

// Modify the window.onload function
window.onload = function() {
    newGame();
};
