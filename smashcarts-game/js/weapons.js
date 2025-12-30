/**
 * SMASH KARTS - Weapons System
 * Handles all weapon types, projectiles, and combat mechanics
 */

// Weapon definitions
const WEAPONS = {
    machinegun: {
        name: 'Machine Gun',
        icon: '🔫',
        damage: 8,
        ammo: 30,
        fireRate: 10,          // shots per second
        projectileSpeed: 800,
        projectileSize: 5,
        spread: 5,             // degrees
        range: 600,
        knockback: 20,
        color: '#ffeb3b',
        sound: 'machinegun_fire'
    },
    rocket: {
        name: 'Rocket Launcher',
        icon: '🚀',
        damage: 40,
        ammo: 4,
        fireRate: 0.8,
        projectileSpeed: 500,
        projectileSize: 12,
        spread: 0,
        range: 1000,
        knockback: 200,
        explosive: true,
        explosionRadius: 80,
        color: '#ff6b35',
        sound: 'rocket_fire'
    },
    shotgun: {
        name: 'Shotgun',
        icon: '💥',
        damage: 12,
        ammo: 6,
        fireRate: 1.2,
        projectileSpeed: 700,
        projectileSize: 6,
        spread: 25,
        projectileCount: 6,
        range: 350,
        knockback: 80,
        color: '#ff9800',
        sound: 'shotgun_fire'
    },
    laser: {
        name: 'Laser',
        icon: '⚡',
        damage: 15,
        ammo: 20,
        fireRate: 5,
        projectileSpeed: 1500,
        projectileSize: 4,
        spread: 0,
        range: 800,
        knockback: 10,
        penetrating: true,
        color: '#00ffff',
        sound: 'laser_fire'
    },
    mine: {
        name: 'Mine Layer',
        icon: '💣',
        damage: 50,
        ammo: 3,
        fireRate: 1,
        type: 'deployable',
        deploySpeed: 100,
        explosionRadius: 80,
        armTime: 1,            // seconds until active
        lifetime: 30,          // seconds until despawn
        color: '#f44336',
        sound: 'mine_deploy'
    }
};

/**
 * Projectile class
 */
class Projectile {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.vx = options.vx;
        this.vy = options.vy;
        this.rotation = options.rotation || Math.atan2(options.vy, options.vx);

        this.owner = options.owner;
        this.weaponType = options.weaponType;
        this.damage = options.damage;
        this.knockback = options.knockback || 0;
        this.speed = options.speed;
        this.size = options.size;
        this.range = options.range;
        this.color = options.color;
        this.explosive = options.explosive || false;
        this.explosionRadius = options.explosionRadius || 0;
        this.penetrating = options.penetrating || false;

        this.distanceTraveled = 0;
        this.active = true;
        this.hitEntities = new Set();

        // Trail effect
        this.trail = [];
        this.maxTrailLength = 10;
    }

    update(deltaTime) {
        if (!this.active) return;

        // Store previous position for trail
        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }

        // Move projectile
        const moveX = this.vx * deltaTime;
        const moveY = this.vy * deltaTime;

        this.x += moveX;
        this.y += moveY;

        this.distanceTraveled += Math.sqrt(moveX * moveX + moveY * moveY);

        // Check if out of range
        if (this.distanceTraveled >= this.range) {
            this.destroy();
        }
    }

    onHit(target) {
        // Don't hit same target twice (for penetrating projectiles)
        if (this.hitEntities.has(target)) return false;

        this.hitEntities.add(target);

        if (!this.penetrating) {
            this.destroy();
        }

        return true;
    }

    destroy() {
        this.active = false;
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Render trail
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);

            this.trail.forEach((point, i) => {
                const alpha = 1 - i / this.trail.length;
                ctx.lineTo(point.x - camera.x, point.y - camera.y);
            });

            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size * 0.5;
            ctx.globalAlpha = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Render projectile
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);

        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.fillStyle = this.color;
        ctx.beginPath();

        if (this.weaponType === 'rocket') {
            // Rocket shape
            ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.7, 0, 0, Math.PI * 2);
        } else if (this.weaponType === 'laser') {
            // Laser beam
            ctx.rect(-this.size * 2, -this.size / 2, this.size * 4, this.size);
        } else {
            // Default circle
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

/**
 * Mine class (deployable weapon)
 */
class Mine {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.owner = options.owner;
        this.damage = options.damage;
        this.explosionRadius = options.explosionRadius;
        this.armTime = options.armTime || 1;
        this.lifetime = options.lifetime || 30;

        this.age = 0;
        this.armed = false;
        this.active = true;
        this.size = 15;
        this.pulseTime = 0;
    }

    update(deltaTime) {
        if (!this.active) return;

        this.age += deltaTime;
        this.pulseTime += deltaTime;

        // Arm the mine
        if (!this.armed && this.age >= this.armTime) {
            this.armed = true;
            Audio.play('mine_deploy', { volume: 0.3 });
        }

        // Lifetime expiry
        if (this.age >= this.lifetime) {
            this.destroy();
        }
    }

    trigger() {
        if (!this.armed || !this.active) return false;
        this.active = false;
        return true;
    }

    destroy() {
        this.active = false;
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Mine body
        ctx.fillStyle = this.armed ? '#f44336' : '#888888';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Spikes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
            ctx.lineTo(Math.cos(angle) * (this.size + 5), Math.sin(angle) * (this.size + 5));
            ctx.stroke();
        }

        // Blinking light when armed
        if (this.armed) {
            const pulseIntensity = (Math.sin(this.pulseTime * 10) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 0, ${pulseIntensity})`;
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

/**
 * Weapon pickup class
 */
class WeaponPickup {
    constructor(x, y, weaponType) {
        this.x = x;
        this.y = y;
        this.weaponType = weaponType;
        this.weapon = WEAPONS[weaponType];
        this.active = true;
        this.size = 25;
        this.bobOffset = 0;
        this.rotation = 0;
        this.respawnTime = 15; // seconds
    }

    update(deltaTime) {
        if (!this.active) return;

        this.bobOffset = Math.sin(Date.now() * 0.003) * 5;
        this.rotation += deltaTime * 2;
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
        ctx.rotate(this.rotation * 0.3);

        // Glow effect
        ctx.shadowColor = this.weapon.color;
        ctx.shadowBlur = 15;

        // Background circle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = this.weapon.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Icon
        ctx.shadowBlur = 0;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.weapon.icon, 0, 0);

        ctx.restore();
    }
}

/**
 * Explosion effect class
 */
class Explosion {
    constructor(x, y, radius, damage, owner = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxRadius = radius;
        this.damage = damage;
        this.owner = owner;

        this.age = 0;
        this.duration = 0.3;
        this.active = true;
        this.damageApplied = false;

        // Particles
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Utils.random(100, 300);
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Utils.random(3, 8),
                life: 1
            });
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        this.age += deltaTime;

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life -= deltaTime * 3;
        });

        this.particles = this.particles.filter(p => p.life > 0);

        if (this.age >= this.duration) {
            this.active = false;
        }
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const progress = this.age / this.duration;

        // Explosion ring
        ctx.save();
        ctx.translate(screenX, screenY);

        const currentRadius = this.maxRadius * Math.min(progress * 2, 1);
        const alpha = 1 - progress;

        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
        gradient.addColorStop(0, `rgba(255, 200, 50, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 50, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Particles
        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(255, 150, 50, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x - camera.x, p.y - camera.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

/**
 * Weapons manager
 */
class WeaponsManager {
    constructor() {
        this.projectiles = [];
        this.mines = [];
        this.pickups = [];
        this.explosions = [];

        this.spawnTimer = 0;
        this.spawnInterval = 10; // seconds between weapon spawns
    }

    /**
     * Fire a weapon
     */
    fire(kart, weaponType) {
        const weapon = WEAPONS[weaponType];
        if (!weapon) return false;

        if (weapon.type === 'deployable') {
            return this.deployMine(kart, weapon);
        }

        const projectileCount = weapon.projectileCount || 1;

        for (let i = 0; i < projectileCount; i++) {
            // Calculate spread
            let spreadAngle = 0;
            if (weapon.spread > 0) {
                if (projectileCount > 1) {
                    spreadAngle = Utils.degToRad(weapon.spread) *
                        ((i / (projectileCount - 1)) - 0.5) * 2;
                } else {
                    spreadAngle = Utils.degToRad(Utils.random(-weapon.spread, weapon.spread));
                }
            }

            const angle = kart.rotation + spreadAngle;
            const speed = weapon.projectileSpeed;

            // Spawn position (front of kart)
            const spawnDist = kart.width / 2 + weapon.projectileSize;
            const spawnX = kart.x + Math.cos(kart.rotation) * spawnDist;
            const spawnY = kart.y + Math.sin(kart.rotation) * spawnDist;

            const projectile = new Projectile({
                x: spawnX,
                y: spawnY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: angle,
                owner: kart,
                weaponType: weaponType,
                damage: weapon.damage,
                knockback: weapon.knockback,
                speed: speed,
                size: weapon.projectileSize,
                range: weapon.range,
                color: weapon.color,
                explosive: weapon.explosive,
                explosionRadius: weapon.explosionRadius,
                penetrating: weapon.penetrating
            });

            this.projectiles.push(projectile);
        }

        // Play sound
        Audio.play(weapon.sound);

        return true;
    }

    /**
     * Deploy a mine
     */
    deployMine(kart, weapon) {
        // Deploy behind the kart
        const spawnDist = kart.height / 2 + 20;
        const spawnX = kart.x - Math.cos(kart.rotation) * spawnDist;
        const spawnY = kart.y - Math.sin(kart.rotation) * spawnDist;

        const mine = new Mine({
            x: spawnX,
            y: spawnY,
            owner: kart,
            damage: weapon.damage,
            explosionRadius: weapon.explosionRadius,
            armTime: weapon.armTime,
            lifetime: weapon.lifetime
        });

        this.mines.push(mine);
        Audio.play(weapon.sound);

        return true;
    }

    /**
     * Create an explosion
     */
    createExplosion(x, y, radius, damage, owner = null) {
        const explosion = new Explosion(x, y, radius, damage, owner);
        this.explosions.push(explosion);
        Audio.play('rocket_explode');
        return explosion;
    }

    /**
     * Spawn weapon pickup
     */
    spawnWeaponPickup(x, y, weaponType = null) {
        if (!weaponType) {
            // Random weapon
            const types = Object.keys(WEAPONS);
            weaponType = Utils.randomChoice(types);
        }

        const pickup = new WeaponPickup(x, y, weaponType);
        this.pickups.push(pickup);
        Audio.play('powerup_spawn', { volume: 0.3 });

        return pickup;
    }

    /**
     * Update all weapons
     */
    update(deltaTime, arena) {
        // Update projectiles
        this.projectiles.forEach(p => p.update(deltaTime));
        this.projectiles = this.projectiles.filter(p => p.active);

        // Check projectile-wall collisions
        this.projectiles.forEach(projectile => {
            const wallHit = arena.checkWallCollision({
                x: projectile.x,
                y: projectile.y,
                width: projectile.size * 2,
                height: projectile.size * 2
            });

            if (wallHit) {
                if (projectile.explosive) {
                    this.createExplosion(
                        projectile.x,
                        projectile.y,
                        projectile.explosionRadius,
                        projectile.damage,
                        projectile.owner
                    );
                }
                projectile.destroy();
            }

            // Check obstacle collision
            const obstacleHit = arena.checkObstacleCollision({
                x: projectile.x,
                y: projectile.y,
                radius: projectile.size
            });

            if (obstacleHit) {
                arena.damageObstacle(obstacleHit, projectile.damage, projectile.owner);
                if (projectile.explosive) {
                    this.createExplosion(
                        projectile.x,
                        projectile.y,
                        projectile.explosionRadius,
                        projectile.damage,
                        projectile.owner
                    );
                }
                if (!projectile.penetrating) {
                    projectile.destroy();
                }
            }
        });

        // Update mines
        this.mines.forEach(m => m.update(deltaTime));
        this.mines = this.mines.filter(m => m.active);

        // Update pickups
        this.pickups.forEach(p => p.update(deltaTime));
        this.pickups = this.pickups.filter(p => p.active);

        // Update explosions
        this.explosions.forEach(e => e.update(deltaTime));
        this.explosions = this.explosions.filter(e => e.active);

        // Spawn timer
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.pickups.length < 8) {
            const spawnPoint = arena.getRandomWeaponSpawn();
            this.spawnWeaponPickup(spawnPoint.x, spawnPoint.y);
            this.spawnTimer = 0;
        }
    }

    /**
     * Check projectile hits against karts
     */
    checkProjectileHits(karts) {
        const hits = [];

        this.projectiles.forEach(projectile => {
            if (!projectile.active) return;

            karts.forEach(kart => {
                if (!kart.alive) return;
                if (kart === projectile.owner) return;

                const dist = Utils.distance(projectile, kart);
                if (dist < projectile.size + kart.radius) {
                    if (projectile.onHit(kart)) {
                        hits.push({
                            projectile,
                            target: kart,
                            damage: projectile.damage,
                            knockback: projectile.knockback
                        });

                        if (projectile.explosive) {
                            this.createExplosion(
                                projectile.x,
                                projectile.y,
                                projectile.explosionRadius,
                                projectile.damage,
                                projectile.owner
                            );
                        }
                    }
                }
            });
        });

        return hits;
    }

    /**
     * Check mine triggers
     */
    checkMineTriggers(karts) {
        const triggers = [];

        this.mines.forEach(mine => {
            if (!mine.active || !mine.armed) return;

            karts.forEach(kart => {
                if (!kart.alive) return;
                if (kart === mine.owner) return;

                const dist = Utils.distance(mine, kart);
                if (dist < mine.size + kart.radius + 10) {
                    if (mine.trigger()) {
                        triggers.push({
                            mine,
                            trigger: kart
                        });

                        // Create explosion
                        this.createExplosion(
                            mine.x,
                            mine.y,
                            mine.explosionRadius,
                            mine.damage,
                            mine.owner
                        );
                    }
                }
            });
        });

        return triggers;
    }

    /**
     * Check explosion damage
     */
    checkExplosionDamage(karts) {
        const damages = [];

        this.explosions.forEach(explosion => {
            if (explosion.damageApplied) return;
            explosion.damageApplied = true;

            karts.forEach(kart => {
                if (!kart.alive) return;

                const dist = Utils.distance(explosion, kart);
                if (dist < explosion.maxRadius + kart.radius) {
                    // Damage falloff based on distance
                    const falloff = 1 - (dist / (explosion.maxRadius + kart.radius));
                    const damage = explosion.damage * falloff;

                    damages.push({
                        explosion,
                        target: kart,
                        damage: damage,
                        knockback: 150 * falloff
                    });
                }
            });
        });

        return damages;
    }

    /**
     * Check pickup collisions
     */
    checkPickupCollisions(karts) {
        const collected = [];

        this.pickups.forEach(pickup => {
            if (!pickup.active) return;

            karts.forEach(kart => {
                if (!kart.alive) return;
                if (kart.weapon && !kart.isPlayer) return; // AI doesn't pick up if has weapon

                const dist = Utils.distance(pickup, kart);
                if (dist < pickup.size + kart.radius) {
                    if (pickup.collect()) {
                        collected.push({
                            pickup,
                            collector: kart,
                            weaponType: pickup.weaponType
                        });
                    }
                }
            });
        });

        return collected;
    }

    /**
     * Render all weapons
     */
    render(ctx, camera) {
        // Render pickups
        this.pickups.forEach(p => p.render(ctx, camera));

        // Render mines
        this.mines.forEach(m => m.render(ctx, camera));

        // Render projectiles
        this.projectiles.forEach(p => p.render(ctx, camera));

        // Render explosions
        this.explosions.forEach(e => e.render(ctx, camera));
    }

    /**
     * Clear all weapons
     */
    clear() {
        this.projectiles = [];
        this.mines = [];
        this.pickups = [];
        this.explosions = [];
        this.spawnTimer = 0;
    }
}

// Export
window.WEAPONS = WEAPONS;
window.WeaponsManager = WeaponsManager;
