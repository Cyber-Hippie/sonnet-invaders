// Import the Game class
import Game from './game/Game.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Game starting...');
    new Game();
}); 