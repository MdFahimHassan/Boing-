function startGameSession() {
  console.log("Game Started!");
  const startScreen = document.getElementById("start-screen");
  const hud = document.getElementById("hud");
  const canvas = document.getElementById("gameCanvas");

  // Trigger transitions
  startScreen.classList.add("fade-out");
  hud.classList.add("fade-in");

  // Show canvas
  canvas.style.display = "block";

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
  const settingsBtn = document.getElementById("settings-btn");

  if (!startBtn) {
    console.error("Start button not found!");
    return;
  }

  // Start button
  startBtn.addEventListener("click", startGameSession);

  // Enter key also starts game
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !document.getElementById("start-screen").classList.contains("hidden")) {
      startGameSession();
    }
  });

  // Settings button placeholder
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      alert("Settings menu coming soon!");
    });
  }

  // Pause menu toggle with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const pauseMenu = document.getElementById("pause-menu");
      if (pauseMenu) {
        pauseMenu.classList.toggle("hidden");
      }
    }
  });

  // Resume button
  const resumeBtn = document.getElementById("resume-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      document.getElementById("pause-menu").classList.add("hidden");
    });
  }

  // Quit button
  const quitBtn = document.getElementById("quit-btn");
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      alert("Quit to main menu coming soon!");
    });
  }
});

// Example function to update HUD
function updateHUD(score, lives, level) {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `Lives: ${lives}`;
  document.getElementById("level").textContent = `Level: ${level}`;
}