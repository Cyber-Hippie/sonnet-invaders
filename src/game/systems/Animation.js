import { ANIMATION_SPEED } from '../constants.js';

/**
 * Handles animation frames for the game
 */
export default class Animation {
    constructor() {
        this.frame = 0;
        this.counter = 0;
        this.lastFrameTime = 0;
    }

    /**
     * Update the animation counter
     * @returns {boolean} True if the animation frame changed
     */
    update() {
        // Increment counter
        this.counter++;
        
        // Check if it's time to change the frame
        if (this.counter >= ANIMATION_SPEED) {
            this.counter = 0;
            this.frame = 1 - this.frame; // Toggle between 0 and 1
            this.lastFrameTime = performance.now();
            return true;
        }
        
        return false;
    }

    /**
     * Force a frame change
     * @returns {number} The new frame
     */
    forceFrameChange() {
        this.counter = 0;
        this.frame = 1 - this.frame;
        this.lastFrameTime = performance.now();
        return this.frame;
    }

    /**
     * Get the current animation frame
     * @returns {number} Current animation frame (0 or 1)
     */
    getCurrentFrame() {
        return this.frame;
    }

    /**
     * Reset the animation
     */
    reset() {
        this.frame = 0;
        this.counter = 0;
        this.lastFrameTime = 0;
    }
} 