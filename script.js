const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 1. INPUT SYSTEM (Moved to top) ---
const input = {
  isPressed: false,
  x: 0,
  y: 0
};

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

// --- STATE SYSTEM ---
const State = {
  current: 'MENU', // Starting state
  
  // Method to change states
  set: function(newState) {
    console.log("Switching to: " + newState);
    this.current = newState;
  }
};

// --- TIMER SYSTEM ---
let lastTime = 0; // Stores the timestamp of the previous frame
let dt = 0;       // The "Delta Time" (time difference)

// --- 2. SCREEN SYSTEM ---
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- 3. SPRITE LOADER ---
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

Sprite.load('player', 'https://placehold.jp/50x50.png'); 
Sprite.load('background', 'https://placehold.jp/400x400.png');

// --- 4. THE KERNEL ---
function kernel(timeStamp) {
  // 1. CALCULATE DELTA TIME
  // timeStamp is automatically provided by requestAnimationFrame
  dt = (timeStamp - lastTime) / 1000; // Convert milliseconds to seconds
  lastTime = timeStamp;

  // Prevent "Jumps" (if user switches tabs, dt becomes huge)
  if (dt > 0.1) dt = 0.1; 

  // 2. Clear Screen
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. Asset & State Check
  if (!Sprite.isLoaded) {
    ctx.fillStyle = "white";
    ctx.fillText("LOADING...", 20, 40);
    requestAnimationFrame(kernel);
    return;
  }

  // 4. Switchboard
  switch (State.current) {
    case 'MENU':
      drawMenu();
      break;
    case 'PLAYING':
      drawGame(dt); // Pass dt into your game logic
      break;
  }

  requestAnimationFrame(kernel);
}

// Start Engine
requestAnimationFrame(kernel);

// --- PLAYER POSITION VARIABLE ---
let playerX = 50; 

// --- THE MENU FUNCTION ---
function drawMenu() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MY ANDROID GAME", canvas.width / 2, canvas.height / 3);
  
  ctx.fillStyle = "lime";
  ctx.font = "20px Arial";
  ctx.fillText("TAP SCREEN TO START", canvas.width / 2, canvas.height / 2);

  // If user touches the screen, switch to PLAYING state
  if (input.isPressed) {
    State.set('PLAYING');
  }
}

// --- THE GAMEPLAY FUNCTION ---
function drawGame(dt) {
  // Move player 100 pixels per second to the right
  playerX += 100 * dt;
  
  // If player goes off the right side, put them back on the left
  if (playerX > canvas.width) {
    playerX = -50;
  }

  // Draw the background image
  ctx.drawImage(Sprite.assets['background'], 0, 0, canvas.width, canvas.height);
  
  // Draw the player at its new moving position
  ctx.drawImage(Sprite.assets['player'], playerX, 100, 50, 50);

  // Show status text
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.font = "20px monospace";
  ctx.fillText("GAME ACTIVE", 20, 40);
}