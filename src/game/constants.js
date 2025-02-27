// Game dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Player settings
export const PLAYER_SPEED = 5;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 30;

// Enemy settings
export const ENEMY_ROWS = 5;
export const ENEMY_COLS = 10;
export const ENEMY_WIDTH = 40;
export const ENEMY_HEIGHT = 30;
export const ENEMY_PADDING = 10;
export const ENEMY_SPEED = 1;
export const ENEMY_DROP_DISTANCE = 30;
export const ENEMY_SHOOT_CHANCE = 0.02;
export const MAX_ENEMY_BULLETS = 5;

// Bullet settings
export const PLAYER_BULLET_SPEED = -5;
export const ENEMY_BULLET_SPEED = 3;
export const BULLET_WIDTH = 3;
export const BULLET_HEIGHT = 10;

// Barricade settings
export const BARRICADE_COUNT = 4;
export const BARRICADE_WIDTH = 60;
export const BARRICADE_HEIGHT = 40;
export const BARRICADE_Y = CANVAS_HEIGHT - 120;

// Animation settings
export const ANIMATION_SPEED = 40;

// Sound settings
export const SOUND_VOLUMES = {
    shoot: 0.3,
    explosion: 0.4,
    enemyShoot: 0.2,
    playerHit: 0.5,
    gameOver: 0.6,
    gameWin: 0.6,
    background: 0.2,
    invaderStep: 0.2
};

// Colors
export const COLORS = {
  PLAYER: '#5599FF',
  ENEMY_TOP: '#FF5555',
  ENEMY_MIDDLE: '#55FF55',
  ENEMY_BOTTOM: '#55AAFF',
  BULLET: 'white',
  ENEMY_BULLET: 'red',
  TEXT: 'white',
  BACKGROUND: 'black',
  BARRICADE: '#00FF00'
}; 