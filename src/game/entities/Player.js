import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, COLORS, BULLET_WIDTH, BULLET_HEIGHT, PLAYER_BULLET_SPEED } from '../constants.js';
import { playerShape } from '../../assets/shapes/playerShapes.js';
import { drawShape } from '../utils.js';
import Bullet from './Bullet.js';

/**
 * Represents the player's ship
 */
export default class Player {
    /**
     * Create a new player
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.dx = PLAYER_SPEED;
        this.shape = playerShape;
        this.color = COLORS.PLAYER;
        this.lives = 3;
    }

    /**
     * Move the player
     * @param {string} direction - Direction to move ('left' or 'right')
     * @param {number} canvasWidth - Canvas width for boundary checking
     */
    move(direction, canvasWidth) {
        if (direction === 'right' && this.x < canvasWidth - this.width) {
            this.x += this.dx;
        }
        if (direction === 'left' && this.x > 0) {
            this.x -= this.dx;
        }
    }

    /**
     * Create a new bullet
     * @returns {Bullet} The created bullet
     */
    shoot() {
        return new Bullet(
            this.x + this.width / 2 - BULLET_WIDTH / 2,
            this.y,
            BULLET_WIDTH,
            BULLET_HEIGHT,
            PLAYER_BULLET_SPEED,
            COLORS.BULLET
        );
    }

    /**
     * Draw the player
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const scale = this.width / 9; // 9 is the width of our ASCII art
        drawShape(ctx, this.shape, this.x, this.y, scale, this.color);
    }

    /**
     * Reset player position
     * @param {number} canvasWidth - Canvas width
     */
    reset(canvasWidth) {
        this.x = canvasWidth / 2 - this.width / 2;
    }

    /**
     * Reduce player lives
     * @returns {boolean} True if player is dead
     */
    loseLife() {
        this.lives--;
        return this.lives <= 0;
    }
} 