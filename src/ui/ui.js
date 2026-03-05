function startGameSession() {
  console.log("Game Started!");
  const startScreen = document.getElementById("start-screen");
  const hud = document.getElementById("hud");
  const canvas = document.getElementById("gameCanvas");
  const transitionVideo = document.getElementById("transition-video");

  // Show transition video immediately
  transitionVideo.style.display = "block";
  transitionVideo.currentTime = 0;
  transitionVideo.play();

  // Wait 1 second, then swap screens AND load the level
  setTimeout(() => {
    startScreen.style.display = "none";   // hide start screen
    hud.style.display = "flex";           // show HUD
    canvas.style.display = "block";       // show canvas

    // Load level + start game loop
    Game.loadLevel("../levels/level01.json")
      .then(levelData => {
        console.log("Level loaded successfully:", levelData);
        Game.level = levelData;
        Game.originalTiles = JSON.parse(JSON.stringify(levelData.tiles));
        Game.start(); // start loop now, while transition is still playing
      })
      .catch(err => {
        console.error("Unexpected error loading level:", err);
        alert("Unable to initialize game. See console for details.");
      });
  }, 1000); // 1 second delay

  // When video ends, remove overlay
  transitionVideo.onended = () => {
    transitionVideo.style.display = "none";
  };
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

  // Pause on window minimize
  document.addEventListener("visibilitychange", () => {
    Game.paused = document.hidden;
  });
});

// Example function to update HUD
function updateHUD(score, lives, level) {
  document.getElementById("lives").innerHTML = `<span class="icon">❤️</span> Lives: ${lives}`;
  document.getElementById("score").innerHTML = `<span class="icon">⭐</span> Score: ${score}`;
  document.getElementById("level").innerHTML = `<span class="icon">🏆</span> Level: ${level}`;
}