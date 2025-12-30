/**
 * SMASH KARTS - Arena System
 * Handles arena layout, obstacles, walls, and collision boundaries
 */

class Arena {
    constructor(width = 2000, height = 1500) {
        this.width = width;
        this.height = height;

        // Arena boundaries (walls)
        this.walls = [];

        // Obstacles (destructible and static)
        this.obstacles = [];

        // Power-up spawn points
        this.powerUpSpawnPoints = [];

        // Weapon spawn points
        this.weaponSpawnPoints = [];

        // Player spawn points
        this.spawnPoints = [];

        // Visual theme
        this.theme = {
            backgroundColor: '#0a0a1a',
            gridColor: 'rgba(78, 205, 196, 0.1)',
            wallColor: '#4ecdc4',
            obstacleColor: '#ff6b35'
        };

        // Initialize arena layout
        this.initialize();
    }

    /**
     * Initialize arena with default layout
     */
    initialize() {
        // Create boundary walls
        this.createBoundaryWalls();

        // Create obstacle layout
        this.createObstacles();

        // Create spawn points
        this.createSpawnPoints();

        // Create power-up spawn locations
        this.createPowerUpSpawnPoints();
    }

    /**
     * Create arena boundary walls
     */
    createBoundaryWalls() {
        const wallThickness = 30;

        // Top wall
        this.walls.push({
            x: 0,
            y: 0,
            width: this.width,
            height: wallThickness,
            type: 'boundary'
        });

        // Bottom wall
        this.walls.push({
            x: 0,
            y: this.height - wallThickness,
            width: this.width,
            height: wallThickness,
            type: 'boundary'
        });

        // Left wall
        this.walls.push({
            x: 0,
            y: 0,
            width: wallThickness,
            height: this.height,
            type: 'boundary'
        });

        // Right wall
        this.walls.push({
            x: this.width - wallThickness,
            y: 0,
            width: wallThickness,
            height: this.height,
            type: 'boundary'
        });

        // Add some inner walls for cover
        this.walls.push(
            // Center cross walls
            { x: this.width / 2 - 150, y: 200, width: 300, height: 20, type: 'inner' },
            { x: this.width / 2 - 150, y: this.height - 220, width: 300, height: 20, type: 'inner' },

            // Side walls
            { x: 400, y: this.height / 2 - 100, width: 20, height: 200, type: 'inner' },
            { x: this.width - 420, y: this.height / 2 - 100, width: 20, height: 200, type: 'inner' },

            // Corner walls
            { x: 200, y: 200, width: 100, height: 20, type: 'inner' },
            { x: 200, y: 180, width: 20, height: 120, type: 'inner' },

            { x: this.width - 300, y: 200, width: 100, height: 20, type: 'inner' },
            { x: this.width - 220, y: 180, width: 20, height: 120, type: 'inner' },

            { x: 200, y: this.height - 220, width: 100, height: 20, type: 'inner' },
            { x: 200, y: this.height - 300, width: 20, height: 120, type: 'inner' },

            { x: this.width - 300, y: this.height - 220, width: 100, height: 20, type: 'inner' },
            { x: this.width - 220, y: this.height - 300, width: 20, height: 120, type: 'inner' }
        );
    }

    /**
     * Create destructible and static obstacles
     */
    createObstacles() {
        // Crates (destructible)
        const cratePositions = [
            { x: 300, y: 400 },
            { x: 500, y: 600 },
            { x: 700, y: 300 },
            { x: this.width - 350, y: 400 },
            { x: this.width - 550, y: 600 },
            { x: this.width - 750, y: 300 },
            { x: 300, y: this.height - 450 },
            { x: 500, y: this.height - 650 },
            { x: this.width - 350, y: this.height - 450 },
            { x: this.width - 550, y: this.height - 650 },
            { x: this.width / 2 - 100, y: this.height / 2 - 50 },
            { x: this.width / 2 + 50, y: this.height / 2 + 30 }
        ];

        cratePositions.forEach(pos => {
            this.obstacles.push({
                x: pos.x,
                y: pos.y,
                width: 50,
                height: 50,
                type: 'crate',
                destructible: true,
                health: 30,
                maxHealth: 30
            });
        });

        // Barrels (destructible, explosive)
        const barrelPositions = [
            { x: 600, y: 450 },
            { x: this.width - 650, y: 450 },
            { x: this.width / 2, y: 500 },
            { x: this.width / 2, y: this.height - 550 }
        ];

        barrelPositions.forEach(pos => {
            this.obstacles.push({
                x: pos.x,
                y: pos.y,
                width: 40,
                height: 40,
                type: 'barrel',
                destructible: true,
                explosive: true,
                health: 20,
                maxHealth: 20,
                explosionRadius: 100,
                explosionDamage: 30
            });
        });

        // Pillars (indestructible)
        const pillarPositions = [
            { x: this.width / 2 - 200, y: this.height / 2 },
            { x: this.width / 2 + 160, y: this.height / 2 },
            { x: 600, y: 800 },
            { x: this.width - 640, y: 800 }
        ];

        pillarPositions.forEach(pos => {
            this.obstacles.push({
                x: pos.x,
                y: pos.y,
                width: 60,
                height: 60,
                type: 'pillar',
                destructible: false
            });
        });
    }

    /**
     * Create player spawn points
     */
    createSpawnPoints() {
        this.spawnPoints = [
            { x: 150, y: 150 },
            { x: this.width - 150, y: 150 },
            { x: 150, y: this.height - 150 },
            { x: this.width - 150, y: this.height - 150 },
            { x: this.width / 2, y: 150 },
            { x: this.width / 2, y: this.height - 150 },
            { x: 150, y: this.height / 2 },
            { x: this.width - 150, y: this.height / 2 },
            { x: this.width / 4, y: this.height / 4 },
            { x: this.width * 3 / 4, y: this.height / 4 },
            { x: this.width / 4, y: this.height * 3 / 4 },
            { x: this.width * 3 / 4, y: this.height * 3 / 4 }
        ];
    }

    /**
     * Create power-up spawn locations
     */
    createPowerUpSpawnPoints() {
        this.powerUpSpawnPoints = [
            { x: this.width / 2, y: this.height / 2 },
            { x: this.width / 4, y: this.height / 2 },
            { x: this.width * 3 / 4, y: this.height / 2 },
            { x: this.width / 2, y: this.height / 4 },
            { x: this.width / 2, y: this.height * 3 / 4 },
            { x: 250, y: 350 },
            { x: this.width - 290, y: 350 },
            { x: 250, y: this.height - 390 },
            { x: this.width - 290, y: this.height - 390 },
            { x: this.width / 4, y: this.height / 4 },
            { x: this.width * 3 / 4, y: this.height / 4 },
            { x: this.width / 4, y: this.height * 3 / 4 },
            { x: this.width * 3 / 4, y: this.height * 3 / 4 }
        ];

        this.weaponSpawnPoints = [
            { x: this.width / 2, y: this.height / 3 },
            { x: this.width / 2, y: this.height * 2 / 3 },
            { x: this.width / 3, y: this.height / 2 },
            { x: this.width * 2 / 3, y: this.height / 2 },
            { x: 350, y: 250 },
            { x: this.width - 390, y: 250 },
            { x: 350, y: this.height - 290 },
            { x: this.width - 390, y: this.height - 290 }
        ];
    }

    /**
     * Get a random spawn point
     */
    getRandomSpawnPoint() {
        return Utils.randomChoice(this.spawnPoints);
    }

    /**
     * Get spawn point furthest from all karts
     */
    getBestSpawnPoint(karts) {
        if (!karts || karts.length === 0) {
            return this.getRandomSpawnPoint();
        }

        let bestPoint = this.spawnPoints[0];
        let maxMinDist = 0;

        this.spawnPoints.forEach(point => {
            let minDist = Infinity;
            karts.forEach(kart => {
                if (kart.alive) {
                    const dist = Utils.distance(point, kart);
                    if (dist < minDist) minDist = dist;
                }
            });

            if (minDist > maxMinDist) {
                maxMinDist = minDist;
                bestPoint = point;
            }
        });

        return bestPoint;
    }

    /**
     * Get random power-up spawn point
     */
    getRandomPowerUpSpawn() {
        return Utils.randomChoice(this.powerUpSpawnPoints);
    }

    /**
     * Get random weapon spawn point
     */
    getRandomWeaponSpawn() {
        return Utils.randomChoice(this.weaponSpawnPoints);
    }

    /**
     * Check wall collision
     */
    checkWallCollision(entity) {
        const rect = {
            x: entity.x - entity.width / 2,
            y: entity.y - entity.height / 2,
            width: entity.width,
            height: entity.height
        };

        for (const wall of this.walls) {
            if (Utils.rectOverlap(rect, wall)) {
                return wall;
            }
        }
        return null;
    }

    /**
     * Check obstacle collision
     */
    checkObstacleCollision(entity) {
        const entityCircle = {
            x: entity.x,
            y: entity.y,
            radius: entity.radius || Math.max(entity.width, entity.height) / 2
        };

        for (const obstacle of this.obstacles) {
            if (obstacle.health <= 0) continue;

            const obstacleRect = {
                x: obstacle.x - obstacle.width / 2,
                y: obstacle.y - obstacle.height / 2,
                width: obstacle.width,
                height: obstacle.height
            };

            if (Utils.circleRectOverlap(entityCircle, obstacleRect)) {
                return obstacle;
            }
        }
        return null;
    }

    /**
     * Damage an obstacle
     */
    damageObstacle(obstacle, damage, source = null) {
        if (!obstacle.destructible) return;

        obstacle.health -= damage;

        if (obstacle.health <= 0) {
            this.destroyObstacle(obstacle, source);
        }
    }

    /**
     * Destroy an obstacle
     */
    destroyObstacle(obstacle, source = null) {
        obstacle.health = 0;

        // Trigger explosion for barrels
        if (obstacle.explosive && obstacle.explosionRadius) {
            // Create explosion effect
            if (window.Game && window.Game.instance) {
                window.Game.instance.createExplosion(
                    obstacle.x,
                    obstacle.y,
                    obstacle.explosionRadius,
                    obstacle.explosionDamage,
                    source
                );
            }
        }

        // Remove from obstacles array after delay (for visual effect)
        setTimeout(() => {
            const idx = this.obstacles.indexOf(obstacle);
            if (idx !== -1) {
                this.obstacles.splice(idx, 1);
            }
        }, 100);
    }

    /**
     * Resolve collision between entity and wall
     */
    resolveWallCollision(entity, wall) {
        const entityLeft = entity.x - entity.width / 2;
        const entityRight = entity.x + entity.width / 2;
        const entityTop = entity.y - entity.height / 2;
        const entityBottom = entity.y + entity.height / 2;

        const wallLeft = wall.x;
        const wallRight = wall.x + wall.width;
        const wallTop = wall.y;
        const wallBottom = wall.y + wall.height;

        // Calculate overlap on each side
        const overlapLeft = entityRight - wallLeft;
        const overlapRight = wallRight - entityLeft;
        const overlapTop = entityBottom - wallTop;
        const overlapBottom = wallBottom - entityTop;

        // Find minimum overlap
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        // Push entity out of wall
        if (minOverlap === overlapLeft) {
            entity.x = wallLeft - entity.width / 2;
            entity.vx = -entity.vx * 0.5;
        } else if (minOverlap === overlapRight) {
            entity.x = wallRight + entity.width / 2;
            entity.vx = -entity.vx * 0.5;
        } else if (minOverlap === overlapTop) {
            entity.y = wallTop - entity.height / 2;
            entity.vy = -entity.vy * 0.5;
        } else {
            entity.y = wallBottom + entity.height / 2;
            entity.vy = -entity.vy * 0.5;
        }

        return minOverlap > 5; // Return true if significant collision
    }

    /**
     * Update arena state
     */
    update(deltaTime) {
        // Respawn destroyed obstacles over time
        // (Could add logic here for obstacle respawning)
    }

    /**
     * Render arena
     */
    render(ctx, camera) {
        // Background
        ctx.fillStyle = this.theme.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Grid pattern
        ctx.strokeStyle = this.theme.gridColor;
        ctx.lineWidth = 1;

        const gridSize = 100;
        const startX = Math.floor(camera.x / gridSize) * gridSize - camera.x;
        const startY = Math.floor(camera.y / gridSize) * gridSize - camera.y;

        for (let x = startX; x < ctx.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        for (let y = startY; y < ctx.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }

        // Render walls
        ctx.fillStyle = this.theme.wallColor;
        ctx.shadowColor = this.theme.wallColor;
        ctx.shadowBlur = 10;

        this.walls.forEach(wall => {
            const screenX = wall.x - camera.x;
            const screenY = wall.y - camera.y;

            // Only render if visible
            if (screenX + wall.width > 0 && screenX < ctx.canvas.width &&
                screenY + wall.height > 0 && screenY < ctx.canvas.height) {
                ctx.fillRect(screenX, screenY, wall.width, wall.height);
            }
        });

        ctx.shadowBlur = 0;

        // Render obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle.health <= 0) return;

            const screenX = obstacle.x - camera.x;
            const screenY = obstacle.y - camera.y;

            // Only render if visible
            if (screenX + obstacle.width > -obstacle.width &&
                screenX < ctx.canvas.width + obstacle.width &&
                screenY + obstacle.height > -obstacle.height &&
                screenY < ctx.canvas.height + obstacle.height) {

                ctx.save();
                ctx.translate(screenX, screenY);

                // Set color based on type
                if (obstacle.type === 'crate') {
                    ctx.fillStyle = '#8B4513';
                    ctx.strokeStyle = '#5D3010';
                } else if (obstacle.type === 'barrel') {
                    ctx.fillStyle = '#cc0000';
                    ctx.strokeStyle = '#880000';
                } else if (obstacle.type === 'pillar') {
                    ctx.fillStyle = '#555555';
                    ctx.strokeStyle = '#333333';
                }

                // Draw obstacle
                ctx.beginPath();
                if (obstacle.type === 'barrel') {
                    // Draw circle for barrel
                    ctx.arc(0, 0, obstacle.width / 2, 0, Math.PI * 2);
                } else {
                    // Draw rectangle
                    ctx.rect(-obstacle.width / 2, -obstacle.height / 2,
                        obstacle.width, obstacle.height);
                }
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.stroke();

                // Draw health bar for destructible obstacles
                if (obstacle.destructible && obstacle.health < obstacle.maxHealth) {
                    const healthPercent = obstacle.health / obstacle.maxHealth;
                    const barWidth = obstacle.width;
                    const barHeight = 6;

                    ctx.fillStyle = '#333';
                    ctx.fillRect(-barWidth / 2, -obstacle.height / 2 - 12, barWidth, barHeight);

                    ctx.fillStyle = healthPercent > 0.3 ? '#4caf50' : '#f44336';
                    ctx.fillRect(-barWidth / 2, -obstacle.height / 2 - 12,
                        barWidth * healthPercent, barHeight);
                }

                ctx.restore();
            }
        });
    }

    /**
     * Render minimap
     */
    renderMinimap(ctx, karts, powerUps, camera) {
        const mapWidth = 180;
        const mapHeight = 180;
        const scale = Math.min(mapWidth / this.width, mapHeight / this.height);

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(mapWidth / 2, mapHeight / 2, mapWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Clip to circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(mapWidth / 2, mapHeight / 2, mapWidth / 2 - 3, 0, Math.PI * 2);
        ctx.clip();

        // Arena outline
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            (mapWidth - this.width * scale) / 2,
            (mapHeight - this.height * scale) / 2,
            this.width * scale,
            this.height * scale
        );

        // Walls
        ctx.fillStyle = 'rgba(78, 205, 196, 0.5)';
        this.walls.forEach(wall => {
            ctx.fillRect(
                (mapWidth - this.width * scale) / 2 + wall.x * scale,
                (mapHeight - this.height * scale) / 2 + wall.y * scale,
                wall.width * scale,
                wall.height * scale
            );
        });

        // Power-ups
        ctx.fillStyle = '#ffeb3b';
        powerUps.forEach(pu => {
            ctx.beginPath();
            ctx.arc(
                (mapWidth - this.width * scale) / 2 + pu.x * scale,
                (mapHeight - this.height * scale) / 2 + pu.y * scale,
                3,
                0, Math.PI * 2
            );
            ctx.fill();
        });

        // Other karts
        karts.forEach(kart => {
            if (!kart.alive) return;

            if (kart.isPlayer) {
                ctx.fillStyle = '#ff6b35';
            } else {
                ctx.fillStyle = '#f44336';
            }

            ctx.beginPath();
            ctx.arc(
                (mapWidth - this.width * scale) / 2 + kart.x * scale,
                (mapHeight - this.height * scale) / 2 + kart.y * scale,
                kart.isPlayer ? 5 : 4,
                0, Math.PI * 2
            );
            ctx.fill();

            // Direction indicator for player
            if (kart.isPlayer) {
                const dirX = Math.cos(kart.rotation) * 8;
                const dirY = Math.sin(kart.rotation) * 8;
                ctx.strokeStyle = '#ff6b35';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(
                    (mapWidth - this.width * scale) / 2 + kart.x * scale,
                    (mapHeight - this.height * scale) / 2 + kart.y * scale
                );
                ctx.lineTo(
                    (mapWidth - this.width * scale) / 2 + kart.x * scale + dirX,
                    (mapHeight - this.height * scale) / 2 + kart.y * scale + dirY
                );
                ctx.stroke();
            }
        });

        ctx.restore();
    }
}

// Export
window.Arena = Arena;
