import { COLORS } from '../constants.js';

/**
 * Handles rendering to the canvas
 */
export default class Renderer {
    /**
     * Create a new renderer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Clear the canvas
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    clear(width, height) {
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, width, height);
    }

    /**
     * Draw text on the canvas
     * @param {string} text - Text to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Text color
     * @param {string} font - Font style
     * @param {string} align - Text alignment
     */
    drawText(text, x, y, color = COLORS.TEXT, font = '20px Arial', align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draw a rectangle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {string} color - Rectangle color
     */
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
} 