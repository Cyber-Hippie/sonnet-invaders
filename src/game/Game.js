import { 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT, 
    ENEMY_ROWS, 
    ENEMY_COLS, 
    ENEMY_WIDTH, 
    ENEMY_HEIGHT, 
    ENEMY_PADDING,
    ENEMY_SPEED,
    ENEMY_DROP_DISTANCE,
    ENEMY_SHOOT_CHANCE,
    MAX_ENEMY_BULLETS,
    SOUND_VOLUMES
} from './constants.js';
import { Player, Enemy, Bullet } from './entities/index.js';
import { Renderer, Input, Animation, Collision, SoundGenerator } from './systems/index.js';
import { Score, Lives, GameState } from './ui/index.js';
import { enemyShapes } from '../assets/shapes/enemyShapes.js';

/**
 * Main game controller
 */
export default class Game {
    /**
     * Create a new game
     */
    constructor() {
        console.log('Game constructor started');
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        document.body.appendChild(this.canvas);
        
        // Initialize systems
        this.renderer = new Renderer(this.ctx);
        this.input = new Input();
        this.animation = new Animation();
        this.collision = new Collision();
        console.log('Creating SoundGenerator...');
        this.soundGenerator = new SoundGenerator();
        
        // Initialize UI
        this.score = new Score();
        this.lives = new Lives();
        this.gameState = new GameState();
        
        // Initialize game entities
        this.player = new Player(CANVAS_WIDTH / 2 - 25, CANVAS_HEIGHT - 30);
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = this.createEnemies();
        
        // Enemy movement
        this.enemyDirection = 1; // 1 for right, -1 for left
        
        // Sound buffers
        this.soundBuffers = {};
        this.backgroundMusic = null;
        this.invaderStepSound = null;
        this.muted = false;
        this.audioInitialized = false;
        this.audioStartMessageShown = false;
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        
        // Add event listeners
        console.log('Adding event listeners...');
        document.addEventListener('keydown', this.handleKeyPress);
        document.addEventListener('click', this.handleClick);
        document.addEventListener('touchstart', this.handleTouch);
        
        // Initialize audio and start the game
        console.log('Starting audio initialization...');
        this.initializeAudio().then(() => {
            console.log('Audio initialization completed');
            
            // Register callback for when audio is ready
            console.log('Registering audio ready callback...');
            this.soundGenerator.onReady(() => {
                console.log('Audio is ready, starting background music');
                this.startBackgroundMusic();
                this.audioInitialized = true;
                
                // Remove audio start message if it's shown
                this.removeAudioStartMessage();
            });
            
            // Show audio start message if needed
            console.log('Checking if audio is ready:', this.soundGenerator.isReady());
            if (!this.soundGenerator.isReady()) {
                console.log('Audio not ready, showing start message');
                this.showAudioStartMessage();
            } else {
                console.log('Audio already ready, no need for start message');
            }
            
            // Start the game loop regardless of audio state
            console.log('Starting game loop');
            this.gameLoop();
        }).catch(error => {
            console.error('Error during audio initialization:', error);
            // Start the game loop anyway
            this.gameLoop();
        });
        
        console.log('Game constructor completed');
    }
    
    /**
     * Show a message to the user to interact with the page to start audio
     */
    showAudioStartMessage() {
        if (this.audioStartMessageShown) {
            console.log('Audio start message already shown, skipping');
            return;
        }
        
        console.log('Showing audio start message');
        this.audioStartMessageShown = true;
        
        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.id = 'audio-start-message';
        messageContainer.style.position = 'absolute';
        messageContainer.style.top = '50%';
        messageContainer.style.left = '50%';
        messageContainer.style.transform = 'translate(-50%, -50%)';
        messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        messageContainer.style.color = 'white';
        messageContainer.style.padding = '20px';
        messageContainer.style.borderRadius = '10px';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.zIndex = '1000';
        messageContainer.style.fontFamily = 'Arial, sans-serif';
        messageContainer.style.cursor = 'pointer';
        messageContainer.style.border = '2px solid #4CAF50';
        messageContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        messageContainer.style.width = '80%';
        messageContainer.style.maxWidth = '400px';
        
        // Add message text
        messageContainer.innerHTML = `
            <h2 style="color: #4CAF50; margin-top: 0;">Click or Press Any Key to Start</h2>
            <p>Browser security requires user interaction before playing audio.</p>
            <button style="padding: 10px 20px; margin-top: 10px; background-color: #4CAF50; border: none; color: white; border-radius: 5px; cursor: pointer; font-size: 16px;">Start Game with Sound</button>
        `;
        
        // Add click handler to remove message and start audio
        messageContainer.addEventListener('click', () => {
            console.log('Audio start message clicked');
            this.startAudio();
            this.removeAudioStartMessage();
        });
        
        // Add to document
        document.body.appendChild(messageContainer);
        console.log('Audio start message added to document');
    }
    
    /**
     * Remove the audio start message
     */
    removeAudioStartMessage() {
        console.log('Attempting to remove audio start message');
        try {
            const messageContainer = document.getElementById('audio-start-message');
            if (messageContainer) {
                document.body.removeChild(messageContainer);
                console.log('Audio start message removed');
            } else {
                console.log('No audio start message found to remove');
            }
            this.audioStartMessageShown = false;
        } catch (error) {
            console.error('Error removing audio start message:', error);
        }
    }
    
    /**
     * Start audio after user interaction
     */
    startAudio() {
        console.log('startAudio called, initialized:', this.audioInitialized);
        if (!this.audioInitialized) {
            console.log('Starting audio after user interaction');
            // Resume audio context
            console.log('Attempting to resume audio context...');
            this.soundGenerator.resumeAudioContext().then(() => {
                console.log('AudioContext resumed successfully');
                console.log('Audio context state after resume:', this.soundGenerator.audioContext.state);
                
                if (!this.backgroundMusic) {
                    console.log('Starting background music');
                    this.startBackgroundMusic();
                } else {
                    console.log('Background music already playing');
                }
                
                this.audioInitialized = true;
                console.log('Audio initialization complete');
                
                // Force a test sound to verify audio is working
                console.log('Playing test sound to verify audio...');
                this.soundGenerator.playTestSound();
            }).catch(error => {
                console.error('Failed to resume audio context:', error);
                // Try again after a short delay
                setTimeout(() => {
                    console.log('Retrying audio initialization...');
                    this.startAudio();
                }, 1000);
            });
        } else {
            console.log('Audio already initialized');
        }
    }
    
    /**
     * Handle click events
     */
    handleClick() {
        console.log('Click event detected');
        this.startAudio();
    }
    
    /**
     * Handle touch events
     */
    handleTouch() {
        console.log('Touch event detected');
        this.startAudio();
    }
    
    /**
     * Initialize audio by generating all sound effects
     * @returns {Promise} Promise that resolves when all sounds are generated
     */
    async initializeAudio() {
        console.log('Initializing audio...');
        
        try {
            // Initialize the sound generator
            console.log('Initializing sound generator...');
            const initResult = this.soundGenerator.initialize();
            console.log('Sound generator initialized:', initResult);
            
            if (!initResult) {
                console.warn('Sound generator initialization failed, but continuing anyway');
            }
            
            // Generate all sound effects
            console.log('Generating sound effects...');
            this.soundBuffers = {
                shoot: this.soundGenerator.generateShootSound(),
                explosion: this.soundGenerator.generateExplosionSound(),
                enemyShoot: this.soundGenerator.generateEnemyShootSound(),
                playerHit: this.soundGenerator.generatePlayerHitSound(),
                gameOver: this.soundGenerator.generateGameOverSound(),
                gameWin: this.soundGenerator.generateGameWinSound(),
                background: this.soundGenerator.generateBackgroundMusic(),
                invaderStep: this.soundGenerator.generateInvaderStepSound()
            };
            console.log('Sound effects generated');
            
            return Promise.resolve();
        } catch (error) {
            console.error('Error during audio initialization:', error);
            return Promise.resolve(); // Resolve anyway to continue the game
        }
    }
    
    /**
     * Start background music
     */
    startBackgroundMusic() {
        console.log('Starting background music...');
        
        try {
            if (this.backgroundMusic) {
                console.log('Stopping existing background music');
                this.backgroundMusic.stop();
            }
            
            if (!this.soundBuffers.background) {
                console.warn('Background music buffer not found');
                return;
            }
            
            console.log('Playing background music buffer');
            this.backgroundMusic = this.soundGenerator.playSound(
                this.soundBuffers.background, 
                SOUND_VOLUMES.background, 
                true
            );
            
            console.log('Background music started:', this.backgroundMusic);
            
            // Check if music is actually playing
            if (this.backgroundMusic && this.backgroundMusic.source) {
                console.log('Background music source created successfully');
            } else {
                console.warn('Background music may not be playing correctly');
            }
        } catch (error) {
            console.error('Error starting background music:', error);
        }
    }
    
    /**
     * Handle key presses for game controls
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyPress(e) {
        console.log('Key pressed:', e.key);
        
        // Start audio on any key press
        this.startAudio();
        
        // Toggle mute with 'M' key
        if (e.key === 'm' || e.key === 'M') {
            console.log('Mute toggled');
            this.muted = !this.muted;
            this.soundGenerator.setMuted(this.muted);
            
            // Restart background music if unmuting
            if (!this.muted && (!this.backgroundMusic || !this.backgroundMusic.source || !this.backgroundMusic.source.loop)) {
                console.log('Restarting background music after unmute');
                this.startBackgroundMusic();
            }
        }
    }
    
    /**
     * Create the enemy grid
     * @returns {Array} Array of enemies
     */
    createEnemies() {
        const enemies = [];
        
        for (let row = 0; row < ENEMY_ROWS; row++) {
            const enemyType = enemyShapes[Math.min(Math.floor(row / 2), enemyShapes.length - 1)];
            for (let col = 0; col < ENEMY_COLS; col++) {
                enemies.push(new Enemy(
                    col * (ENEMY_WIDTH + ENEMY_PADDING) + ENEMY_PADDING,
                    row * (ENEMY_HEIGHT + ENEMY_PADDING) + ENEMY_PADDING + 30,
                    ENEMY_WIDTH,
                    ENEMY_HEIGHT,
                    enemyType,
                    enemyType.type
                ));
            }
        }
        
        return enemies;
    }
    
    /**
     * Handle player input
     */
    handleInput() {
        // Move player
        if (this.input.isPressed('right')) {
            this.player.move('right', CANVAS_WIDTH);
        }
        if (this.input.isPressed('left')) {
            this.player.move('left', CANVAS_WIDTH);
        }
        
        // Shoot
        if (this.input.isPressed('space') && this.bullets.length < 1) {
            this.bullets.push(this.player.shoot());
            
            // Only play sound if audio is initialized
            if (this.audioInitialized && !this.muted) {
                this.soundGenerator.playSound(
                    this.soundBuffers.shoot, 
                    SOUND_VOLUMES.shoot
                );
            }
        }
    }
    
    /**
     * Move enemies and update their animation
     */
    moveEnemies() {
        let dropEnemies = false;
        let leftmostEnemy = Infinity;
        let rightmostEnemy = -Infinity;
        
        // Update animation and play sound if frame changed
        const frameChanged = this.animation.update();
        
        // Play invader step sound if animation frame changed and audio is initialized
        if (frameChanged && this.audioInitialized && !this.muted && this.enemies.length > 0) {
            // Calculate volume based on number of enemies (more enemies = louder sound)
            const volumeScale = Math.min(1, this.enemies.length / (ENEMY_ROWS * ENEMY_COLS));
            const volume = SOUND_VOLUMES.invaderStep * (0.5 + 0.5 * volumeScale);
            
            // Calculate playback rate based on number of enemies (fewer enemies = faster sound)
            const speedScale = 1 + (1 - this.enemies.length / (ENEMY_ROWS * ENEMY_COLS)) * 0.5;
            
            // Force a new sound to play each time the frame changes
            if (this.invaderStepSound) {
                this.invaderStepSound.stop();
            }
            
            this.invaderStepSound = this.soundGenerator.playSound(
                this.soundBuffers.invaderStep,
                volume,
                false,
                speedScale
            );
        }
        
        // Move enemies horizontally
        for (const enemy of this.enemies) {
            enemy.move(ENEMY_SPEED * this.enemyDirection);
            leftmostEnemy = Math.min(leftmostEnemy, enemy.x);
            rightmostEnemy = Math.max(rightmostEnemy, enemy.x + enemy.width);
        }
        
        // Check if enemies hit the edge
        if (leftmostEnemy <= 0 || rightmostEnemy >= CANVAS_WIDTH) {
            dropEnemies = true;
        }
        
        // Drop enemies and change direction
        if (dropEnemies) {
            for (const enemy of this.enemies) {
                enemy.moveDown(ENEMY_DROP_DISTANCE);
            }
            this.enemyDirection *= -1;
        }
    }
    
    /**
     * Handle enemy shooting
     */
    enemyShoot() {
        if (this.enemyBullets.length < MAX_ENEMY_BULLETS) {
            // Create a map to track the bottom-most enemy in each column
            const bottomEnemies = {};
            
            // Find the bottom-most enemy in each column
            for (const enemy of this.enemies) {
                // Calculate the column position (center of the enemy)
                const column = Math.floor(enemy.x + enemy.width / 2);
                
                if (!bottomEnemies[column] || enemy.y > bottomEnemies[column].y) {
                    bottomEnemies[column] = enemy;
                }
            }
            
            // Only allow bottom-most enemies to shoot
            for (const column in bottomEnemies) {
                const enemy = bottomEnemies[column];
                if (Math.random() < ENEMY_SHOOT_CHANCE) {
                    this.enemyBullets.push(enemy.shoot());
                    
                    if (this.enemyBullets.length >= MAX_ENEMY_BULLETS) {
                        break;
                    }
                }
            }
        }
    }
    
    /**
     * Update game state
     */
    update() {
        // Move bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            
            // Remove bullets that are off screen
            if (this.bullets[i].isOffScreen(CANVAS_HEIGHT)) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Move enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].update();
            
            // Remove bullets that are off screen
            if (this.enemyBullets[i].isOffScreen(CANVAS_HEIGHT)) {
                this.enemyBullets.splice(i, 1);
            }
        }
        
        // Move enemies and make them shoot
        this.moveEnemies();
        this.enemyShoot();
        
        // Check collisions between player bullets and enemies
        const hits = this.collision.checkBulletEnemyCollisions(this.bullets, this.enemies);
        
        // Handle hits
        for (const hit of hits) {
            this.enemies.splice(hit.enemyIndex, 1);
            this.bullets.splice(hit.bulletIndex, 1);
            this.score.add(10);
            
            // Only play sound if audio is initialized
            if (this.audioInitialized && !this.muted) {
                this.soundGenerator.playSound(
                    this.soundBuffers.explosion, 
                    SOUND_VOLUMES.explosion
                );
            }
        }
        
        // Check collisions between enemy bullets and player
        const hitIndex = this.collision.checkBulletPlayerCollision(this.enemyBullets, this.player);
        
        if (hitIndex !== -1) {
            this.enemyBullets.splice(hitIndex, 1);
            const isDead = this.player.loseLife();
            
            // Only play sound if audio is initialized
            if (this.audioInitialized && !this.muted) {
                this.soundGenerator.playSound(
                    this.soundBuffers.playerHit, 
                    SOUND_VOLUMES.playerHit
                );
            }
            
            if (isDead) {
                this.gameState.setState('gameOver');
                this.stopAllSounds();
                
                // Only play sound if audio is initialized
                if (this.audioInitialized && !this.muted) {
                    this.soundGenerator.playSound(
                        this.soundBuffers.gameOver, 
                        SOUND_VOLUMES.gameOver
                    );
                }
            } else {
                // Reset player position
                this.player.reset(CANVAS_WIDTH);
            }
        }
        
        // Check if enemies have reached the player
        if (this.collision.checkEnemyReachedPlayer(this.enemies, this.player.y)) {
            this.gameState.setState('gameOver');
            this.stopAllSounds();
            
            // Only play sound if audio is initialized
            if (this.audioInitialized && !this.muted) {
                this.soundGenerator.playSound(
                    this.soundBuffers.gameOver, 
                    SOUND_VOLUMES.gameOver
                );
            }
        }
        
        // Check for win condition
        if (this.enemies.length === 0) {
            this.gameState.setState('win');
            this.stopAllSounds();
            
            // Only play sound if audio is initialized
            if (this.audioInitialized && !this.muted) {
                this.soundGenerator.playSound(
                    this.soundBuffers.gameWin, 
                    SOUND_VOLUMES.gameWin
                );
            }
        }
    }
    
    /**
     * Stop all game sounds
     */
    stopAllSounds() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
        
        if (this.invaderStepSound) {
            this.invaderStepSound.stop();
            this.invaderStepSound = null;
        }
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear the canvas
        this.renderer.clear(CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw bullets
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        
        // Draw enemy bullets
        for (const bullet of this.enemyBullets) {
            bullet.draw(this.ctx);
        }
        
        // Get current animation frame
        const currentFrame = this.animation.getCurrentFrame();
        
        // Draw enemies with the same animation frame
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, currentFrame);
        }
        
        // Draw score
        this.score.draw(this.renderer);
        
        // Draw lives
        this.lives.draw(this.ctx, this.player.lives, this.player.shape, this.player.color, CANVAS_WIDTH);
        
        // Draw game state message if game is over
        this.gameState.draw(this.renderer, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw mute indicator if muted
        if (this.muted) {
            this.renderer.drawText('🔇 MUTED (Press M to unmute)', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20, 'white', '14px Arial', 'center');
        } else {
            this.renderer.drawText('🔊 Press M to mute', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20, 'white', '14px Arial', 'center');
        }
        
        // Draw audio status if not initialized
        if (!this.audioInitialized && !this.audioStartMessageShown) {
            this.renderer.drawText('Click or press any key to enable sound', CANVAS_WIDTH / 2, 30, 'white', '16px Arial', 'center');
        }
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        // Handle input
        this.handleInput();
        
        // Update game state
        this.update();
        
        // Render everything
        this.render();
        
        // Continue the loop if game is not over
        if (!this.gameState.isGameOver()) {
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    /**
     * Clean up resources when game is destroyed
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('touchstart', this.handleTouch);
        this.input.destroy();
        
        // Stop all sounds
        this.stopAllSounds();
        
        // Remove audio start message if it exists
        this.removeAudioStartMessage();
    }
}