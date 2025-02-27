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
    MAX_ENEMY_BULLETS
} from './constants.js';
import { Player, Enemy, Bullet } from './entities/index.js';
import { Renderer, Input, Animation, Collision } from './systems/index.js';
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
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        
        // Start the game
        this.gameLoop();
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
        }
    }
    
    /**
     * Move enemies
     */
    moveEnemies() {
        let dropEnemies = false;
        let leftmostEnemy = Infinity;
        let rightmostEnemy = -Infinity;
        
        // Update animation
        this.animation.update();
        
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
        }
        
        // Check collisions between enemy bullets and player
        const hitIndex = this.collision.checkBulletPlayerCollision(this.enemyBullets, this.player);
        
        if (hitIndex !== -1) {
            this.enemyBullets.splice(hitIndex, 1);
            const isDead = this.player.loseLife();
            
            if (isDead) {
                this.gameState.setState('gameOver');
            } else {
                // Reset player position
                this.player.reset(CANVAS_WIDTH);
            }
        }
        
        // Check if enemies have reached the player
        if (this.collision.checkEnemyReachedPlayer(this.enemies, this.player.y)) {
            this.gameState.setState('gameOver');
        }
        
        // Check for win condition
        if (this.enemies.length === 0) {
            this.gameState.setState('win');
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
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, this.animation.getCurrentFrame());
        }
        
        // Draw score
        this.score.draw(this.renderer);
        
        // Draw lives
        this.lives.draw(this.ctx, this.player.lives, this.player.shape, this.player.color, CANVAS_WIDTH);
        
        // Draw game state message if game is over
        this.gameState.draw(this.renderer, CANVAS_WIDTH, CANVAS_HEIGHT);
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
}