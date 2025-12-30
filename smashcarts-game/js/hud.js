/**
 * SMASH KARTS - HUD System
 * Handles all in-game UI elements
 */

class HUD {
    constructor() {
        // DOM elements
        this.elements = {
            healthFill: Utils.$('health-fill'),
            healthText: Utils.$('health-text'),
            boostFill: Utils.$('boost-fill'),
            gameTimer: Utils.$('game-timer'),
            killCount: Utils.$('kill-count'),
            weaponDisplay: Utils.$('weapon-display'),
            weaponIcon: Utils.$('weapon-icon'),
            weaponName: Utils.$('weapon-name'),
            weaponAmmo: Utils.$('weapon-ammo'),
            killFeed: Utils.$('kill-feed'),
            announcement: Utils.$('announcement'),
            activePowerups: Utils.$('active-powerups'),
            minimap: Utils.$('minimap'),
            fpsCounter: Utils.$('fps-counter')
        };

        this.minimapCtx = this.elements.minimap.getContext('2d');

        // Kill feed
        this.killFeedEntries = [];
        this.maxKillFeedEntries = 5;

        // Announcement queue
        this.announcementQueue = [];
        this.currentAnnouncement = null;
        this.announcementTimer = 0;

        // FPS tracking
        this.fpsHistory = [];
        this.showFPS = false;
    }

    /**
     * Update all HUD elements
     */
    update(player, gameState, deltaTime) {
        this.updateHealth(player);
        this.updateBoost(player);
        this.updateTimer(gameState.timeRemaining);
        this.updateKillCount(player);
        this.updateWeapon(player);
        this.updateActivePowerups(player);
        this.updateMinimap(gameState);
        this.updateAnnouncement(deltaTime);
        this.updateKillFeed(deltaTime);

        if (this.showFPS) {
            this.updateFPS(deltaTime);
        }
    }

    /**
     * Update health bar
     */
    updateHealth(player) {
        const healthPercent = (player.health / player.maxHealth) * 100;
        this.elements.healthFill.style.width = `${healthPercent}%`;
        this.elements.healthText.textContent = Math.ceil(player.health);

        // Update health bar color class
        this.elements.healthFill.classList.remove('low', 'critical');
        if (healthPercent <= 25) {
            this.elements.healthFill.classList.add('critical');
        } else if (healthPercent <= 50) {
            this.elements.healthFill.classList.add('low');
        }
    }

    /**
     * Update boost bar
     */
    updateBoost(player) {
        const boostPercent = (player.boost / player.maxBoost) * 100;
        this.elements.boostFill.style.width = `${boostPercent}%`;
    }

    /**
     * Update game timer
     */
    updateTimer(timeRemaining) {
        const timeStr = Utils.formatTime(Math.max(0, timeRemaining));
        this.elements.gameTimer.textContent = timeStr;

        // Warning colors
        this.elements.gameTimer.classList.remove('warning', 'critical');
        if (timeRemaining <= 30) {
            this.elements.gameTimer.classList.add('critical');
        } else if (timeRemaining <= 60) {
            this.elements.gameTimer.classList.add('warning');
        }
    }

    /**
     * Update kill count
     */
    updateKillCount(player) {
        this.elements.killCount.textContent = player.kills;
    }

    /**
     * Update weapon display
     */
    updateWeapon(player) {
        if (player.weapon) {
            this.elements.weaponIcon.textContent = player.weapon.icon;
            this.elements.weaponName.textContent = player.weapon.name;
            this.elements.weaponAmmo.textContent = player.ammo;
            this.elements.weaponDisplay.style.borderColor = player.weapon.color;
        } else {
            this.elements.weaponIcon.textContent = '❌';
            this.elements.weaponName.textContent = 'No Weapon';
            this.elements.weaponAmmo.textContent = '--';
            this.elements.weaponDisplay.style.borderColor = '#666';
        }
    }

    /**
     * Update active power-ups display
     */
    updateActivePowerups(player) {
        this.elements.activePowerups.innerHTML = '';

        player.activePowerUps.forEach(ap => {
            if (!ap.active || ap.powerUp.duration === 0) return;

            const div = document.createElement('div');
            div.className = 'powerup-active';
            div.style.borderColor = ap.powerUp.color;

            const remaining = Math.ceil(ap.timeRemaining);
            div.innerHTML = `
                <span>${ap.powerUp.icon}</span>
                <span class="timer">${remaining}s</span>
            `;

            this.elements.activePowerups.appendChild(div);
        });
    }

    /**
     * Update minimap
     */
    updateMinimap(gameState) {
        if (gameState.arena) {
            gameState.arena.renderMinimap(
                this.minimapCtx,
                gameState.allKarts,
                [...gameState.powerups, ...gameState.weapons],
                gameState.camera
            );
        }
    }

    /**
     * Add kill to kill feed
     */
    addKill(killer, victim, weapon = null) {
        const entry = {
            killer: killer.name,
            victim: victim.name,
            weapon: weapon ? weapon.icon : '💥',
            isPlayerKill: killer.isPlayer,
            isPlayerDeath: victim.isPlayer,
            timestamp: Date.now()
        };

        this.killFeedEntries.unshift(entry);

        if (this.killFeedEntries.length > this.maxKillFeedEntries) {
            this.killFeedEntries.pop();
        }

        this.renderKillFeed();
    }

    /**
     * Render kill feed
     */
    renderKillFeed() {
        this.elements.killFeed.innerHTML = '';

        this.killFeedEntries.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'kill-entry';
            if (entry.isPlayerKill) div.classList.add('self');

            div.innerHTML = `
                <span class="killer">${entry.killer}</span>
                <span>${entry.weapon}</span>
                <span class="victim">${entry.victim}</span>
            `;

            this.elements.killFeed.appendChild(div);
        });
    }

    /**
     * Update kill feed (remove old entries)
     */
    updateKillFeed(deltaTime) {
        const now = Date.now();
        const timeout = 5000;

        const hadEntries = this.killFeedEntries.length > 0;
        this.killFeedEntries = this.killFeedEntries.filter(
            entry => now - entry.timestamp < timeout
        );

        if (hadEntries && this.killFeedEntries.length === 0) {
            this.elements.killFeed.innerHTML = '';
        }
    }

    /**
     * Show announcement
     */
    showAnnouncement(text, type = 'normal', duration = 3) {
        this.announcementQueue.push({ text, type, duration });

        if (!this.currentAnnouncement) {
            this.playNextAnnouncement();
        }
    }

    /**
     * Play next announcement from queue
     */
    playNextAnnouncement() {
        if (this.announcementQueue.length === 0) {
            this.currentAnnouncement = null;
            this.elements.announcement.className = 'announcement';
            this.elements.announcement.textContent = '';
            return;
        }

        this.currentAnnouncement = this.announcementQueue.shift();
        this.announcementTimer = this.currentAnnouncement.duration;

        this.elements.announcement.textContent = this.currentAnnouncement.text;
        this.elements.announcement.className = `announcement show ${this.currentAnnouncement.type}`;
    }

    /**
     * Update announcement
     */
    updateAnnouncement(deltaTime) {
        if (!this.currentAnnouncement) return;

        this.announcementTimer -= deltaTime;

        if (this.announcementTimer <= 0) {
            this.playNextAnnouncement();
        }
    }

    /**
     * Update FPS counter
     */
    updateFPS(deltaTime) {
        const fps = 1 / deltaTime;
        this.fpsHistory.push(fps);

        if (this.fpsHistory.length > 30) {
            this.fpsHistory.shift();
        }

        const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        this.elements.fpsCounter.textContent = `FPS: ${Math.round(avgFPS)}`;
    }

    /**
     * Toggle FPS display
     */
    toggleFPS(show) {
        this.showFPS = show;
        if (show) {
            this.elements.fpsCounter.classList.remove('hidden');
        } else {
            this.elements.fpsCounter.classList.add('hidden');
        }
    }

    /**
     * Reset HUD
     */
    reset() {
        this.killFeedEntries = [];
        this.announcementQueue = [];
        this.currentAnnouncement = null;
        this.elements.killFeed.innerHTML = '';
        this.elements.announcement.className = 'announcement';
        this.elements.announcement.textContent = '';
        this.elements.activePowerups.innerHTML = '';
    }
}

// Export
window.HUD = HUD;
