/**
 * Handles game state messages (win/lose)
 */
export default class GameState {
    constructor() {
        this.state = 'playing'; // playing, gameOver, win
    }

    /**
     * Set the game state
     * @param {string} state - New game state
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Get the current game state
     * @returns {string} Current game state
     */
    getState() {
        return this.state;
    }

    /**
     * Check if the game is over
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.state === 'gameOver' || this.state === 'win';
    }

    /**
     * Draw the game state message
     * @param {Renderer} renderer - Renderer instance
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    draw(renderer, canvasWidth, canvasHeight) {
        if (this.state === 'gameOver') {
            renderer.drawText('Game Over!', canvasWidth / 2, canvasHeight / 2, 'white', '30px Arial', 'center');
        } else if (this.state === 'win') {
            renderer.drawText('You Win!', canvasWidth / 2, canvasHeight / 2, 'white', '30px Arial', 'center');
        }
    }
} 