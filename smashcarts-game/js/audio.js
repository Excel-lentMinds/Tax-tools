/**
 * SMASH KARTS - Audio System
 * Handles all game audio including sound effects and music
 */

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.currentMusicTrack = null;

        // Volume settings
        this.masterVolume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.8;

        // Audio context for Web Audio API
        this.audioContext = null;
        this.initialized = false;

        // Sound definitions with procedural generation
        this.soundDefs = {
            // Engine sounds
            engine_idle: { frequency: 80, type: 'sawtooth', duration: 0.1, loop: true },
            engine_accel: { frequency: 120, type: 'sawtooth', duration: 0.1, loop: true },
            engine_boost: { frequency: 200, type: 'square', duration: 0.1, loop: true },

            // Weapon sounds
            machinegun_fire: { frequency: 800, type: 'square', duration: 0.05 },
            rocket_fire: { frequency: 150, type: 'sawtooth', duration: 0.3 },
            rocket_explode: { type: 'explosion', duration: 0.5 },
            shotgun_fire: { frequency: 200, type: 'square', duration: 0.15 },
            laser_fire: { frequency: 1200, type: 'sine', duration: 0.2 },
            mine_deploy: { frequency: 400, type: 'triangle', duration: 0.1 },
            mine_explode: { type: 'explosion', duration: 0.4 },

            // Impact sounds
            collision_light: { type: 'noise', duration: 0.1 },
            collision_heavy: { type: 'noise', duration: 0.2 },
            hit: { frequency: 300, type: 'square', duration: 0.1 },

            // Power-up sounds
            powerup_collect: { frequencies: [523, 659, 784], type: 'sine', duration: 0.3 },
            powerup_spawn: { frequency: 440, type: 'sine', duration: 0.2 },
            boost_activate: { frequency: 600, type: 'sawtooth', duration: 0.3 },
            shield_activate: { frequency: 800, type: 'sine', duration: 0.4 },

            // UI sounds
            button_hover: { frequency: 400, type: 'sine', duration: 0.05 },
            button_click: { frequency: 600, type: 'sine', duration: 0.1 },
            countdown_tick: { frequency: 440, type: 'square', duration: 0.1 },
            countdown_go: { frequency: 880, type: 'square', duration: 0.3 },

            // Game events
            kill: { frequencies: [523, 659], type: 'square', duration: 0.2 },
            death: { frequency: 150, type: 'sawtooth', duration: 0.5 },
            victory: { frequencies: [523, 659, 784, 1047], type: 'sine', duration: 0.5 },
            defeat: { frequencies: [392, 330, 262], type: 'sine', duration: 0.6 }
        };
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    /**
     * Set volume levels
     */
    setMasterVolume(value) {
        this.masterVolume = Utils.clamp(value, 0, 1);
    }

    setMusicVolume(value) {
        this.musicVolume = Utils.clamp(value, 0, 1);
        if (this.music) {
            this.music.volume = this.musicVolume * this.masterVolume;
        }
    }

    setSfxVolume(value) {
        this.sfxVolume = Utils.clamp(value, 0, 1);
    }

    /**
     * Play a sound effect
     */
    play(soundName, options = {}) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;

        const def = this.soundDefs[soundName];
        if (!def) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }

        const volume = (options.volume || 1) * this.sfxVolume * this.masterVolume;
        const pitch = options.pitch || 1;

        if (def.type === 'explosion') {
            this.playExplosion(volume, def.duration);
        } else if (def.type === 'noise') {
            this.playNoise(volume, def.duration);
        } else if (def.frequencies) {
            this.playChord(def.frequencies, def.type, volume, def.duration, pitch);
        } else {
            this.playTone(def.frequency * pitch, def.type, volume, def.duration);
        }
    }

    /**
     * Play a simple tone
     */
    playTone(frequency, type, volume, duration) {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    /**
     * Play a chord (multiple frequencies)
     */
    playChord(frequencies, type, volume, duration, pitch = 1) {
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq * pitch, type, volume / frequencies.length, duration);
            }, i * 50);
        });
    }

    /**
     * Play explosion sound (white noise with envelope)
     */
    playExplosion(volume, duration) {
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate noise with decay
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.pow(1 - i / bufferSize, 2);
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        source.buffer = buffer;
        gain.gain.value = volume * 0.5;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start(ctx.currentTime);
    }

    /**
     * Play noise burst
     */
    playNoise(volume, duration) {
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const envelope = 1 - i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.value = 500;

        source.buffer = buffer;
        gain.gain.value = volume * 0.3;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start(ctx.currentTime);
    }

    /**
     * Play looping engine sound
     */
    playEngineLoop(speed) {
        if (!this.initialized || !this.audioContext) return null;

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 60 + speed * 100;

        gain.gain.value = 0.1 * this.sfxVolume * this.masterVolume;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();

        return {
            oscillator: osc,
            gain: gain,
            setSpeed: (newSpeed) => {
                osc.frequency.setTargetAtTime(60 + newSpeed * 100, ctx.currentTime, 0.1);
            },
            setVolume: (vol) => {
                gain.gain.setTargetAtTime(vol * 0.1 * this.sfxVolume * this.masterVolume, ctx.currentTime, 0.1);
            },
            stop: () => {
                gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
                setTimeout(() => osc.stop(), 200);
            }
        };
    }

    /**
     * Play background music (procedural)
     */
    playMusic(track = 'battle') {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;

        this.stopMusic();

        // Create a simple procedural music loop
        const ctx = this.audioContext;

        // Bass line
        const bassNotes = [65.41, 73.42, 82.41, 98.00]; // C2, D2, E2, G2
        let noteIndex = 0;

        const playBassNote = () => {
            if (!this.music) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = bassNotes[noteIndex % bassNotes.length];

            gain.gain.setValueAtTime(0.15 * this.musicVolume * this.masterVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);

            noteIndex++;
        };

        this.music = {
            interval: setInterval(playBassNote, 500),
            track: track
        };

        this.currentMusicTrack = track;
        playBassNote();
    }

    /**
     * Stop music
     */
    stopMusic() {
        if (this.music && this.music.interval) {
            clearInterval(this.music.interval);
            this.music = null;
            this.currentMusicTrack = null;
        }
    }

    /**
     * Play UI sound
     */
    playUI(soundName) {
        this.play(soundName, { volume: 0.5 });
    }
}

// Create global audio manager instance
window.Audio = new AudioManager();
