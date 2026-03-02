const canvas = document.getElementById("gameCanvas");
if (!canvas) {
  console.error("Canvas element not found! Make sure #gameCanvas exists in HTML.");
}
const ctx = canvas?.getContext("2d");

// Simple input handler
const input = {
  keys: {},
  isDown(key) {
    return this.keys[key] || false;
  }
};

document.addEventListener("keydown", (e) => {
  input.keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  input.keys[e.key] = false;
});

const Game = {
  lastTime: 0,
  deltaTime: 0,
  level: null, // store level data here

  start() {
    // Canvas is now visible when game starts
    canvas.style.display = "block";
    
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  },

  loop(timestamp) {
    this.deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(this.deltaTime);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  },

  update(dt) {
    if (input.isDown("ArrowRight")) {
      console.log("Moving Right");
    }
  },

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.level) {
      const { tiles, tileSize, width, height } = this.level;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const tile = tiles[y][x];
          if (tile === 1) {
            ctx.fillStyle = "brown"; // ground
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
          if (tile === 2) {
            ctx.fillStyle = "blue"; // obstacle
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
          if (tile === 4) {
            ctx.fillStyle = "yellow"; // collectible
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        }
      }
    }

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("Platformer Skeleton Running", 20, 40);
  }
};

window.Game = Game; // expose Game globally
