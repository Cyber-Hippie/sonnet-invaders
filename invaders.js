// Claude 3.5 Sonnet Prompt:
// I have a space invaders game in HTML and JavaScript.
// {HTML Code}
// {JS Code}
// Add a score output that shows "Score: 00000" in the upper right corner

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

// Score
let score = 0;

// Enemy types and their designs
const enemyTypes = [
    {
        shape: [
            "  ▄██▄  ",
            "▄██████▄",
            "██▄██▄██",
            "  ▀▀▀▀  "
        ],
        color: '#FF0000'  // Red for top row
    },
    {
        shape: [
            " ▄████▄ ",
            "███████",
            "▀ ███ ▀",
            " ▀ ▀ ▀ "
        ],
        color: '#00FF00'  // Green for middle rows
    },
    {
        shape: [
            " ▄▀▀▀▄ ",
            "▄█▄▄▄█▄",
            "███████",
            "▀ ▀ ▀ ▀"
        ],
        color: '#0099FF'  // Blue for bottom rows
    }
];

// Modify the enemy creation loop to include enemy type
for (let row = 0; row < enemyRows; row++) {
    const enemyType = enemyTypes[Math.min(Math.floor(row / 2), enemyTypes.length - 1)];
    for (let col = 0; col < enemyCols; col++) {
        enemies.push({
            x: col * (enemyWidth + enemyPadding) + enemyPadding,
            y: row * (enemyHeight + enemyPadding) + enemyPadding + 30,
            width: enemyWidth,
            height: enemyHeight,
            type: enemyType,
            shape: enemyType.shape,
            color: enemyType.color
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
    let leftmostEnemy = Infinity;
    let rightmostEnemy = -Infinity;
    
    for (let enemy of enemies) {
        enemy.x += enemySpeed * enemyDirection;
        leftmostEnemy = Math.min(leftmostEnemy, enemy.x);
        rightmostEnemy = Math.max(rightmostEnemy, enemy.x + enemy.width);
    }
    
    if (leftmostEnemy <= 0 || rightmostEnemy >= canvas.width) {
        dropEnemies = true;
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

// Check collisions
function checkCollisions() {
    // Check player bullets with enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 10; // Increase score when an enemy is destroyed
                break;
            }
        }
    }

    // Check enemy bullets with player
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            gameOver();
            return true;
        }
    }

    // Check if enemies have reached the player
    for (let enemy of enemies) {
        if (enemy.y + enemy.height >= player.y) {
            gameOver();
            return true;
        }
    }

    return false;
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score.toString().padStart(5, '0')}`, canvas.width - 10, 30);
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
        }
    }
    
    // Check collisions
    if (checkCollisions()) {
        return;  // Game over, stop the loop
    }
    
    // Draw enemies
    for (let enemy of enemies) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        const scale = enemy.width / 8; // 8 is the width of our ASCII art
        ctx.scale(scale, scale);
        
        ctx.fillStyle = enemy.color;
        enemy.shape.forEach((row, i) => {
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== ' ') {
                    ctx.fillRect(j, i, 1, 1);
                }
            }
        });
        ctx.restore();
    }
    
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw score
    drawScore();
    
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
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    drawScore(); // Show final score
}

function gameWin() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    drawScore(); // Show final score
}

// Start the game
gameLoop();