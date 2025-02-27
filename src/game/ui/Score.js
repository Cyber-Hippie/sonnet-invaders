import { formatScore } from '../utils.js';

/**
 * Handles the score display
 */
export default class Score {
    constructor() {
        this.score = 0;
    }

    /**
     * Increase the score
     * @param {number} points - Points to add
     */
    add(points) {
        this.score += points;
    }

    /**
     * Get the current score
     * @returns {number} Current score
     */
    getScore() {
        return this.score;
    }

    /**
     * Get the formatted score string
     * @param {number} length - Number of digits to pad to
     * @returns {string} Formatted score
     */
    getFormattedScore(length = 5) {
        return formatScore(this.score, length);
    }

    /**
     * Reset the score
     */
    reset() {
        this.score = 0;
    }

    /**
     * Draw the score
     * @param {Renderer} renderer - Renderer instance
     */
    draw(renderer) {
        renderer.drawText(`Score: ${this.getFormattedScore()}`, 20, 30);
    }
} 