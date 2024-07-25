// Claude 3.5 Sonnet Prompt:
// create html that loads the js program. name the js file invaders.js

// Get the canvas element
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Game objects
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 30,
    dx: 5
};

const bullets = [];
const enemyBullets = [];
const enemies = [];
const enemyRows = 5;
const enemyCols = 10;
const enemyWidth = 40;
const enemyHeight = 30;
const enemyPadding = 10;

// Enemy movement
let enemyDirection = 1; // 1 for right, -1 for left
const enemySpeed = 1;
const enemyDropDistance = 30;

// Enemy shooting
const enemyShootChance = 0.02; // 2% chance per enemy per frame
const maxEnemyBullets = 5; // Maximum number of enemy bullets on screen

// Create enemies
for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
        enemies.push({
            x: col * (enemyWidth + enemyPadding) + enemyPadding,
            y: row * (enemyHeight + enemyPadding) + enemyPadding + 30,
            width: enemyWidth,
            height: enemyHeight
        });
    }
}

// Game controls
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === ' ') spacePressed = true;
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === ' ') spacePressed = false;
}

// Move enemies
function moveEnemies() {
    let dropEnemies = false;
    
    for (let enemy of enemies) {
        enemy.x += enemySpeed * enemyDirection;
        
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            dropEnemies = true;
        }
    }
    
    if (dropEnemies) {
        for (let enemy of enemies) {
            enemy.y += enemyDropDistance;
        }
        enemyDirection *= -1;
    }
}

// Enemy shooting
function enemyShoot() {
    if (enemyBullets.length < maxEnemyBullets) {
        for (let enemy of enemies) {
            if (Math.random() < enemyShootChance) {
                enemyBullets.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height,
                    width: 3,
                    height: 10,
                    dy: 3
                });
                if (enemyBullets.length >= maxEnemyBullets) {
                    break;
                }
            }
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move player
    if (rightPressed && player.x < canvas.width - player.width) player.x += player.dx;
    if (leftPressed && player.x > 0) player.x -= player.dx;
    
    // Shoot player bullets
    if (spacePressed && bullets.length < 1) {
        bullets.push({x: player.x + player.width / 2, y: player.y, width: 3, height: 10, dy: -5});
    }
    
    // Move and draw player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y += bullets[i].dy;
        ctx.fillStyle = 'white';
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        
        // Remove bullets that are off screen
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
    
    // Move enemies and make them shoot
    moveEnemies();
    enemyShoot();
    
    // Move and draw enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].dy;
        ctx.fillStyle = 'red';
        ctx.fillRect(enemyBullets[i].x, enemyBullets[i].y, enemyBullets[i].width, enemyBullets[i].height);
        
        // Remove bullets that are off screen
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        } else if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            // Player hit by enemy bullet
            gameOver();
            return;
        }
    }
    
    // Draw and check collision for enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
        
        // Check collision with player bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }
        
        // Check if enemies have reached the player
        if (enemies[i].y + enemies[i].height >= player.y) {
            gameOver();
            return;
        }
    }
    
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Check for game over
    if (enemies.length === 0) {
        gameWin();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
}

function gameWin() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('You Win!', canvas.width / 2 - 50, canvas.height / 2);
}

// Start the game
gameLoop();