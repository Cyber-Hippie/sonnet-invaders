/**
 * Represents a bullet in the game
 */
export default class Bullet {
    /**
     * Create a new bullet
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Bullet width
     * @param {number} height - Bullet height
     * @param {number} dy - Vertical speed (negative for player bullets, positive for enemy bullets)
     * @param {string} color - Bullet color
     */
    constructor(x, y, width, height, dy, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dy = dy;
        this.color = color;
    }

    /**
     * Update bullet position
     */
    update() {
        this.y += this.dy;
    }

    /**
     * Draw the bullet
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Check if bullet is off screen
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean} True if bullet is off screen
     */
    isOffScreen(canvasHeight) {
        return this.y < 0 || this.y > canvasHeight;
    }
} 