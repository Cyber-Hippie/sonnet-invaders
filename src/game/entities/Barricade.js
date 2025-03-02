import { COLORS } from '../constants.js';

/**
 * Represents a defensive barricade
 */
export default class Barricade {
    /**
     * Create a new barricade
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Barricade width
     * @param {number} height - Barricade height
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = COLORS.BARRICADE;
        
        // Create barricade blocks (for partial destruction)
        this.blocks = [];
        const blockSize = 5; // Size of each destructible block
        
        for (let row = 0; row < Math.floor(height / blockSize); row++) {
            for (let col = 0; col < Math.floor(width / blockSize); col++) {
                // Skip some blocks to create the classic Space Invaders barricade shape
                // (a block with a U-shaped cutout on the bottom)
                if (row < height / blockSize * 0.4 || 
                    col < width / blockSize * 0.2 || 
                    col >= width / blockSize * 0.8 || 
                    (row >= height / blockSize * 0.7 && 
                     col >= width / blockSize * 0.4 && 
                     col < width / blockSize * 0.6)) {
                    this.blocks.push({
                        x: x + col * blockSize,
                        y: y + row * blockSize,
                        width: blockSize,
                        height: blockSize,
                        health: 3 // Number of hits before block is destroyed
                    });
                }
            }
        }
    }

    /**
     * Check if a bullet has hit the barricade
     * @param {Bullet} bullet - The bullet to check
     * @returns {boolean} Whether the bullet hit the barricade
     */
    checkBulletCollision(bullet) {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            
            // Check collision with this block
            if (bullet.x < block.x + block.width &&
                bullet.x + bullet.width > block.x &&
                bullet.y < block.y + block.height &&
                bullet.y + bullet.height > block.y) {
                
                // Reduce block health
                block.health--;
                
                // Remove block if health is depleted
                if (block.health <= 0) {
                    this.blocks.splice(i, 1);
                }
                
                return true;
            }
        }
        
        return false;
    }

    /**
     * Damage the barricade when invaders reach its vertical position
     * @param {Array} enemies - Array of enemy objects
     * @returns {boolean} Whether any damage was done to the barricade
     */
    checkInvaderOverlap(enemies) {
        let damaged = false;
        
        // Check if any enemy is at or below the top of the barricade
        const enemiesOverlapping = enemies.some(enemy => 
            enemy.y + enemy.height >= this.y - 10 // Add a small buffer zone
        );
        
        if (enemiesOverlapping) {
            // Remove some blocks from the top of the barricade
            // Sort blocks by y position (top to bottom)
            const sortedBlocks = [...this.blocks].sort((a, b) => a.y - b.y);
            
            // Remove up to 20% of the top blocks
            const blocksToRemove = Math.ceil(this.blocks.length * 0.2);
            const topBlocks = sortedBlocks.slice(0, blocksToRemove);
            
            // Remove these blocks from the barricade
            for (const topBlock of topBlocks) {
                const index = this.blocks.findIndex(block => 
                    block.x === topBlock.x && block.y === topBlock.y
                );
                
                if (index !== -1) {
                    this.blocks.splice(index, 1);
                    damaged = true;
                }
            }
        }
        
        return damaged;
    }

    /**
     * Draw the barricade
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        
        // Draw each block
        for (const block of this.blocks) {
            // Adjust color based on health
            const alpha = 0.5 + (block.health / 3) * 0.5;
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    }
    
    /**
     * Check if the barricade is completely destroyed
     * @returns {boolean} Whether the barricade is destroyed
     */
    isDestroyed() {
        return this.blocks.length === 0;
    }
} 