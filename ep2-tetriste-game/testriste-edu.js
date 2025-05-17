// Constants for game configuration
const COLORS = ['red', 'green', 'blue'];
const MAX_ANSWER_BAR_LENGTH = 15;  // Increased to accommodate longer words
const MAX_TRASH_BAR_LENGTH = 10;
const REMOVE_LETTER_COST = 50;     // Points needed to remove a letter from answer bar

// Question bank with Morocco-related questions
const QUESTIONS = [
    { question: "Capital of Morocco?", answer: "rabat" },
    { question: "Largest city in Morocco?", answer: "casablanca" },
    { question: "Famous blue city of Morocco?", answer: "chefchaouen" },
    { question: "Desert in southern Morocco?", answer: "sahara" },
    { question: "Highest mountain in Morocco?", answer: "toubkal" },
    { question: "Traditional Moroccan dress?", answer: "caftan" },
    { question: "Famous Moroccan tea?", answer: "mint" },
    { question: "Traditional Moroccan bread?", answer: "khobz" },
    { question: "Famous Moroccan leather city?", answer: "fez" },
    { question: "Morocco's national language?", answer: "arabic" },
    { question: "Famous Moroccan soup?", answer: "harira" },
    { question: "Traditional Moroccan house?", answer: "riad" },
    { question: "Famous Marrakech square?", answer: "jemaa" },
    { question: "Morocco's currency?", answer: "dirham" },
    { question: "Famous Moroccan couscous day?", answer: "friday" }
];

// GamePiece class to represent each letter piece
class GamePiece {
    constructor(letter, color) {
        if (!COLORS.includes(color)) {
            throw new Error('Invalid color');
        }
        this.letter = letter.toLowerCase();
        this.color = color;
    }
}

// Main game class
class TestristeEduGame {
    constructor() {
        this.answerBar = [];
        this.trashBar = [];
        this.score = 0;
        this.isGameOver = false;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.nextPiece = null;
        this.activeBar = 'answer'; // 'answer' or 'trash'
    }

    // Set new current question
    setNewQuestion() {
        const questionIndex = Math.floor(Math.random() * QUESTIONS.length);
        this.currentQuestion = QUESTIONS[questionIndex].question;
        this.currentAnswer = QUESTIONS[questionIndex].answer.toLowerCase();
    }

    // Generate a random piece with a letter
    generateRandomPiece() {
        // Include letters from the answer with higher probability
        const useAnswerLetter = Math.random() < 0.6 && this.currentAnswer;
        let letter;
        
        if (useAnswerLetter) {
            const pos = Math.floor(Math.random() * this.currentAnswer.length);
            letter = this.currentAnswer[pos];
        } else {
            // Generate a random letter
            letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        return new GamePiece(letter, randomColor);
    }

    // Insert piece into answer bar
    insertAnswerBar(piece, isLeft) {
        if (this.isGameOver) return false;
        if (this.answerBar.length >= MAX_ANSWER_BAR_LENGTH) {
            this.isGameOver = true;
            return false;
        }

        if (isLeft) {
            this.answerBar.unshift(piece);
        } else {
            this.answerBar.push(piece);
        }

        this.checkAnswer();
        return true;
    }

    // Insert piece into trash bar
    insertTrashBar(piece, isLeft) {
        if (this.isGameOver) return false;
        if (this.trashBar.length >= MAX_TRASH_BAR_LENGTH) {
            this.isGameOver = true;
            return false;
        }

        if (isLeft) {
            this.trashBar.unshift(piece);
        } else {
            this.trashBar.push(piece);
        }

        this.checkAndRemoveColorMatches();
        return true;
    }

    // Remove letter from answer bar (costs points)
    removeFromAnswerBar(isLeft) {
        if (this.score < REMOVE_LETTER_COST || this.answerBar.length === 0) {
            return false;
        }

        if (isLeft) {
            this.answerBar.shift();
        } else {
            this.answerBar.pop();
        }

        this.score -= REMOVE_LETTER_COST;
        return true;
    }

    // Check for color matches in trash bar
    checkAndRemoveColorMatches() {
        let matches = [];
        
        // Check for color matches (3 or more)
        for (let i = 0; i < this.trashBar.length - 2; i++) {
            let colorMatches = [i];
            for (let j = i + 1; j < this.trashBar.length; j++) {
                if (this.trashBar[j].color === this.trashBar[i].color) {
                    colorMatches.push(j);
                } else {
                    break;
                }
            }
            if (colorMatches.length >= 3) {
                matches.push(colorMatches);
            }
        }

        // Remove matches and update score
        if (matches.length > 0) {
            let indicesToRemove = [...new Set(matches.flat())].sort((a, b) => b - a);
            
            for (let index of indicesToRemove) {
                this.trashBar.splice(index, 1);
            }
            
            this.score += indicesToRemove.length * 10;
        }
    }

    // Check if current answer is correct
    checkAnswer() {
        const currentWord = this.answerBar.map(piece => piece.letter).join('');
        if (currentWord === this.currentAnswer) {
            this.score += 100; // Bonus for correct answer
            this.answerBar = []; // Clear answer bar
            this.setNewQuestion(); // Get new question
            return true;
        }
        return false;
    }

    // Get current game state
    getGameState() {
        return {
            answerBar: this.answerBar,
            trashBar: this.trashBar,
            score: this.score,
            isGameOver: this.isGameOver,
            currentQuestion: this.currentQuestion,
            nextPiece: this.nextPiece
        };
    }
}

// Create global game instance
let game = new TestristeEduGame();

// UI Integration Functions
function updateUI() {
    const gameState = game.getGameState();
    updateAnswerBar(gameState.answerBar);
    updateTrashBar(gameState.trashBar);
    updateScore(gameState.score);
    updateQuestion(gameState.currentQuestion);
    if (gameState.isGameOver) {
        showGameOver();
    }
}

function generateNextPiece() {
    game.nextPiece = game.generateRandomPiece();
    updateNextPiecePreview();
}

function updateNextPiecePreview() {
    const nextPieceElement = document.getElementById('next-piece');
    if (nextPieceElement && game.nextPiece) {
        nextPieceElement.className = `next-piece ${game.nextPiece.color}`;
        nextPieceElement.textContent = game.nextPiece.letter;
    }
}

// Insert functions for both bars
function insertAnswerLeft() {
    if (game.nextPiece) {
        game.insertAnswerBar(game.nextPiece, true);
        generateNextPiece();
        updateUI();
    }
}

function insertAnswerRight() {
    if (game.nextPiece) {
        game.insertAnswerBar(game.nextPiece, false);
        generateNextPiece();
        updateUI();
    }
}

function insertTrashLeft() {
    if (game.nextPiece) {
        game.insertTrashBar(game.nextPiece, true);
        generateNextPiece();
        updateUI();
    }
}

function insertTrashRight() {
    if (game.nextPiece) {
        game.insertTrashBar(game.nextPiece, false);
        generateNextPiece();
        updateUI();
    }
}

// Remove letter from answer bar
function removeAnswerLeft() {
    if (game.removeFromAnswerBar(true)) {
        updateUI();
    }
}

function removeAnswerRight() {
    if (game.removeFromAnswerBar(false)) {
        updateUI();
    }
}

function newGame() {
    game = new TestristeEduGame();
    game.setNewQuestion();
    generateNextPiece();
    hideGameOver();
    updateUI();
    updateActiveBarIndicator();
}

// UI Update Functions
function updateAnswerBar(bar) {
    const answerBarElement = document.getElementById('answer-bar');
    if (!answerBarElement) return;
    
    answerBarElement.innerHTML = '';
    bar.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `game-piece ${piece.color}`;
        pieceElement.textContent = piece.letter;
        answerBarElement.appendChild(pieceElement);
    });
}

function updateTrashBar(bar) {
    const trashBarElement = document.getElementById('trash-bar');
    if (!trashBarElement) return;
    
    trashBarElement.innerHTML = '';
    bar.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `game-piece ${piece.color}`;
        pieceElement.textContent = piece.letter;
        trashBarElement.appendChild(pieceElement);
    });
}

function updateScore(score) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function updateQuestion(question) {
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = question;
    }
}

function showGameOver() {
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'block';
    }
}

function hideGameOver() {
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'none';
    }
}

// Add keyboard controls
function handleKeyPress(event) {
    if (game.isGameOver) return;

    // Prevent default behavior for game control keys
    if (['Space', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(event.code)) {
        event.preventDefault();
    }

    switch (event.code) {
        case 'Space':
            // Toggle between answer and trash bars without generating new piece
            game.activeBar = game.activeBar === 'answer' ? 'trash' : 'answer';
            updateActiveBarIndicator();
            break;
        case 'ArrowLeft':
            if (game.activeBar === 'answer') {
                insertAnswerLeft();
            } else {
                insertTrashLeft();
            }
            break;
        case 'ArrowRight':
            if (game.activeBar === 'answer') {
                insertAnswerRight();
            } else {
                insertTrashRight();
            }
            break;
        case 'Backspace':
            if (game.activeBar === 'answer') {
                removeAnswerLeft();
            }
            break;
        case 'Delete':
            if (game.activeBar === 'answer') {
                removeAnswerRight();
            }
            break;
    }
}

function updateActiveBarIndicator() {
    const answerSection = document.querySelector('.answer-section');
    const trashSection = document.querySelector('.trash-section');
    
    if (game.activeBar === 'answer') {
        answerSection.classList.add('active-bar');
        trashSection.classList.remove('active-bar');
    } else {
        answerSection.classList.remove('active-bar');
        trashSection.classList.add('active-bar');
    }
}

// Add keyboard event listener when window loads
window.onload = function() {
    newGame();
    document.addEventListener('keydown', handleKeyPress);
    
    // Add tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}; 