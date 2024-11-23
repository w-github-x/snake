export class SnakeGame {
  constructor(canvas, scoreElement, highScoreElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scoreElement = scoreElement;
    this.highScoreElement = highScoreElement;
    this.gridSize = 20;
    this.tileCount = canvas.width / this.gridSize;
    this.throughWallsMode = false;
    this.reset();
    
    // 从localStorage加载最高分
    this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    this.highScoreElement.textContent = this.highScore;
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = { x: 5, y: 5 };
    this.dx = 1;
    this.dy = 0;
    this.score = 0;
    this.speed = 7;
    this.isPaused = false;
    this.isGameOver = false;
    this.scoreElement.textContent = '0';
    this.placeFood();
  }

  setThroughWallsMode(enabled) {
    this.throughWallsMode = enabled;
  }

  start() {
    if (this.gameLoop) return;
    this.gameLoop = setInterval(() => this.update(), 1000/this.speed);
  }

  pause() {
    if (this.isPaused) {
      this.gameLoop = setInterval(() => this.update(), 1000/this.speed);
    } else {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
      this.drawPauseScreen();
    }
    this.isPaused = !this.isPaused;
  }

  stop() {
    clearInterval(this.gameLoop);
    this.gameLoop = null;
  }

  handleKeyPress(e) {
    if (e.key === ' ') {
      if (!this.isGameOver) this.pause();
      return;
    }

    if (this.isPaused) return;

    switch(e.key) {
      case 'ArrowUp':
        if (this.dy === 0) { this.dx = 0; this.dy = -1; }
        break;
      case 'ArrowDown':
        if (this.dy === 0) { this.dx = 0; this.dy = 1; }
        break;
      case 'ArrowLeft':
        if (this.dx === 0) { this.dx = -1; this.dy = 0; }
        break;
      case 'ArrowRight':
        if (this.dx === 0) { this.dx = 1; this.dy = 0; }
        break;
    }
  }

  update() {
    if (this.isPaused || this.isGameOver) return;

    this.moveSnake();
    
    if (this.checkCollision()) {
      this.handleGameOver();
      return;
    }

    this.clearCanvas();
    this.checkFoodCollision();
    this.drawFood();
    this.drawSnake();
  }

  moveSnake() {
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
    
    // 穿墙模式下的位置调整
    if (this.throughWallsMode) {
      if (head.x < 0) head.x = this.tileCount - 1;
      if (head.x >= this.tileCount) head.x = 0;
      if (head.y < 0) head.y = this.tileCount - 1;
      if (head.y >= this.tileCount) head.y = 0;
    }
    
    this.snake.unshift(head);
    if (!this.checkFoodCollision()) {
      this.snake.pop();
    }
  }

  checkCollision() {
    const head = this.snake[0];
    
    // 在非穿墙模式下检查墙壁碰撞
    if (!this.throughWallsMode) {
      if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
        return true;
      }
    }
    
    // 自身碰撞检测（两种模式都需要）
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }
    
    return false;
  }

  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  checkFoodCollision() {
    const head = this.snake[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreElement.textContent = this.score;
      this.placeFood();
      return true;
    }
    return false;
  }

  placeFood() {
    this.food.x = Math.floor(Math.random() * this.tileCount);
    this.food.y = Math.floor(Math.random() * this.tileCount);
    
    // 确保食物不会出现在蛇身上
    for (let segment of this.snake) {
      if (this.food.x === segment.x && this.food.y === segment.y) {
        this.placeFood();
        break;
      }
    }
  }

  drawFood() {
    this.ctx.fillStyle = '#ff4444';
    this.ctx.beginPath();
    this.ctx.arc(
      (this.food.x + 0.5) * this.gridSize,
      (this.food.y + 0.5) * this.gridSize,
      this.gridSize/2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        // 蛇头
        this.ctx.fillStyle = '#006400';
      } else {
        // 蛇身
        this.ctx.fillStyle = '#32CD32';
      }
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });
  }

  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('已暂停', this.canvas.width/2, this.canvas.height/2);
  }

  handleGameOver() {
    this.isGameOver = true;
    this.stop();
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreElement.textContent = this.highScore;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
    }

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束!', this.canvas.width/2, this.canvas.height/2 - 30);
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 10);
  }
}