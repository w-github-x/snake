const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let snake = [
  { x: 10, y: 10 },
];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let speed = 7;
let gameLoop;

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
  switch(e.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
}

function drawGame() {
  moveSnake();
  
  if (isGameOver()) {
    clearInterval(gameLoop);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('游戏结束!', canvas.width/4, canvas.height/2);
    return;
  }

  clearCanvas();
  checkFoodCollision();
  drawFood();
  drawSnake();
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  if (!checkFoodCollision()) {
    snake.pop();
  }
}

function isGameOver() {
  const head = snake[0];
  
  // 撞墙检测
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return true;
  }
  
  // 自身碰撞检测
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  
  return false;
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkFoodCollision() {
  const head = snake[0];
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    placeFood();
    return true;
  }
  return false;
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
  
  // 确保食物不会出现在蛇身上
  for (let segment of snake) {
    if (food.x === segment.x && food.y === segment.y) {
      placeFood();
      break;
    }
  }
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawSnake() {
  ctx.fillStyle = 'green';
  snake.forEach((segment, index) => {
    if (index === 0) {
      // 蛇头用深色
      ctx.fillStyle = '#006400';
    } else {
      // 蛇身用浅色
      ctx.fillStyle = '#32CD32';
    }
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

// 初始化游戏
function startGame() {
  dx = 1; // 开始时向右移动
  dy = 0;
  gameLoop = setInterval(drawGame, 1000/speed);
}

startGame();