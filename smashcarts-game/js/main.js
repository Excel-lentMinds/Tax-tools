/**
 * SMASH KARTS - Main Entry Point
 * Handles initialization, menus, controls, and game startup
 */

class GameApp {
    constructor() {
        this.game = null;
        this.inputHandler = null;

        // Settings
        this.settings = {
            masterVolume: 70,
            musicVolume: 50,
            sfxVolume: 80,
            screenShake: true,
            showFPS: false,
            particleQuality: 'medium'
        };

        // Game config
        this.gameMode = 'deathmatch';
        this.difficulty = 'medium';
        this.aiCount = 4;
        this.selectedMap = 'tropical';

        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        // Load saved settings
        this.loadSettings();

        // Show loading screen
        this.simulateLoading();

        // Setup event listeners
        this.setupMenuListeners();
        this.setupInputHandling();

        // Initialize audio on first interaction
        document.addEventListener('click', () => {
            Audio.init();
        }, { once: true });

        document.addEventListener('keydown', () => {
            Audio.init();
        }, { once: true });
    }

    /**
     * Simulate loading (would load real assets in production)
     */
    simulateLoading() {
        const loadingBar = Utils.$('loading-bar');
        const loadingText = Utils.$('loading-text');

        const steps = [
            { progress: 20, text: 'Loading arena...' },
            { progress: 40, text: 'Loading vehicles...' },
            { progress: 60, text: 'Loading weapons...' },
            { progress: 80, text: 'Loading audio...' },
            { progress: 100, text: 'Ready!' }
        ];

        let stepIndex = 0;

        const loadStep = () => {
            if (stepIndex >= steps.length) {
                setTimeout(() => {
                    Utils.hide('loading-screen');
                    Utils.show('menu-screen');
                }, 500);
                return;
            }

            const step = steps[stepIndex];
            loadingBar.style.width = `${step.progress}%`;
            loadingText.textContent = step.text;

            stepIndex++;
            setTimeout(loadStep, 300);
        };

        setTimeout(loadStep, 500);
    }

    /**
     * Setup menu event listeners
     */
    setupMenuListeners() {
        // Main menu buttons
        Utils.$('btn-play').addEventListener('click', () => {
            this.startGame();
        });

        Utils.$('btn-mode-select').addEventListener('click', () => {
            Utils.show('mode-modal');
            Audio.playUI('button_click');
        });

        Utils.$('btn-settings').addEventListener('click', () => {
            Utils.show('settings-modal');
            Audio.playUI('button_click');
        });

        Utils.$('btn-controls').addEventListener('click', () => {
            Utils.show('controls-modal');
            Audio.playUI('button_click');
        });

        // Mode selection
        Utils.$$('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                Utils.$$('.mode-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.gameMode = card.dataset.mode;
                Utils.$('current-mode-text').textContent =
                    this.gameMode === 'deathmatch' ? 'Deathmatch' : 'Last Standing';
                Audio.playUI('button_click');
            });
        });

        // Map selection
        Utils.$$('.map-card').forEach(card => {
            card.addEventListener('click', () => {
                Utils.$$('.map-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedMap = card.dataset.map;
                // Update display text
                const mapTheme = MAP_THEMES[this.selectedMap];
                if (mapTheme) {
                    Utils.$('current-map-text').textContent = mapTheme.name;
                }
                Audio.playUI('button_click');
            });
        });

        // Difficulty selection
        Utils.$$('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.$$('.diff-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.difficulty = btn.dataset.diff;
                Audio.playUI('button_click');
            });
        });

        // AI count slider
        Utils.$('ai-count').addEventListener('input', (e) => {
            this.aiCount = parseInt(e.target.value);
            Utils.$('ai-count-display').textContent = this.aiCount;
        });

        // Close mode modal
        Utils.$('btn-close-mode').addEventListener('click', () => {
            Utils.hide('mode-modal');
            Audio.playUI('button_click');
        });

        // Settings
        Utils.$('master-volume').addEventListener('input', (e) => {
            this.settings.masterVolume = parseInt(e.target.value);
            Audio.setMasterVolume(this.settings.masterVolume / 100);
        });

        Utils.$('music-volume').addEventListener('input', (e) => {
            this.settings.musicVolume = parseInt(e.target.value);
            Audio.setMusicVolume(this.settings.musicVolume / 100);
        });

        Utils.$('sfx-volume').addEventListener('input', (e) => {
            this.settings.sfxVolume = parseInt(e.target.value);
            Audio.setSfxVolume(this.settings.sfxVolume / 100);
        });

        Utils.$('screen-shake').addEventListener('change', (e) => {
            this.settings.screenShake = e.target.checked;
        });

        Utils.$('show-fps').addEventListener('change', (e) => {
            this.settings.showFPS = e.target.checked;
            if (this.game && this.game.hud) {
                this.game.hud.toggleFPS(this.settings.showFPS);
            }
        });

        Utils.$('particle-quality').addEventListener('change', (e) => {
            this.settings.particleQuality = e.target.value;
        });

        // Close settings modal
        Utils.$('btn-close-settings').addEventListener('click', () => {
            Utils.hide('settings-modal');
            this.saveSettings();
            Audio.playUI('button_click');
        });

        // Close controls modal
        Utils.$('btn-close-controls').addEventListener('click', () => {
            Utils.hide('controls-modal');
            Audio.playUI('button_click');
        });

        // Pause menu
        Utils.$('btn-resume').addEventListener('click', () => {
            this.game.resume();
            Audio.playUI('button_click');
        });

        Utils.$('btn-restart').addEventListener('click', () => {
            this.game.restart();
            Audio.playUI('button_click');
        });

        Utils.$('btn-quit').addEventListener('click', () => {
            this.game.quit();
            Audio.playUI('button_click');
        });

        // Game over buttons
        Utils.$('btn-play-again').addEventListener('click', () => {
            Utils.hide('gameover-screen');
            this.startGame();
            Audio.playUI('button_click');
        });

        Utils.$('btn-main-menu').addEventListener('click', () => {
            Utils.hide('gameover-screen');
            Utils.show('menu-screen');
            Audio.playUI('button_click');
        });

        // Button hover sounds
        Utils.$$('.menu-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                Audio.playUI('button_hover');
            });
        });

        // Close modals on outside click
        Utils.$$('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Utils.hide(modal.id);
                    Audio.playUI('button_click');
                }
            });
        });
    }

    /**
     * Setup input handling
     */
    setupInputHandling() {
        // Keyboard state
        const keys = {};

        document.addEventListener('keydown', (e) => {
            keys[e.code] = true;

            // Prevent default for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) {
                e.preventDefault();
            }

            // Pause game
            if (e.code === 'Escape' && this.game) {
                if (this.game.state === 'playing') {
                    this.game.pause();
                } else if (this.game.state === 'paused') {
                    this.game.resume();
                }
            }

            // Update player input
            this.updatePlayerInput(keys);
        });

        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
            this.updatePlayerInput(keys);
        });

        // Mouse click for firing
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0 && this.game && this.game.state === 'playing') {
                if (this.game.player) {
                    this.game.player.input.fire = true;
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0 && this.game && this.game.player) {
                this.game.player.input.fire = false;
            }
        });
    }

    /**
     * Update player input from keyboard state
     */
    updatePlayerInput(keys) {
        if (!this.game || !this.game.player) return;

        const player = this.game.player;

        // Movement
        player.input.accelerate = keys['KeyW'] || keys['ArrowUp'] || false;
        player.input.brake = keys['KeyS'] || keys['ArrowDown'] || false;
        player.input.left = keys['KeyA'] || keys['ArrowLeft'] || false;
        player.input.right = keys['KeyD'] || keys['ArrowRight'] || false;

        // Drift
        player.input.drift = keys['ShiftLeft'] || keys['ShiftRight'] || false;

        // Fire (spacebar)
        if (keys['Space']) {
            player.input.fire = true;
        }

        // Drop weapon
        if (keys['KeyE']) {
            player.dropWeapon();
        }
    }

    /**
     * Start the game
     */
    startGame() {
        Audio.playUI('button_click');

        // Create game instance
        this.game = new Game();
        this.game.mode = this.gameMode;
        this.game.difficulty = this.difficulty;
        this.game.aiCount = this.aiCount;
        this.game.selectedMap = this.selectedMap;
        this.game.settings = { ...this.settings };

        // Set match duration based on mode
        if (this.gameMode === 'laststanding') {
            this.game.matchDuration = 600; // 10 minutes for last standing
        } else {
            this.game.matchDuration = 180; // 3 minutes for deathmatch
        }

        // Hide menu, show game
        Utils.hide('menu-screen');
        Utils.show('game-screen');

        // Show countdown then start
        this.showCountdown(() => {
            this.game.start();

            if (this.settings.showFPS) {
                this.game.hud.toggleFPS(true);
            }

            // Start music
            Audio.playMusic('battle');
        });
    }

    /**
     * Show countdown before game start
     */
    showCountdown(callback) {
        const overlay = Utils.$('countdown-overlay');
        const number = Utils.$('countdown-number');

        Utils.show(overlay);

        let count = 3;

        const tick = () => {
            if (count > 0) {
                number.textContent = count;
                number.className = 'countdown-number';
                Audio.play('countdown_tick');
                count--;
                setTimeout(tick, 1000);
            } else {
                number.textContent = 'GO!';
                number.className = 'countdown-number go';
                Audio.play('countdown_go');

                setTimeout(() => {
                    Utils.hide(overlay);
                    callback();
                }, 500);
            }
        };

        tick();
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        Utils.save('smashkarts_settings', this.settings);
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = Utils.load('smashkarts_settings');
        if (saved) {
            this.settings = { ...this.settings, ...saved };

            // Apply to UI
            Utils.$('master-volume').value = this.settings.masterVolume;
            Utils.$('music-volume').value = this.settings.musicVolume;
            Utils.$('sfx-volume').value = this.settings.sfxVolume;
            Utils.$('screen-shake').checked = this.settings.screenShake;
            Utils.$('show-fps').checked = this.settings.showFPS;
            Utils.$('particle-quality').value = this.settings.particleQuality;

            // Apply to audio
            Audio.setMasterVolume(this.settings.masterVolume / 100);
            Audio.setMusicVolume(this.settings.musicVolume / 100);
            Audio.setSfxVolume(this.settings.sfxVolume / 100);
        }
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GameApp();
});
