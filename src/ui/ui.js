// ---------------------------
// UI Logic for Boing!
// ---------------------------

function startGameSession() {
  console.log("Transition to difficulty screen...");
  const startScreen = document.getElementById("start-screen");
  const difficultyScreen = document.getElementById("difficulty-screen");
  const transitionVideo = document.getElementById("transition-video");

  // Play transition video immediately
  transitionVideo.style.display = "block";
  transitionVideo.currentTime = 0;
  transitionVideo.play();

  // After 1 second, swap to difficulty screen
  setTimeout(() => {
    startScreen.style.display = "none";
    difficultyScreen.style.display = "block";
  }, 1000);

  // Hide transition overlay when finished
  transitionVideo.onended = () => {
    transitionVideo.style.display = "none";
  };
}

// ---------------------------
// Difficulty Selection
// ---------------------------
function startEasyMode() {
  const difficultyScreen = document.getElementById("difficulty-screen");
  const hud = document.getElementById("hud");
  const canvas = document.getElementById("gameCanvas");
  const transitionVideo = document.getElementById("transition-video");

  // Play transition again
  transitionVideo.style.display = "block";
  transitionVideo.currentTime = 0;
  transitionVideo.play();

  // After 1 second, swap to game canvas + HUD
  setTimeout(() => {
    difficultyScreen.style.display = "none";
    hud.style.display = "flex";
    canvas.style.display = "block";

    // Load level + start game loop
    Game.loadLevel("../levels/level01.json")
      .then(levelData => {
        console.log("Level loaded successfully:", levelData);
        Game.level = levelData;
        Game.originalTiles = JSON.parse(JSON.stringify(levelData.tiles));
        Game.start();
      })
      .catch(err => {
        console.error("Unexpected error loading level:", err);
        alert("Unable to initialize game. See console for details.");
      });
  }, 1000);

  transitionVideo.onended = () => {
    transitionVideo.style.display = "none";
  };
}

// ---------------------------
// DOM Ready
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const easyBtn = document.getElementById("easy-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const hardBtn = document.getElementById("hard-btn");

  if (!startBtn) {
    console.error("Start button not found!");
    return;
  }

  // Start button → goes to difficulty screen
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

  // Difficulty buttons
  if (easyBtn) {
    easyBtn.addEventListener("click", startEasyMode);
  }
  if (mediumBtn) {
    mediumBtn.addEventListener("click", () => {
      alert("Medium difficulty coming soon!");
    });
  }
  if (hardBtn) {
    hardBtn.addEventListener("click", () => {
      alert("Hard difficulty coming soon!");
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

// ---------------------------
// HUD Update Function
// ---------------------------
function updateHUD(score, lives, level) {
  document.getElementById("lives").innerHTML = `<span class="icon">❤️</span> Lives: ${lives}`;
  document.getElementById("score").innerHTML = `<span class="icon">⭐</span> Score: ${score}`;
  document.getElementById("level").innerHTML = `<span class="icon">🏆</span> Level: ${level}`;
}