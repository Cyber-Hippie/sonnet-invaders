/**
 * Handles keyboard input for the game
 */
export default class Input {
    constructor() {
        this.keys = {
            right: false,
            left: false,
            space: false
        };

        // Bind event handlers
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} e - Keyboard event
     */
    keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.keys.right = true;
        }
        if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.keys.left = true;
        }
        if (e.key === ' ') {
            this.keys.space = true;
        }
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} e - Keyboard event
     */
    keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            this.keys.right = false;
        }
        if (e.key === 'Left' || e.key === 'ArrowLeft') {
            this.keys.left = false;
        }
        if (e.key === ' ') {
            this.keys.space = false;
        }
    }

    /**
     * Check if a key is pressed
     * @param {string} key - Key to check
     * @returns {boolean} True if key is pressed
     */
    isPressed(key) {
        return this.keys[key];
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
    }
} 