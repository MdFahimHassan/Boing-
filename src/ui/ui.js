// ---------------------------
// UI Logic for Boing!
// ---------------------------

// ---------------------------
// Audio Manager
// ---------------------------
let musicEnabled = false;

const AudioManager = {
  bgMusic: null,

  playMusic(src, loop = true, targetVolume = 0.2, fadeDuration = 5000) {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
    this.bgMusic = new Audio(src);
    this.bgMusic.loop = loop;
    this.bgMusic.volume = 0; // start silent

    const playPromise = this.bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(`Audio failed to play (${src})`, err);
      });
    }

    // Fade-in effect
    const steps = 20;
    const stepTime = fadeDuration / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = (currentStep / steps) * targetVolume;
      this.bgMusic.volume = Math.min(newVol, targetVolume);
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepTime);

    return playPromise;
  },

  stopMusic(fadeDuration = 1000) {
    if (this.bgMusic) {
      const steps = 20;
      const stepTime = fadeDuration / steps;
      let currentStep = 0;
      const startVol = this.bgMusic.volume;

      const fadeInterval = setInterval(() => {
        currentStep++;
        const newVol = startVol * (1 - currentStep / steps);
        this.bgMusic.volume = Math.max(newVol, 0);
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          this.bgMusic.pause();
          this.bgMusic = null;
        }
      }, stepTime);
    }
  },

  // Sound Effects
  playSFX(src, volume = 1.0) {
    const sfx = new Audio(src);
    sfx.volume = volume;
    sfx.play().catch(err => {
      console.warn(`SFX failed to play (${src})`, err);
    });
  }
};

function setMusicEnabled(enabled) {
  const musicBtn = document.getElementById("music-btn");
  musicEnabled = enabled;
  localStorage.setItem("musicEnabled", enabled ? "true" : "false");

  if (enabled) {
    AudioManager.playMusic("assets/audios/DefaultBgMusic.mp3", true, 0.1);
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
  videoEl.muted = true;

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

  AudioManager.playSFX("assets/audios/TransitionSwoosh.mp3", 0.8);

  playTransitionVideo(transitionVideo, () => {
    startScreen.classList.add("hidden");
    difficultyScreen.classList.remove("hidden");
  }, 1000);
}

// ---------------------------
// Difficulty Selection
// ---------------------------
// ---------------------------
// Easy Mode Start
// ---------------------------
function startEasyMode() {
  const difficultyScreen = document.getElementById("difficulty-screen");
  const hud = document.getElementById("hud");
  const canvas = document.getElementById("gameCanvas");
  const transitionVideo = document.getElementById("difficulty-transition-video");

  // Use a longer sound effect for this transition
  AudioManager.playSFX("assets/audios/TransitionSwooshLong.mp3", 1.0);

  playTransitionVideo(transitionVideo, () => {
    difficultyScreen.classList.add("hidden");
    hud.style.display = "flex";
    canvas.style.display = "block";

    Game.loadLevel("../levels/level01.json")
      .then(levelData => {
        Game.level = levelData;
        Game.originalTiles = JSON.parse(JSON.stringify(levelData.tiles));
        Game.start();

        // Fade out the default menu music
        AudioManager.stopMusic(2000); // fade out over 2 seconds

        // After fade-out completes, fade in Easy mode music
        setTimeout(() => {
          AudioManager.playMusic("assets/audios/EasyModeBg.mp3", true, 0.8, 2000);
        }, 2000);
      })
      .catch(err => {
        console.error("Error loading level:", err);
        alert("Unable to start Easy mode. Please check console for details.");
      });
  }, 1000);
}

// ---------------------------
// DOM Ready
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const musicBtn = document.getElementById("music-btn");
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
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      setMusicEnabled(!musicEnabled);
    });
  }

  // Load saved preference
  const saved = localStorage.getItem("musicEnabled");
  const shouldPlay = saved === null ? true : saved === "true";
  setMusicEnabled(shouldPlay);

  // Start button
  startBtn.addEventListener("click", () => {
    AudioManager.playSFX("assets/audios/click.wav", 0.6);
    startGameSession();
  });

  // Enter key also starts game
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !document.getElementById("start-screen").classList.contains("hidden")) {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      startGameSession();
    }
  });

  // Settings button
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      alert("Settings menu coming soon!");
    });
  }

  // Difficulty buttons
  if (easyBtn) {
    easyBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      startEasyMode();
    });
  }
  if (mediumBtn) {
    mediumBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      alert("Medium difficulty coming soon!");
    });
  }
  if (hardBtn) {
    hardBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      alert("Hard difficulty coming soon!");
    });
  }

  // Pause menu toggle with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const pauseMenu = document.getElementById("pause-menu");
      if (pauseMenu) {
        AudioManager.playSFX("assets/audios/click.wav", 0.6);
        pauseMenu.classList.toggle("hidden");
      }
    }
  });

  // Resume button
  const resumeBtn = document.getElementById("resume-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
      document.getElementById("pause-menu").classList.add("hidden");
    });
  }

  // Quit button
  const quitBtn = document.getElementById("quit-btn");
  if (quitBtn) {
    quitBtn.addEventListener("click", () => {
      AudioManager.playSFX("assets/audios/click.wav", 0.6);
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