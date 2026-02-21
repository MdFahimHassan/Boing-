document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const hud = document.getElementById("hud");

  startBtn.addEventListener("click", () => {
    console.log("Game Started!");
    startScreen.classList.add("hidden");
    hud.classList.remove("hidden");
    // Later: trigger game loop here
  });
});

// Example function to update HUD
function updateHUD(score, lives, level) {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `Lives: ${lives}`;
  document.getElementById("level").textContent = `Level: ${level}`;
}