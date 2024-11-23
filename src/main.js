import { SnakeGame } from './game.js';

const canvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const modeToggle = document.getElementById('modeToggle');
const modeText = document.getElementById('modeText');

const game = new SnakeGame(canvas, scoreElement, highScoreElement);

document.addEventListener('keydown', (e) => game.handleKeyPress(e));

startBtn.addEventListener('click', () => {
  game.start();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  restartBtn.disabled = false;
});

pauseBtn.addEventListener('click', () => {
  game.pause();
  pauseBtn.textContent = game.isPaused ? '继续' : '暂停';
});

restartBtn.addEventListener('click', () => {
  game.stop();
  game.reset();
  game.start();
  pauseBtn.textContent = '暂停';
  pauseBtn.disabled = false;
});

modeToggle.addEventListener('change', (e) => {
  const enabled = e.target.checked;
  game.setThroughWallsMode(enabled);
  modeText.textContent = enabled ? '开启' : '关闭';
});