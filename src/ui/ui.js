// ---------------------------
// UI Logic for Boing!
// ---------------------------

// ---------------------------
// Audio Manager
// ---------------------------
let musicEnabled = false;

const AudioManager = {
  bgMusic: null,

  playMusic(src, loop = true, volume = 0.5) {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
    this.bgMusic = new Audio(src);
    this.bgMusic.loop = loop;
    this.bgMusic.volume = volume;

    const playPromise = this.bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(`Audio failed to play (${src})`, err);
      });
    }
    return playPromise;
  },

  stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
  }
};

function setMusicEnabled(enabled) {
  const musicBtn = document.getElementById("music-btn");
  musicEnabled = enabled;
  localStorage.setItem("musicEnabled", enabled ? "true" : "false");

  if (enabled) {
    AudioManager.playMusic("assets/audios/DefaultBgMusic.mp3", true, 0.5);
    if (musicBtn) musicBtn.textContent = "🎵 Music On";
  } else {
    AudioManager.stopMusic();
    if (musicBtn) musicBtn.textContent = "🎵 Music Off";
  }
}


// ---------------------------
// Transition Video Helper
// ---------------------------
function playTransitionVideo(videoEl, onComplete, switchDelayMs = 0) {
  if (!videoEl) {
    onComplete?.();
    return;
  }

  videoEl.style.display = "block";
  videoEl.currentTime = 0;
  videoEl.muted = true; // ensure autoplay works across browsers

  const cleanup = () => {
    videoEl.style.display = "none";
    videoEl.onended = null;
  };

  let triggered = false;
  const triggerComplete = () => {
    if (triggered) return;
    triggered = true;
    onComplete?.();
  };

  const switchTimer = switchDelayMs >= 0 ? setTimeout(() => {
    triggerComplete();
  }, switchDelayMs) : null;

  if (switchDelayMs === 0) {
    triggerComplete();
  }

  const fallbackTimeout = setTimeout(() => {
    console.warn("Transition video did not end in time, proceeding.");
    cleanup();
    triggerComplete();
  }, 5000);

  videoEl.onended = () => {
    clearTimeout(fallbackTimeout);
    if (switchTimer) clearTimeout(switchTimer);
    cleanup();
    triggerComplete();
  };

  videoEl.play().catch((err) => {
    console.warn("Unable to play transition video", err);
    clearTimeout(fallbackTimeout);
    if (switchTimer) clearTimeout(switchTimer);
    cleanup();
    triggerComplete();
  });
}

// ---------------------------
// Start → Difficulty transition
// ---------------------------
function startGameSession() {
  console.log("Transition to difficulty screen...");
  const startScreen = document.getElementById("start-screen");
  const difficultyScreen = document.getElementById("difficulty-screen");
  const transitionVideo = document.getElementById("transition-video");

  // Keep menu music playing during transition to difficulty screen
  // (game music will start in startEasyMode)

  playTransitionVideo(transitionVideo, () => {
    startScreen.classList.add("hidden");
    difficultyScreen.classList.remove("hidden");
  }, 1000);
}

// ---------------------------
// Difficulty Selection
// ---------------------------
function startEasyMode() {
  const difficultyScreen = document.getElementById("difficulty-screen");
  const hud = document.getElementById("hud");
  const canvas = document.getElementById("gameCanvas");
  const transitionVideo = document.getElementById("difficulty-transition-video");

  playTransitionVideo(transitionVideo, () => {
    difficultyScreen.classList.add("hidden");
    hud.style.display = "flex";
    canvas.style.display = "block";

    Game.loadLevel("../levels/level01.json")
      .then(levelData => {
        console.log("Level loaded successfully:", levelData);
        Game.level = levelData;
        Game.originalTiles = JSON.parse(JSON.stringify(levelData.tiles));
        Game.start();

        // Stop menu music when going into gameplay, then play game music
        AudioManager.stopMusic();
        AudioManager.playMusic("assets/audios/game-theme.mp3", true, 0.6);
      })
      .catch(err => {
        console.error("Unexpected error loading level:", err);
        alert("Unable to initialize game. See console for details.");
      });
  }, 1000);
}

// ---------------------------
// DOM Ready
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const musicBtn = document.getElementById("music-btn"); // NEW button
  const easyBtn = document.getElementById("easy-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const hardBtn = document.getElementById("hard-btn");

  if (!startBtn) {
    console.error("Start button not found!");
    return;
  }

  // Music button toggle
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      setMusicEnabled(!musicEnabled);
    });
  }

  // Default state loaded from localStorage (fallback to on)
  const saved = localStorage.getItem("musicEnabled");
  const shouldPlay = saved === null ? true : saved === "true";
  setMusicEnabled(shouldPlay);

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