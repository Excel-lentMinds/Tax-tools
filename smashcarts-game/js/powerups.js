/**
 * SMASH KARTS - Power-Up System
 * Handles power-up spawning, collection, and effects
 */

// Power-up definitions
const POWERUPS = {
    speed: {
        name: 'Speed Boost',
        icon: '⚡',
        color: '#00ffff',
        duration: 8,
        description: '+30% speed',
        rarity: 'common',
        effect: (kart) => {
            kart.speedMultiplier = (kart.speedMultiplier || 1) + 0.3;
        },
        onExpire: (kart) => {
            kart.speedMultiplier = (kart.speedMultiplier || 1.3) - 0.3;
        }
    },
    shield: {
        name: 'Energy Shield',
        icon: '🛡️',
        color: '#2196f3',
        duration: 6,
        description: '50% damage reduction',
        rarity: 'rare',
        effect: (kart) => {
            kart.hasShield = true;
            kart.damageReduction = (kart.damageReduction || 0) + 0.5;
        },
        onExpire: (kart) => {
            kart.hasShield = false;
            kart.damageReduction = Math.max(0, (kart.damageReduction || 0.5) - 0.5);
        }
    },
    health: {
        name: 'Health Pack',
        icon: '❤️',
        color: '#4caf50',
        duration: 0, // Instant
        description: 'Restore 50 HP',
        rarity: 'common',
        effect: (kart) => {
            kart.heal(50);
        }
    },
    rapidfire: {
        name: 'Rapid Fire',
        icon: '🔥',
        color: '#ff9800',
        duration: 5,
        description: '2x fire rate',
        rarity: 'uncommon',
        effect: (kart) => {
            kart.fireRateMultiplier = (kart.fireRateMultiplier || 1) * 2;
        },
        onExpire: (kart) => {
            kart.fireRateMultiplier = (kart.fireRateMultiplier || 2) / 2;
        }
    },
    damage: {
        name: 'Double Damage',
        icon: '💪',
        color: '#f44336',
        duration: 5,
        description: '2x weapon damage',
        rarity: 'uncommon',
        effect: (kart) => {
            kart.damageMultiplier = (kart.damageMultiplier || 1) * 2;
        },
        onExpire: (kart) => {
            kart.damageMultiplier = (kart.damageMultiplier || 2) / 2;
        }
    },
    nitro: {
        name: 'Nitro',
        icon: '🚀',
        color: '#ffeb3b',
        duration: 0.5, // Short burst
        description: 'Instant speed burst',
        rarity: 'common',
        effect: (kart) => {
            kart.applyBoost(1.5, 0.5);
        }
    },
    invincible: {
        name: 'Invincibility',
        icon: '⭐',
        color: '#ffd700',
        duration: 4,
        description: 'Cannot take damage',
        rarity: 'legendary',
        effect: (kart) => {
            kart.invincible = true;
        },
        onExpire: (kart) => {
            kart.invincible = false;
        }
    },
    magnet: {
        name: 'Pickup Magnet',
        icon: '🧲',
        color: '#9c27b0',
        duration: 10,
        description: 'Attract nearby pickups',
        rarity: 'rare',
        effect: (kart) => {
            kart.hasMagnet = true;
            kart.magnetRange = 200;
        },
        onExpire: (kart) => {
            kart.hasMagnet = false;
            kart.magnetRange = 0;
        }
    }
};

// Rarity weights for random selection
const RARITY_WEIGHTS = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 1
};

/**
 * Power-up pickup class
 */
class PowerUpPickup {
    constructor(x, y, powerUpType) {
        this.x = x;
        this.y = y;
        this.powerUpType = powerUpType;
        this.powerUp = POWERUPS[powerUpType];
        this.active = true;
        this.size = 22;
        this.bobOffset = 0;
        this.rotation = 0;
        this.pulseScale = 1;
        this.sparkles = [];

        // Create initial sparkles
        this.createSparkles();
    }

    createSparkles() {
        for (let i = 0; i < 5; i++) {
            this.sparkles.push({
                angle: Utils.random(0, Math.PI * 2),
                distance: Utils.random(20, 35),
                speed: Utils.random(1, 3),
                size: Utils.random(2, 4),
                alpha: Utils.random(0.5, 1)
            });
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        // Bobbing animation
        this.bobOffset = Math.sin(Date.now() * 0.004) * 4;

        // Rotation
        this.rotation += deltaTime * 1.5;

        // Pulse effect
        this.pulseScale = 1 + Math.sin(Date.now() * 0.006) * 0.1;

        // Update sparkles
        this.sparkles.forEach(sparkle => {
            sparkle.angle += sparkle.speed * deltaTime;
            sparkle.alpha = 0.5 + Math.sin(Date.now() * 0.005 + sparkle.angle) * 0.5;
        });
    }

    collect() {
        if (!this.active) return false;
        this.active = false;
        Audio.play('powerup_collect');
        return true;
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + this.bobOffset;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Render sparkles
        this.sparkles.forEach(sparkle => {
            const sx = Math.cos(sparkle.angle) * sparkle.distance;
            const sy = Math.sin(sparkle.angle) * sparkle.distance;

            ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, sparkle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.scale(this.pulseScale, this.pulseScale);
        ctx.rotate(this.rotation * 0.2);

        // Glow effect
        ctx.shadowColor = this.powerUp.color;
        ctx.shadowBlur = 20;

        // Background circle with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.powerUp.color);
        gradient.addColorStop(0.7, this.powerUp.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon
        ctx.shadowBlur = 0;
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.powerUp.icon, 0, 0);

        ctx.restore();
    }
}

/**
 * Active power-up effect class
 */
class ActivePowerUp {
    constructor(kart, powerUpType) {
        this.kart = kart;
        this.powerUpType = powerUpType;
        this.powerUp = POWERUPS[powerUpType];
        this.duration = this.powerUp.duration;
        this.timeRemaining = this.duration;
        this.active = true;

        // Apply effect immediately
        if (this.powerUp.effect) {
            this.powerUp.effect(kart);
        }

        // Play activation sound
        if (powerUpType === 'shield') {
            Audio.play('shield_activate');
        } else if (powerUpType === 'speed' || powerUpType === 'nitro') {
            Audio.play('boost_activate');
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        if (this.duration > 0) {
            this.timeRemaining -= deltaTime;

            if (this.timeRemaining <= 0) {
                this.expire();
            }
        }
    }

    expire() {
        if (!this.active) return;

        this.active = false;

        if (this.powerUp.onExpire) {
            this.powerUp.onExpire(this.kart);
        }
    }

    getProgress() {
        if (this.duration <= 0) return 0;
        return this.timeRemaining / this.duration;
    }
}

/**
 * Power-ups manager
 */
class PowerUpsManager {
    constructor() {
        this.pickups = [];
        this.spawnTimer = 0;
        this.spawnInterval = 8; // seconds between spawns
        this.maxPickups = 10;
    }

    /**
     * Get random power-up type based on rarity
     */
    getRandomPowerUpType() {
        // Get all power-ups grouped by rarity
        const byRarity = {};
        Object.entries(POWERUPS).forEach(([type, data]) => {
            const rarity = data.rarity;
            if (!byRarity[rarity]) byRarity[rarity] = [];
            byRarity[rarity].push(type);
        });

        // Calculate total weight
        let totalWeight = 0;
        Object.keys(byRarity).forEach(rarity => {
            totalWeight += RARITY_WEIGHTS[rarity] * byRarity[rarity].length;
        });

        // Roll random
        let roll = Math.random() * totalWeight;

        for (const [rarity, types] of Object.entries(byRarity)) {
            const weight = RARITY_WEIGHTS[rarity];
            for (const type of types) {
                roll -= weight;
                if (roll <= 0) return type;
            }
        }

        // Fallback
        return 'health';
    }

    /**
     * Spawn a power-up at position
     */
    spawnPowerUp(x, y, powerUpType = null) {
        if (!powerUpType) {
            powerUpType = this.getRandomPowerUpType();
        }

        const pickup = new PowerUpPickup(x, y, powerUpType);
        this.pickups.push(pickup);
        Audio.play('powerup_spawn', { volume: 0.3 });

        return pickup;
    }

    /**
     * Update power-ups
     */
    update(deltaTime, arena) {
        // Update existing pickups
        this.pickups.forEach(p => p.update(deltaTime));
        this.pickups = this.pickups.filter(p => p.active);

        // Spawn timer
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.pickups.length < this.maxPickups) {
            const spawnPoint = arena.getRandomPowerUpSpawn();
            this.spawnPowerUp(spawnPoint.x, spawnPoint.y);
            this.spawnTimer = 0;
        }
    }

    /**
     * Check pickup collisions with karts
     */
    checkCollisions(karts) {
        const collected = [];

        this.pickups.forEach(pickup => {
            if (!pickup.active) return;

            karts.forEach(kart => {
                if (!kart.alive) return;

                // Check magnet effect
                if (kart.hasMagnet && kart.magnetRange) {
                    const dist = Utils.distance(pickup, kart);
                    if (dist < kart.magnetRange) {
                        // Pull pickup towards kart
                        const pull = Utils.vecNormalize(Utils.vecSub(kart, pickup));
                        pickup.x += pull.x * 300 * (1 / 60); // Assume 60fps
                        pickup.y += pull.y * 300 * (1 / 60);
                    }
                }

                // Check collision
                const dist = Utils.distance(pickup, kart);
                if (dist < pickup.size + kart.radius) {
                    if (pickup.collect()) {
                        collected.push({
                            pickup,
                            collector: kart,
                            powerUpType: pickup.powerUpType
                        });
                    }
                }
            });
        });

        return collected;
    }

    /**
     * Apply power-up to kart
     */
    applyPowerUp(kart, powerUpType) {
        const powerUp = POWERUPS[powerUpType];
        if (!powerUp) return null;

        // For instant effects
        if (powerUp.duration === 0) {
            if (powerUp.effect) {
                powerUp.effect(kart);
            }
            return null;
        }

        // For duration effects, check if already active
        const existingIndex = kart.activePowerUps.findIndex(
            ap => ap.powerUpType === powerUpType
        );

        if (existingIndex !== -1) {
            // Refresh duration
            kart.activePowerUps[existingIndex].timeRemaining = powerUp.duration;
            return kart.activePowerUps[existingIndex];
        }

        // Create new active power-up
        const activePowerUp = new ActivePowerUp(kart, powerUpType);
        kart.activePowerUps.push(activePowerUp);

        return activePowerUp;
    }

    /**
     * Render all pickups
     */
    render(ctx, camera) {
        this.pickups.forEach(p => p.render(ctx, camera));
    }

    /**
     * Clear all pickups
     */
    clear() {
        this.pickups = [];
        this.spawnTimer = 0;
    }
}

// Export
window.POWERUPS = POWERUPS;
window.PowerUpsManager = PowerUpsManager;
window.ActivePowerUp = ActivePowerUp;
