/* ENGINE KERNEL v1.0 
  This is the permanent heart of the engine.
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- INPUT SYSTEM ---
const input = { isPressed: false, x: 0, y: 0 };
canvas.addEventListener('touchstart', (e) => {
  input.isPressed = true;
  input.x = e.touches[0].clientX;
  input.y = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', (e) => {
  input.isPressed = false;
  e.preventDefault();
}, { passive: false });

// --- SCREEN SYSTEM ---
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- SPRITE LOADER ---
const Sprite = {
  assets: {},
  loadingCount: 0,
  isLoaded: false,
  load: function(name, url) {
    this.loadingCount++;
    this.isLoaded = false;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.assets[name] = img;
      this.loadingCount--;
      if (this.loadingCount === 0) this.isLoaded = true;
    };
  }
};

// --- STATE SYSTEM ---
const State = {
  current: 'MENU',
  set: function(newState) { this.current = newState; }
};

// --- THE HEARTBEAT (LOOP) ---
let lastTime = 0;
function kernel(timeStamp) {
  let dt = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;
  if (dt > 0.1) dt = 0.1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!Sprite.isLoaded) {
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("LOADING...", 20, 40);
  } else {
    // These functions must exist in your game.js
    if (State.current === 'MENU') drawMenu();
    if (State.current === 'PLAYING') drawGame(dt);
  }
  requestAnimationFrame(kernel);
}
requestAnimationFrame(kernel);
