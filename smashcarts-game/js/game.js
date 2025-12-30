/**
 * SMASH KARTS - Main Game Logic
 * Core game loop, state management, and gameplay systems
 */

class Game {
    constructor() {
        // Canvas setup
        this.canvas = Utils.$('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.state = 'menu'; // menu, playing, paused, gameover
        this.mode = 'deathmatch'; // deathmatch, laststanding
        this.difficulty = 'medium';
        this.aiCount = 4;
        this.selectedMap = 'tropical';

        // Time
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        this.matchDuration = 180; // 3 minutes
        this.timeRemaining = this.matchDuration;

        // Camera
        this.camera = { x: 0, y: 0 };

        // Game objects
        this.arena = null;
        this.player = null;
        this.aiKarts = [];
        this.weaponsManager = null;
        this.powerupsManager = null;
        this.hud = null;

        // Particles
        this.particles = [];

        // Settings
        this.settings = {
            screenShake: true,
            particleQuality: 'medium'
        };

        // Screen shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;

        // Reference for global access
        window.Game = { instance: this };

        // Initialize
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Start a new game
     */
    start() {
        // Create arena using ThemedArena if available, otherwise fallback to Arena
        if (typeof ThemedArena !== 'undefined') {
            this.arena = new ThemedArena(this.selectedMap);
        } else {
            this.arena = new Arena(2000, 1500);
        }

        // Create managers
        this.weaponsManager = new WeaponsManager();
        this.powerupsManager = new PowerUpsManager();
        this.hud = new HUD();

        // Create player
        const playerSpawn = this.arena.getRandomSpawnPoint();
        this.player = new Kart({
            x: playerSpawn.x,
            y: playerSpawn.y,
            rotation: Math.random() * Math.PI * 2,
            name: 'Player',
            color: '#ff6b35',
            isPlayer: true
        });

        // Create AI karts
        this.aiKarts = createAIKarts(this.aiCount, this.difficulty, this.arena);

        // Reset time
        this.gameTime = 0;
        this.timeRemaining = this.matchDuration;

        // Reset managers
        this.weaponsManager.clear();
        this.powerupsManager.clear();
        this.hud.reset();
        this.particles = [];

        // Spawn initial weapons and powerups
        const spawnCount = Math.min(6, Math.floor(this.arena.weaponSpawnPoints?.length || 4));
        for (let i = 0; i < spawnCount; i++) {
            const weaponSpawn = this.arena.getRandomWeaponSpawn();
            this.weaponsManager.spawnWeaponPickup(weaponSpawn.x, weaponSpawn.y);

            const powerupSpawn = this.arena.getRandomPowerUpSpawn();
            this.powerupsManager.spawnPowerUp(powerupSpawn.x, powerupSpawn.y);
        }

        // Set game state
        this.state = 'playing';

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (this.state === 'menu' || this.state === 'gameover') return;

        // Calculate delta time
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        if (this.state === 'playing') {
            this.update(this.deltaTime);
        }

        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        // Update game time
        this.gameTime += deltaTime;
        this.timeRemaining -= deltaTime;

        // Check time limit
        if (this.timeRemaining <= 0) {
            this.endMatch();
            return;
        }

        // Update player
        if (this.player.alive) {
            this.player.update(deltaTime);
        } else if (this.mode === 'deathmatch' && this.player.respawnTimer <= 0) {
            // Respawn player in deathmatch
            const spawn = this.arena.getBestSpawnPoint(this.getAllKarts());
            this.player.respawn(spawn.x, spawn.y);
        } else if (this.mode === 'laststanding') {
            // Check if player is eliminated in last standing
            this.checkLastStandingWin();
        }

        // Update AI karts
        this.aiKarts.forEach(kart => {
            if (kart.alive) {
                // Update AI controller
                if (kart.aiController) {
                    kart.aiController.update(deltaTime, this.getGameState());
                }
                kart.update(deltaTime);
            } else if (this.mode === 'deathmatch' && kart.respawnTimer <= 0) {
                // Respawn AI in deathmatch
                const spawn = this.arena.getBestSpawnPoint(this.getAllKarts());
                kart.respawn(spawn.x, spawn.y);
            }
        });

        // Handle player firing
        if (this.player.alive && this.player.input.fire && this.player.canFire()) {
            if (this.player.fire()) {
                this.weaponsManager.fire(this.player, this.player.weaponType);
            }
        }

        // Handle AI firing
        this.aiKarts.forEach(kart => {
            if (kart.alive && kart.input.fire && kart.canFire()) {
                if (kart.fire()) {
                    this.weaponsManager.fire(kart, kart.weaponType);
                }
                kart.input.fire = false;
            }
        });

        // Update weapons
        this.weaponsManager.update(deltaTime, this.arena);

        // Update powerups
        this.powerupsManager.update(deltaTime, this.arena);

        // Check collisions
        this.checkCollisions();

        // Update particles
        this.updateParticles(deltaTime);

        // Update camera
        this.updateCamera();

        // Update screen shake
        this.updateScreenShake(deltaTime);

        // Update HUD
        this.hud.update(this.player, this.getGameState(), deltaTime);
    }

    /**
     * Check all collisions
     */
    checkCollisions() {
        const allKarts = this.getAllKarts();

        // Kart vs kart
        for (let i = 0; i < allKarts.length; i++) {
            for (let j = i + 1; j < allKarts.length; j++) {
                const collision = allKarts[i].checkKartCollision(allKarts[j]);
                if (collision) {
                    allKarts[i].resolveKartCollision(allKarts[j], collision);
                }
            }
        }

        // Kart vs walls
        allKarts.forEach(kart => {
            if (!kart.alive) return;

            const wall = this.arena.checkWallCollision({
                x: kart.x,
                y: kart.y,
                width: kart.width,
                height: kart.height
            });

            if (wall) {
                const wasHard = this.arena.resolveWallCollision(kart, wall);
                if (wasHard) {
                    this.createImpactParticles(kart.x, kart.y);
                }
            }

            // Kart vs obstacles
            const obstacle = this.arena.checkObstacleCollision(kart);
            if (obstacle) {
                // Push kart away from obstacle
                const pushDir = Utils.vecNormalize(Utils.vecSub(kart, obstacle));
                kart.x += pushDir.x * 5;
                kart.y += pushDir.y * 5;
                kart.vx = pushDir.x * 50;
                kart.vy = pushDir.y * 50;

                // Damage obstacle if moving fast
                if (kart.getSpeed() > 200) {
                    this.arena.damageObstacle(obstacle, 10, kart);
                }
            }
        });

        // Projectile hits
        const hits = this.weaponsManager.checkProjectileHits(allKarts);
        hits.forEach(hit => {
            const damage = hit.damage * (hit.projectile.owner?.damageMultiplier || 1);
            hit.target.takeDamage(damage, hit.projectile.owner);

            // Apply knockback
            const knockbackDir = Utils.vecNormalize({
                x: hit.projectile.vx,
                y: hit.projectile.vy
            });
            hit.target.applyKnockback(knockbackDir, hit.knockback);

            // Check for kill
            if (!hit.target.alive && hit.projectile.owner) {
                this.onKill(hit.projectile.owner, hit.target, hit.projectile.owner.weapon);
            }

            this.createImpactParticles(hit.target.x, hit.target.y);
            this.screenShake(0.2);
        });

        // Mine triggers
        const mineTriggers = this.weaponsManager.checkMineTriggers(allKarts);
        mineTriggers.forEach(trigger => {
            this.screenShake(0.5);
        });

        // Explosion damage
        const explosionDamage = this.weaponsManager.checkExplosionDamage(allKarts);
        explosionDamage.forEach(dmg => {
            const owner = dmg.explosion.owner;
            const actualDamage = dmg.target.takeDamage(dmg.damage, owner);

            // Apply knockback
            const knockbackDir = Utils.vecNormalize(Utils.vecSub(dmg.target, dmg.explosion));
            dmg.target.applyKnockback(knockbackDir, dmg.knockback);

            // Check for kill
            if (!dmg.target.alive && owner && owner !== dmg.target) {
                this.onKill(owner, dmg.target, owner.weapon);
            }
        });

        // Weapon pickups
        const weaponCollected = this.weaponsManager.checkPickupCollisions(allKarts);
        weaponCollected.forEach(collected => {
            collected.collector.setWeapon(collected.weaponType);
        });

        // Powerup pickups
        const powerupCollected = this.powerupsManager.checkCollisions(allKarts);
        powerupCollected.forEach(collected => {
            this.powerupsManager.applyPowerUp(collected.collector, collected.powerUpType);
        });
    }

    /**
     * Handle kill event
     */
    onKill(killer, victim, weapon) {
        // Add to kill feed
        this.hud.addKill(killer, victim, weapon);

        // Show announcement for player
        if (killer.isPlayer) {
            if (killer.kills === 1) {
                this.hud.showAnnouncement('FIRST BLOOD!', 'first-blood');
            } else if (killer.kills % 5 === 0) {
                this.hud.showAnnouncement(`${killer.kills} KILLS!`, 'kill-streak');
            }
        }

        // Track damage dealt
        killer.damageDealt += victim.maxHealth;

        // Check last standing win
        if (this.mode === 'laststanding') {
            this.checkLastStandingWin();
        }
    }

    /**
     * Check for last standing win condition
     */
    checkLastStandingWin() {
        const aliveKarts = this.getAllKarts().filter(k => k.alive);

        if (aliveKarts.length <= 1) {
            if (aliveKarts.length === 1) {
                const winner = aliveKarts[0];
                if (winner.isPlayer) {
                    this.hud.showAnnouncement('VICTORY!', 'victory');
                } else {
                    this.hud.showAnnouncement('DEFEAT', 'defeat');
                }
            }

            setTimeout(() => this.endMatch(), 2000);
        }
    }

    /**
     * End the match
     */
    endMatch() {
        this.state = 'gameover';

        // Calculate final standings
        const allKarts = this.getAllKarts();
        allKarts.sort((a, b) => {
            if (this.mode === 'deathmatch') {
                return b.kills - a.kills;
            } else {
                // Last standing - alive first, then by kills
                if (a.alive !== b.alive) return b.alive - a.alive;
                return b.kills - a.kills;
            }
        });

        // Get player position
        const playerPosition = allKarts.findIndex(k => k.isPlayer) + 1;
        const positionSuffix = ['st', 'nd', 'rd'][playerPosition - 1] || 'th';

        // Update game over screen
        const title = Utils.$('gameover-title');
        if (playerPosition === 1) {
            title.textContent = 'VICTORY!';
            title.className = 'victory';
        } else {
            title.textContent = 'GAME OVER';
            title.className = 'defeat';
        }

        Utils.$('final-position').textContent = `${playerPosition}${positionSuffix}`;
        Utils.$('final-kills').textContent = this.player.kills;
        Utils.$('final-deaths').textContent = this.player.deaths;
        Utils.$('final-damage').textContent = Math.round(this.player.damageDealt);

        // Show game over screen
        Utils.hide('game-screen');
        Utils.show('gameover-screen');
    }

    /**
     * Update camera to follow player
     */
    updateCamera() {
        if (!this.player) return;

        // Target position (centered on player)
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height / 2;

        // Smooth follow
        this.camera.x = Utils.lerp(this.camera.x, targetX, 0.1);
        this.camera.y = Utils.lerp(this.camera.y, targetY, 0.1);

        // Clamp to arena bounds
        this.camera.x = Utils.clamp(this.camera.x, 0, this.arena.width - this.canvas.width);
        this.camera.y = Utils.clamp(this.camera.y, 0, this.arena.height - this.canvas.height);

        // Apply screen shake
        if (this.shakeIntensity > 0) {
            this.camera.x += (Math.random() - 0.5) * this.shakeIntensity * 20;
            this.camera.y += (Math.random() - 0.5) * this.shakeIntensity * 20;
        }
    }

    /**
     * Screen shake effect
     */
    screenShake(intensity) {
        if (!this.settings.screenShake) return;
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
        this.shakeDuration = 0.3;
    }

    /**
     * Update screen shake
     */
    updateScreenShake(deltaTime) {
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
            this.shakeIntensity *= 0.9;
        } else {
            this.shakeIntensity = 0;
        }
    }

    /**
     * Create explosion for external use
     */
    createExplosion(x, y, radius, damage, owner) {
        return this.weaponsManager.createExplosion(x, y, radius, damage, owner);
    }

    /**
     * Create impact particles
     */
    createImpactParticles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                size: Utils.random(2, 5),
                color: `hsl(${Utils.random(20, 50)}, 100%, 50%)`,
                life: 1,
                decay: Utils.random(1, 3)
            });
        }
    }

    /**
     * Update particles
     */
    updateParticles(deltaTime) {
        this.particles.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay * deltaTime;
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }

    /**
     * Render game
     */
    render() {
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render arena
        this.arena.render(ctx, this.camera);

        // Render tire marks
        this.getAllKarts().forEach(kart => {
            kart.renderTireMarks(ctx, this.camera);
        });

        // Render powerups
        this.powerupsManager.render(ctx, this.camera);

        // Render weapons (pickups, projectiles, explosions)
        this.weaponsManager.render(ctx, this.camera);

        // Render particles
        this.renderParticles(ctx);

        // Render karts
        this.aiKarts.forEach(kart => {
            if (kart.alive) kart.render(ctx, this.camera);
        });

        if (this.player.alive) {
            this.player.render(ctx, this.camera);
        }
    }

    /**
     * Render particles
     */
    renderParticles(ctx) {
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x - this.camera.x, p.y - this.camera.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    /**
     * Get all karts
     */
    getAllKarts() {
        return [this.player, ...this.aiKarts];
    }

    /**
     * Get game state for AI
     */
    getGameState() {
        return {
            player: this.player,
            karts: this.aiKarts,
            allKarts: this.getAllKarts(),
            arena: this.arena,
            weapons: this.weaponsManager.pickups,
            powerups: this.powerupsManager.pickups,
            projectiles: this.weaponsManager.projectiles,
            mines: this.weaponsManager.mines,
            camera: this.camera,
            timeRemaining: this.timeRemaining
        };
    }

    /**
     * Pause game
     */
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            Utils.show('pause-menu');
        }
    }

    /**
     * Resume game
     */
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            Utils.hide('pause-menu');
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    /**
     * Restart game
     */
    restart() {
        Utils.hide('pause-menu');
        this.start();
    }

    /**
     * Quit to menu
     */
    quit() {
        this.state = 'menu';
        Utils.hide('game-screen');
        Utils.hide('pause-menu');
        Utils.show('menu-screen');
    }
}

// Export
window.Game = Game;
