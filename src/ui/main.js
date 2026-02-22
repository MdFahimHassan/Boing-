
const canvas = document.getElementById("game") || (() => {
  const c = document.createElement("canvas");
  c.id = "game";
  document.body.appendChild(c);
  return c;
})();
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const input = {
  keys: new Set(),
  init() {
    window.addEventListener("keydown", (e) => {
      this.keys.add(e.code);
    });
    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
    });
  },
  isDown(code) {
    return this.keys.has(code);
  }
};

input.init();

const Game = {
  lastTime: 0,
  deltaTime: 0,
  start() {
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

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("Platformer Skeleton Running", 20, 40);
  }
};

Game.start();