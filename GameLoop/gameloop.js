// This "gate" waits for your GitHub Kernel to load first
window.onload = () => {

  // --- 1. ASSET LIST ---
  const imageList = [
    { 
      name: 'player', 
      url: 'https://cdn.jsdelivr.net/gh/GABAyou/GameEngineMaker@main/Assets/Images/grok-image-e0b7ea36-8807-462d-a68a-d55a1fda30d91772157926.webp?raw=true' 
    },
    { 
      name: 'background', 
      url: 'https://placehold.jp/400x400.png' 
    }
  ];

  // This part was crashing because it couldn't find "Sprite" yet
  imageList.forEach(item => Sprite.load(item.name, item.url));

  // --- 2. PLAYER VARIABLES ---
  let playerX = 50;
  let playerY = 50;

  // --- 3. MENU SCREEN ---
  window.drawMenu = function() {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "20px monospace";
    ctx.fillText("ENGINE CONNECTED", canvas.width / 2, canvas.height / 3);
    ctx.fillText("TAP TO START", canvas.width / 2, canvas.height / 2);

    if (input.isPressed) {
      State.set('PLAYING');
    }
  };

  // --- 4. GAMEPLAY SCREEN ---
  window.drawGame = function(dt) {
    ctx.drawImage(Sprite.assets['background'], 0, 0, canvas.width, canvas.height);

    if (input.isPressed) {
      playerX += (input.x - 25 - playerX) * 0.1;
      playerY += (input.y - 25 - playerY) * 0.1;
    }

    ctx.drawImage(Sprite.assets['player'], playerX, playerY, 50, 50);
  };

}; // This bracket closes the "gate"
