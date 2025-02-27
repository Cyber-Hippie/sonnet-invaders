import { COLORS, BULLET_WIDTH, BULLET_HEIGHT, ENEMY_BULLET_SPEED } from '../constants.js';
import { drawShape } from '../utils.js';
import Bullet from './Bullet.js';

/**
 * Represents an enemy ship
 */
export default class Enemy {
    /**
     * Create a new enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Enemy width
     * @param {number} height - Enemy height
     * @param {object} type - Enemy type with shape and altShape
     * @param {string} enemyType - Type of enemy (top, middle, bottom)
     */
    constructor(x, y, width, height, type, enemyType) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shape = type.shape;
        this.altShape = type.altShape;
        this.currentFrame = 0;
        
        // Set color based on enemy type
        switch (enemyType) {
            case 'top':
                this.color = COLORS.ENEMY_TOP;
                break;
            case 'middle':
                this.color = COLORS.ENEMY_MIDDLE;
                break;
            case 'bottom':
                this.color = COLORS.ENEMY_BOTTOM;
                break;
            default:
                this.color = COLORS.ENEMY_BOTTOM;
        }
    }

    /**
     * Move the enemy horizontally
     * @param {number} dx - Distance to move
     */
    move(dx) {
        this.x += dx;
    }

    /**
     * Move the enemy down
     * @param {number} distance - Distance to move down
     */
    moveDown(distance) {
        this.y += distance;
    }

    /**
     * Create a bullet
     * @returns {Bullet} The created bullet
     */
    shoot() {
        return new Bullet(
            this.x + this.width / 2 - BULLET_WIDTH / 2,
            this.y + this.height,
            BULLET_WIDTH,
            BULLET_HEIGHT,
            ENEMY_BULLET_SPEED,
            COLORS.ENEMY_BULLET
        );
    }

    /**
     * Draw the enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} animationFrame - Current animation frame (0 or 1)
     */
    draw(ctx, animationFrame) {
        const scale = this.width / 8; // 8 is the width of our ASCII art
        const currentShape = animationFrame === 0 ? this.shape : this.altShape;
        drawShape(ctx, currentShape, this.x, this.y, scale, this.color);
    }
} 