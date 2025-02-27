/**
 * Checks if two objects are colliding using simple rectangle collision detection
 */
export function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

/**
 * Draws a shape based on ASCII art representation
 */
export function drawShape(ctx, shape, x, y, scale, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = color;
    shape.forEach((row, i) => {
        for (let j = 0; j < row.length; j++) {
            if (row[j] === '#') {
                ctx.fillRect(j, i, 1, 1);
            }
        }
    });
    ctx.restore();
}

/**
 * Formats a score with leading zeros
 */
export function formatScore(score, length = 5) {
    return score.toString().padStart(length, '0');
} 