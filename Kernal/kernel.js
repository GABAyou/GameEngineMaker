/* ENGINE KERNEL v1.1 - SAFE LOAD VERSION */

// 1. Declare variables but don't "fill" them yet
let myGameCanvas, ctx;

// --- INPUT SYSTEM ---
const input = { isPressed: false, x: 0, y: 0 };

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

// --- INITIALIZATION (This waits for the HTML to exist) ---
function initKernel() {
  myGameCanvas = document.getElementById('gameCanvas');
  
  if (!myGameCanvas) {
    console.error("Kernel Error: Canvas not found. Retrying...");
    setTimeout(initKernel, 100); // Try again if the HTML isn't ready
    return;
  }

  ctx = myGameCanvas.getContext('2d');
  
  // Set initial screen size
  myGameCanvas.width = window.innerWidth;
  myGameCanvas.height = window.innerHeight;

  // Set up Touch Listeners
  myGameCanvas.addEventListener('touchstart', (e) => {
    input.isPressed = true;
    input.x = e.touches[0].clientX;
    input.y = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });

  myGameCanvas.addEventListener('touchend', (e) => {
    input.isPressed = false;
    e.preventDefault();
  }, { passive: false });

  console.log("Kernel Initialized Successfully");
  requestAnimationFrame(kernelLoop);
}

// --- THE HEARTBEAT (LOOP) ---
let lastTime = 0;
function kernelLoop(timeStamp) {
  let dt = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;
  if (dt > 0.1) dt = 0.1;

  if (ctx) {
    ctx.clearRect(0, 0, myGameCanvas.width, myGameCanvas.height);

    if (!Sprite.isLoaded) {
      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.fillText("LOADING...", 20, 40);
    } else {
      // These will be filled by your CodePen game logic
      if (State.current === 'MENU' && typeof window.drawMenu === 'function') window.drawMenu();
      if (State.current === 'PLAYING' && typeof window.drawGame === 'function') window.drawGame(dt);
    }
  }
  requestAnimationFrame(kernelLoop);
}

// Start the setup process
window.addEventListener('load', initKernel);
