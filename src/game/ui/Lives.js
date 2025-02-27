import { drawShape } from '../utils.js';

/**
 * Handles the lives display
 */
export default class Lives {
    /**
     * Draw the player lives
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} lives - Number of lives
     * @param {Array} playerShape - Player shape for life icons
     * @param {string} color - Color of life icons
     * @param {number} canvasWidth - Canvas width
     */
    draw(ctx, lives, playerShape, color, canvasWidth) {
        const shipWidth = 20;
        const shipPadding = 10;
        const startX = canvasWidth - 20 - (lives * (shipWidth + shipPadding));
        
        for (let i = 0; i < lives; i++) {
            const x = startX + i * (shipWidth + shipPadding);
            const scale = shipWidth / 9; // 9 is the width of our ASCII art
            
            drawShape(ctx, playerShape, x, 10, scale, color);
        }
    }
} 