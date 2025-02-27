import { checkCollision } from '../utils.js';

/**
 * Handles collision detection between game entities
 */
export default class Collision {
    /**
     * Check collisions between player bullets and enemies
     * @param {Array} bullets - Array of player bullets
     * @param {Array} enemies - Array of enemies
     * @returns {Object} Object containing hit information
     */
    checkBulletEnemyCollisions(bullets, enemies) {
        const hits = [];
        
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (checkCollision(bullets[i], enemies[j])) {
                    hits.push({
                        bulletIndex: i,
                        enemyIndex: j
                    });
                    break; // One bullet can only hit one enemy
                }
            }
        }
        
        return hits;
    }

    /**
     * Check collisions between enemy bullets and player
     * @param {Array} enemyBullets - Array of enemy bullets
     * @param {Object} player - Player object
     * @returns {number} Index of the bullet that hit the player, or -1 if no hit
     */
    checkBulletPlayerCollision(enemyBullets, player) {
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (checkCollision(enemyBullets[i], player)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Check if any enemy has reached the player's level
     * @param {Array} enemies - Array of enemies
     * @param {number} playerY - Player's Y position
     * @returns {boolean} True if any enemy has reached the player
     */
    checkEnemyReachedPlayer(enemies, playerY) {
        for (const enemy of enemies) {
            if (enemy.y + enemy.height >= playerY) {
                return true;
            }
        }
        return false;
    }
} 