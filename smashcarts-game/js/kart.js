/**
 * SMASH KARTS - Kart System
 * Handles kart physics, rendering, and controls
 */

class Kart {
    constructor(options = {}) {
        // Position and movement
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = 0;
        this.vy = 0;
        this.rotation = options.rotation || 0;
        this.angularVelocity = 0;

        // Dimensions
        this.width = 40;
        this.height = 25;
        this.radius = Math.max(this.width, this.height) / 2;

        // Stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxSpeed = options.maxSpeed || 350;
        this.acceleration = options.acceleration || 400;
        this.deceleration = options.deceleration || 200;
        this.brakeForce = options.brakeForce || 600;
        this.turnSpeed = options.turnSpeed || 3.5;
        this.friction = 0.98;
        this.lateralFriction = 0.92;

        // State
        this.alive = true;
        this.isPlayer = options.isPlayer || false;
        this.name = options.name || 'Kart';
        this.color = options.color || '#ff6b35';
        this.id = options.id || Math.random().toString(36).substr(2, 9);

        // Combat
        this.weapon = null;
        this.weaponType = null;
        this.ammo = 0;
        this.lastFireTime = 0;
        this.fireCooldown = 0;

        // Modifiers
        this.speedMultiplier = 1;
        this.damageMultiplier = 1;
        this.damageReduction = 0;
        this.fireRateMultiplier = 1;
        this.hasShield = false;
        this.invincible = false;
        this.hasMagnet = false;
        this.magnetRange = 0;

        // Boost
        this.boost = 0;
        this.maxBoost = 100;
        this.boostRechargeRate = 10;
        this.isBoosting = false;
        this.boostMultiplier = 1;
        this.boostDuration = 0;

        // Drift
        this.isDrifting = false;
        this.driftDirection = 0;
        this.driftBoostCharge = 0;
        this.maxDriftBoost = 1.5;

        // Active power-ups
        this.activePowerUps = [];

        // Stats tracking
        this.kills = 0;
        this.deaths = 0;
        this.damageDealt = 0;

        // Visual effects
        this.flashTimer = 0;
        this.flashColor = '#ffffff';
        this.tireMarks = [];
        this.engineSound = null;

        // Respawn
        this.respawnTimer = 0;
        this.respawnDelay = 3;

        // Input state
        this.input = {
            accelerate: false,
            brake: false,
            left: false,
            right: false,
            fire: false,
            drift: false
        };
    }

    /**
     * Set weapon
     */
    setWeapon(weaponType) {
        const weapon = WEAPONS[weaponType];
        if (!weapon) return;

        this.weaponType = weaponType;
        this.weapon = weapon;
        this.ammo = weapon.ammo;
        this.fireCooldown = 0;
    }

    /**
     * Drop current weapon
     */
    dropWeapon() {
        this.weaponType = null;
        this.weapon = null;
        this.ammo = 0;
    }

    /**
     * Can fire weapon
     */
    canFire() {
        if (!this.weapon || this.ammo <= 0) return false;
        if (Date.now() - this.lastFireTime < (1000 / (this.weapon.fireRate * this.fireRateMultiplier))) {
            return false;
        }
        return true;
    }

    /**
     * Fire weapon
     */
    fire() {
        if (!this.canFire()) return false;

        this.ammo--;
        this.lastFireTime = Date.now();

        if (this.ammo <= 0) {
            this.dropWeapon();
        }

        return true;
    }

    /**
     * Take damage
     */
    takeDamage(amount, source = null) {
        if (!this.alive || this.invincible) return 0;

        // Apply damage reduction
        const actualDamage = amount * (1 - this.damageReduction);
        this.health -= actualDamage;

        // Flash effect
        this.flash('#ff0000', 0.1);
        Audio.play('hit', { volume: 0.5 });

        if (this.health <= 0) {
            this.die(source);
        }

        return actualDamage;
    }

    /**
     * Heal
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.flash('#00ff00', 0.2);
    }

    /**
     * Apply knockback
     */
    applyKnockback(direction, force) {
        this.vx += direction.x * force;
        this.vy += direction.y * force;
    }

    /**
     * Die
     */
    die(killer = null) {
        if (!this.alive) return;

        this.alive = false;
        this.deaths++;

        if (killer && killer !== this) {
            killer.kills++;
            killer.damageDealt += this.maxHealth;
        }

        // Clear active power-ups
        this.activePowerUps.forEach(ap => ap.expire());
        this.activePowerUps = [];

        // Reset modifiers
        this.speedMultiplier = 1;
        this.damageMultiplier = 1;
        this.damageReduction = 0;
        this.fireRateMultiplier = 1;
        this.hasShield = false;
        this.invincible = false;

        Audio.play('death');

        // Start respawn timer
        this.respawnTimer = this.respawnDelay;
    }

    /**
     * Respawn
     */
    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rotation = Math.random() * Math.PI * 2;
        this.health = this.maxHealth;
        this.alive = true;
        this.dropWeapon();
        this.respawnTimer = 0;

        // Brief invincibility
        this.invincible = true;
        setTimeout(() => {
            this.invincible = false;
        }, 2000);
    }

    /**
     * Apply boost
     */
    applyBoost(multiplier, duration) {
        this.boostMultiplier = multiplier;
        this.boostDuration = duration;
        this.isBoosting = true;
        Audio.play('boost_activate');
    }

    /**
     * Flash effect
     */
    flash(color, duration) {
        this.flashColor = color;
        this.flashTimer = duration;
    }

    /**
     * Update physics
     */
    update(deltaTime) {
        if (!this.alive) {
            // Update respawn timer
            if (this.respawnTimer > 0) {
                this.respawnTimer -= deltaTime;
            }
            return;
        }

        // Update active power-ups
        this.activePowerUps.forEach(ap => ap.update(deltaTime));
        this.activePowerUps = this.activePowerUps.filter(ap => ap.active);

        // Update boost
        if (this.boostDuration > 0) {
            this.boostDuration -= deltaTime;
            if (this.boostDuration <= 0) {
                this.boostMultiplier = 1;
                this.isBoosting = false;
            }
        }

        // Recharge boost
        if (!this.isBoosting && this.boost < this.maxBoost) {
            this.boost = Math.min(this.maxBoost, this.boost + this.boostRechargeRate * deltaTime);
        }

        // Calculate speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const effectiveMaxSpeed = this.maxSpeed * this.speedMultiplier * this.boostMultiplier;

        // Handle turning
        let turnInput = 0;
        if (this.input.left) turnInput -= 1;
        if (this.input.right) turnInput += 1;

        if (turnInput !== 0) {
            // Turn speed reduces at higher speeds
            const speedFactor = 1 - (speed / effectiveMaxSpeed) * 0.3;
            let effectiveTurnSpeed = this.turnSpeed * speedFactor;

            // Drift increases turn speed
            if (this.isDrifting) {
                effectiveTurnSpeed *= 1.5;
            }

            this.rotation += turnInput * effectiveTurnSpeed * deltaTime;
        }

        // Normalize rotation
        while (this.rotation > Math.PI) this.rotation -= Math.PI * 2;
        while (this.rotation < -Math.PI) this.rotation += Math.PI * 2;

        // Forward direction
        const forwardX = Math.cos(this.rotation);
        const forwardY = Math.sin(this.rotation);

        // Handle acceleration
        if (this.input.accelerate) {
            this.vx += forwardX * this.acceleration * deltaTime;
            this.vy += forwardY * this.acceleration * deltaTime;
        }

        // Handle braking/reverse
        if (this.input.brake) {
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > 10) {
                // Brake
                const brakeAmount = this.brakeForce * deltaTime;
                const brakeFactor = Math.max(0, 1 - brakeAmount / currentSpeed);
                this.vx *= brakeFactor;
                this.vy *= brakeFactor;
            } else {
                // Reverse
                this.vx -= forwardX * this.acceleration * 0.5 * deltaTime;
                this.vy -= forwardY * this.acceleration * 0.5 * deltaTime;
            }
        }

        // Handle drift
        if (this.input.drift && speed > effectiveMaxSpeed * 0.5) {
            if (!this.isDrifting) {
                this.isDrifting = true;
                this.driftDirection = turnInput || 1;
            }

            // Build drift boost
            this.driftBoostCharge = Math.min(
                this.maxDriftBoost,
                this.driftBoostCharge + deltaTime * 0.5
            );
        } else if (this.isDrifting) {
            // Release drift - apply boost
            if (this.driftBoostCharge > 0.5) {
                this.applyBoost(1.3, this.driftBoostCharge * 0.5);
            }
            this.isDrifting = false;
            this.driftBoostCharge = 0;
        }

        // Apply lateral friction (prevent sliding)
        const rightX = -forwardY;
        const rightY = forwardX;
        const lateralVelocity = this.vx * rightX + this.vy * rightY;

        let lateralFrictionFactor = this.lateralFriction;
        if (this.isDrifting) {
            lateralFrictionFactor = 0.96; // Less lateral grip when drifting
        }

        this.vx -= rightX * lateralVelocity * (1 - lateralFrictionFactor);
        this.vy -= rightY * lateralVelocity * (1 - lateralFrictionFactor);

        // Apply general friction
        if (!this.input.accelerate && !this.input.brake) {
            this.vx *= Math.pow(this.friction, deltaTime * 60);
            this.vy *= Math.pow(this.friction, deltaTime * 60);
        }

        // Clamp speed
        const newSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (newSpeed > effectiveMaxSpeed) {
            const factor = effectiveMaxSpeed / newSpeed;
            this.vx *= factor;
            this.vy *= factor;
        }

        // Clamp reverse speed
        const forwardSpeed = this.vx * forwardX + this.vy * forwardY;
        if (forwardSpeed < -effectiveMaxSpeed * 0.4) {
            const reverseMax = effectiveMaxSpeed * 0.4;
            this.vx = forwardX * -reverseMax;
            this.vy = forwardY * -reverseMax;
        }

        // Move
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Add tire marks when drifting
        if (this.isDrifting && speed > 100) {
            this.addTireMarks();
        }

        // Update flash timer
        if (this.flashTimer > 0) {
            this.flashTimer -= deltaTime;
        }
    }

    /**
     * Add tire marks
     */
    addTireMarks() {
        if (this.tireMarks.length > 100) {
            this.tireMarks.shift();
        }

        // Calculate wheel positions
        const wheelOffsetX = this.width * 0.35;
        const wheelOffsetY = this.height * 0.4;

        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        // Rear wheels
        const rearLeft = {
            x: this.x - cos * wheelOffsetX + sin * wheelOffsetY,
            y: this.y - sin * wheelOffsetX - cos * wheelOffsetY
        };
        const rearRight = {
            x: this.x - cos * wheelOffsetX - sin * wheelOffsetY,
            y: this.y - sin * wheelOffsetX + cos * wheelOffsetY
        };

        this.tireMarks.push({ ...rearLeft, alpha: 1 });
        this.tireMarks.push({ ...rearRight, alpha: 1 });
    }

    /**
     * Get current speed
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /**
     * Check collision with another kart
     */
    checkKartCollision(other) {
        if (!this.alive || !other.alive) return null;
        if (this === other) return null;

        const dist = Utils.distance(this, other);
        const minDist = this.radius + other.radius;

        if (dist < minDist) {
            return {
                distance: dist,
                minDistance: minDist,
                overlap: minDist - dist,
                normal: Utils.vecNormalize(Utils.vecSub(other, this))
            };
        }

        return null;
    }

    /**
     * Resolve collision with another kart
     */
    resolveKartCollision(other, collision) {
        // Push apart
        const pushX = collision.normal.x * collision.overlap * 0.5;
        const pushY = collision.normal.y * collision.overlap * 0.5;

        this.x -= pushX;
        this.y -= pushY;
        other.x += pushX;
        other.y += pushY;

        // Calculate impact velocity
        const relativeVelocity = {
            x: this.vx - other.vx,
            y: this.vy - other.vy
        };
        const impactSpeed = Math.abs(
            relativeVelocity.x * collision.normal.x +
            relativeVelocity.y * collision.normal.y
        );

        // Bounce
        const bounciness = 0.6;
        const massRatio = 0.5; // Equal mass

        this.vx -= collision.normal.x * impactSpeed * bounciness * massRatio;
        this.vy -= collision.normal.y * impactSpeed * bounciness * massRatio;
        other.vx += collision.normal.x * impactSpeed * bounciness * massRatio;
        other.vy += collision.normal.y * impactSpeed * bounciness * massRatio;

        // Ram damage
        if (impactSpeed > 150) {
            const damage = impactSpeed * 0.1;
            this.takeDamage(damage * 0.5, other);
            other.takeDamage(damage * 0.5, this);
            Audio.play('collision_heavy', { volume: 0.7 });
        } else if (impactSpeed > 50) {
            Audio.play('collision_light', { volume: 0.4 });
        }

        return impactSpeed;
    }

    /**
     * Render kart
     */
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Don't render if not alive (could add death animation)
        if (!this.alive) return;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);

        // Shield effect
        if (this.hasShield) {
            ctx.strokeStyle = 'rgba(33, 150, 243, 0.7)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Invincibility effect
        if (this.invincible) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
        }

        // Flash effect
        if (this.flashTimer > 0) {
            ctx.globalAlpha = 0.5;
        }

        // Kart body shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(-this.width / 2 + 3, -this.height / 2 + 3, this.width, this.height);

        // Kart body
        const bodyColor = this.flashTimer > 0 ? this.flashColor : this.color;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Kart body gradient
        const gradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Cockpit
        ctx.fillStyle = '#222';
        ctx.fillRect(0, -this.height / 4, this.width / 4, this.height / 2);

        // Front bumper
        ctx.fillStyle = '#333';
        ctx.fillRect(this.width / 2 - 5, -this.height / 2, 5, this.height);

        // Wheels
        ctx.fillStyle = '#111';
        const wheelWidth = 8;
        const wheelHeight = 6;

        // Front left
        ctx.fillRect(this.width / 3, -this.height / 2 - 2, wheelWidth, wheelHeight);
        // Front right
        ctx.fillRect(this.width / 3, this.height / 2 - wheelHeight + 2, wheelWidth, wheelHeight);
        // Rear left
        ctx.fillRect(-this.width / 3, -this.height / 2 - 2, wheelWidth, wheelHeight);
        // Rear right
        ctx.fillRect(-this.width / 3, this.height / 2 - wheelHeight + 2, wheelWidth, wheelHeight);

        // Boost flames
        if (this.isBoosting) {
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, -5);
            ctx.lineTo(-this.width / 2 - 20 - Math.random() * 10, 0);
            ctx.lineTo(-this.width / 2, 5);
            ctx.fill();

            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, -3);
            ctx.lineTo(-this.width / 2 - 10 - Math.random() * 5, 0);
            ctx.lineTo(-this.width / 2, 3);
            ctx.fill();
        }

        // Drift sparks
        if (this.isDrifting) {
            ctx.fillStyle = '#ffff00';
            for (let i = 0; i < 3; i++) {
                const sparkX = -this.width / 2 + Math.random() * 10;
                const sparkY = (Math.random() - 0.5) * this.height;
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
        ctx.globalAlpha = 1;

        // Name tag (for other players/AI)
        if (!this.isPlayer) {
            ctx.font = 'bold 12px Rajdhani';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(this.name, screenX + 1, screenY - this.radius - 9);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(this.name, screenX, screenY - this.radius - 10);
        }

        // Health bar (when damaged)
        if (this.health < this.maxHealth) {
            const barWidth = 40;
            const barHeight = 5;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(screenX - barWidth / 2, screenY + this.radius + 5, barWidth, barHeight);

            ctx.fillStyle = healthPercent > 0.3 ? '#4caf50' : '#f44336';
            ctx.fillRect(screenX - barWidth / 2, screenY + this.radius + 5,
                barWidth * healthPercent, barHeight);
        }
    }

    /**
     * Render tire marks
     */
    renderTireMarks(ctx, camera) {
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        for (let i = 1; i < this.tireMarks.length; i++) {
            const prev = this.tireMarks[i - 1];
            const curr = this.tireMarks[i];

            // Fade old marks
            curr.alpha *= 0.995;

            if (curr.alpha < 0.1) {
                this.tireMarks.splice(i, 1);
                i--;
                continue;
            }

            ctx.globalAlpha = curr.alpha * 0.5;
            ctx.beginPath();
            ctx.moveTo(prev.x - camera.x, prev.y - camera.y);
            ctx.lineTo(curr.x - camera.x, curr.y - camera.y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }
}

// Export
window.Kart = Kart;
