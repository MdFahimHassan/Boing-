function startGameSession() {
  console.log("Game Started!");
  const startScreen = document.getElementById("start-screen");
  const hud = document.getElementById("hud");
  
  startScreen.classList.add("hidden");
  hud.classList.remove("hidden");

  // Load level + start game loop
  fetch("../levels/level01.json")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(levelData => {
      console.log("Level loaded successfully:", levelData);
      Game.level = levelData;   // store level data
      Game.start();             // start the loop
    })
    .catch(err => {
      console.error("Error loading level:", err);
      alert("Failed to load level: " + err.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  
  if (!startBtn) {
    console.error("Start button not found!");
    return;
  }

  startBtn.addEventListener("click", startGameSession);

  // Also allow pressing Enter to start
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !document.getElementById("start-screen").classList.contains("hidden")) {
      startGameSession();
    }
  });
});

// Example function to update HUD
function updateHUD(score, lives, level) {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `Lives: ${lives}`;
  document.getElementById("level").textContent = `Level: ${level}`;
}
