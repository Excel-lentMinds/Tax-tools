/**
 * SMASH KARTS - Map Themes System
 * Multiple themed arenas with unique visuals and layouts
 */

// Map theme configurations
const MAP_THEMES = {
    tropical: {
        id: 'tropical',
        name: 'Tropical Paradise',
        icon: '🏝️',
        description: 'Sunny beach arena with palm trees and water features',
        size: { width: 3000, height: 2200 },
        colors: {
            sky: '#87CEEB',
            water: '#2196F3',
            waterDeep: '#1565C0',
            sand: '#F4D03F',
            grass: '#7FFF00',
            track: '#FF6B35',
            trackAlt: '#E65100',
            accent: '#FF9800'
        },
        terrain: {
            waterLevel: 0,
            baseHeight: 20,
            hillHeight: 60,
            islandCount: 5
        },
        props: ['palm_tree', 'beach_umbrella', 'surfboard', 'tiki_hut', 'rock'],
        hazards: ['water'],
        ambient: { light: 0.8, shadow: true }
    },

    neon_city: {
        id: 'neon_city',
        name: 'Neon City',
        icon: '🌆',
        description: 'Futuristic urban arena with glowing elements',
        size: { width: 2800, height: 2000 },
        colors: {
            sky: '#0a0020',
            water: '#1a0040',
            waterDeep: '#0d0020',
            sand: '#2d1b4e',
            grass: '#1a1a3e',
            track: '#ff00ff',
            trackAlt: '#00ffff',
            accent: '#ffff00'
        },
        terrain: {
            waterLevel: -10,
            baseHeight: 10,
            hillHeight: 40,
            islandCount: 4
        },
        props: ['neon_building', 'street_light', 'billboard', 'barrier'],
        hazards: ['electric'],
        ambient: { light: 0.4, shadow: false, glow: true }
    },

    candy: {
        id: 'candy',
        name: 'Candy Land',
        icon: '🍭',
        description: 'Sweet-themed world with candy obstacles',
        size: { width: 2600, height: 2000 },
        colors: {
            sky: '#FFE4E1',
            water: '#FF69B4',
            waterDeep: '#FF1493',
            sand: '#FFDAB9',
            grass: '#98FB98',
            track: '#FFB6C1',
            trackAlt: '#DDA0DD',
            accent: '#FF6347'
        },
        terrain: {
            waterLevel: 0,
            baseHeight: 15,
            hillHeight: 50,
            islandCount: 6
        },
        props: ['lollipop', 'candy_cane', 'gumdrop', 'chocolate_bar', 'cupcake'],
        hazards: ['sticky'],
        ambient: { light: 0.9, shadow: true }
    },

    volcanic: {
        id: 'volcanic',
        name: 'Volcanic Wasteland',
        icon: '🌋',
        description: 'Dangerous lava-filled arena',
        size: { width: 2800, height: 2200 },
        colors: {
            sky: '#1a0a0a',
            water: '#FF4500',
            waterDeep: '#8B0000',
            sand: '#2d2d2d',
            grass: '#3d2d2d',
            track: '#4a4a4a',
            trackAlt: '#5d4d4d',
            accent: '#FF6600'
        },
        terrain: {
            waterLevel: -5,
            baseHeight: 25,
            hillHeight: 80,
            islandCount: 4
        },
        props: ['volcano', 'rock_formation', 'crystal', 'geyser', 'lava_rock'],
        hazards: ['lava'],
        ambient: { light: 0.5, shadow: true, glow: true }
    },

    arctic: {
        id: 'arctic',
        name: 'Arctic Tundra',
        icon: '❄️',
        description: 'Icy winter wonderland',
        size: { width: 2600, height: 2000 },
        colors: {
            sky: '#E1F5FE',
            water: '#4FC3F7',
            waterDeep: '#0288D1',
            sand: '#FFFFFF',
            grass: '#B3E5FC',
            track: '#90CAF9',
            trackAlt: '#64B5F6',
            accent: '#29B6F6'
        },
        terrain: {
            waterLevel: -5,
            baseHeight: 20,
            hillHeight: 55,
            islandCount: 5
        },
        props: ['igloo', 'ice_sculpture', 'pine_tree', 'iceberg', 'snowman'],
        hazards: ['ice', 'water'],
        ambient: { light: 0.95, shadow: true }
    },

    space: {
        id: 'space',
        name: 'Space Station',
        icon: '🚀',
        description: 'Zero-gravity inspired futuristic arena',
        size: { width: 2800, height: 2200 },
        colors: {
            sky: '#000022',
            water: '#4A148C',
            waterDeep: '#311B92',
            sand: '#37474F',
            grass: '#455A64',
            track: '#00BCD4',
            trackAlt: '#00838F',
            accent: '#7C4DFF'
        },
        terrain: {
            waterLevel: -20,
            baseHeight: 30,
            hillHeight: 70,
            islandCount: 4
        },
        props: ['satellite', 'asteroid', 'antenna', 'dome', 'teleporter'],
        hazards: ['void'],
        ambient: { light: 0.3, shadow: false, glow: true, stars: true }
    },

    jungle: {
        id: 'jungle',
        name: 'Jungle Ruins',
        icon: '🏛️',
        description: 'Ancient temple arena with overgrown vegetation',
        size: { width: 3000, height: 2400 },
        colors: {
            sky: '#A5D6A7',
            water: '#4CAF50',
            waterDeep: '#2E7D32',
            sand: '#8D6E63',
            grass: '#388E3C',
            track: '#795548',
            trackAlt: '#6D4C41',
            accent: '#FFD54F'
        },
        terrain: {
            waterLevel: 5,
            baseHeight: 30,
            hillHeight: 90,
            islandCount: 5
        },
        props: ['pyramid', 'vine', 'stone_head', 'pillar', 'waterfall'],
        hazards: ['quicksand', 'water'],
        ambient: { light: 0.7, shadow: true }
    },

    desert: {
        id: 'desert',
        name: 'Desert Oasis',
        icon: '🏜️',
        description: 'Sandy dunes with rare water sources',
        size: { width: 3200, height: 2400 },
        colors: {
            sky: '#FFF3E0',
            water: '#29B6F6',
            waterDeep: '#0288D1',
            sand: '#FFD54F',
            grass: '#D4E157',
            track: '#FF8A65',
            trackAlt: '#FF7043',
            accent: '#FFAB40'
        },
        terrain: {
            waterLevel: -10,
            baseHeight: 20,
            hillHeight: 100,
            islandCount: 4
        },
        props: ['cactus', 'rock_arch', 'tent', 'pottery', 'palm_tree'],
        hazards: ['quicksand'],
        ambient: { light: 1.0, shadow: true }
    },

    cyberpunk: {
        id: 'cyberpunk',
        name: 'Cyberpunk District',
        icon: '🤖',
        description: 'Dystopian urban environment with holograms',
        size: { width: 2800, height: 2000 },
        colors: {
            sky: '#0d1421',
            water: '#00ACC1',
            waterDeep: '#006064',
            sand: '#1a2332',
            grass: '#263238',
            track: '#E91E63',
            trackAlt: '#C2185B',
            accent: '#00E676'
        },
        terrain: {
            waterLevel: 0,
            baseHeight: 15,
            hillHeight: 45,
            islandCount: 5
        },
        props: ['hologram', 'neon_sign', 'drone', 'container', 'antenna'],
        hazards: ['electric'],
        ambient: { light: 0.35, shadow: false, glow: true, rain: true }
    },

    rainbow: {
        id: 'rainbow',
        name: 'Rainbow Road',
        icon: '🌈',
        description: 'Floating track through space with rainbow themes',
        size: { width: 3000, height: 2200 },
        colors: {
            sky: '#000033',
            water: '#9C27B0',
            waterDeep: '#7B1FA2',
            sand: '#E91E63',
            grass: '#00BCD4',
            track: '#FFEB3B',
            trackAlt: '#FF9800',
            accent: '#4CAF50'
        },
        terrain: {
            waterLevel: -50,
            baseHeight: 40,
            hillHeight: 80,
            islandCount: 6,
            floating: true
        },
        props: ['star', 'planet', 'comet', 'nebula', 'portal'],
        hazards: ['void'],
        ambient: { light: 0.5, shadow: false, glow: true, stars: true, rainbow: true }
    }
};

/**
 * Enhanced Arena class with themed maps
 */
class ThemedArena {
    constructor(themeId = 'tropical') {
        this.theme = MAP_THEMES[themeId] || MAP_THEMES.tropical;
        this.width = this.theme.size.width;
        this.height = this.theme.size.height;

        // Arena elements
        this.walls = [];
        this.obstacles = [];
        this.islands = [];
        this.bridges = [];
        this.ramps = [];
        this.decorations = [];

        // Gameplay elements
        this.spawnPoints = [];
        this.powerUpSpawnPoints = [];
        this.weaponSpawnPoints = [];
        this.boostPads = [];
        this.hazardZones = [];

        // Generate the map
        this.generate();
    }

    /**
     * Generate the complete map
     */
    generate() {
        this.createBoundaryWalls();
        this.createIslands();
        this.createBridges();
        this.createRamps();
        this.createObstacles();
        this.createDecorations();
        this.createSpawnPoints();
        this.createBoostPads();
        this.createHazardZones();
    }

    /**
     * Create arena boundaries
     */
    createBoundaryWalls() {
        const t = 40; // thickness

        this.walls = [
            // Outer walls
            { x: 0, y: 0, width: this.width, height: t, type: 'boundary' },
            { x: 0, y: this.height - t, width: this.width, height: t, type: 'boundary' },
            { x: 0, y: 0, width: t, height: this.height, type: 'boundary' },
            { x: this.width - t, y: 0, width: t, height: this.height, type: 'boundary' }
        ];
    }

    /**
     * Create island platforms
     */
    createIslands() {
        const islandCount = this.theme.terrain.islandCount;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Central main island
        this.islands.push({
            x: centerX,
            y: centerY,
            radius: 300,
            height: this.theme.terrain.baseHeight,
            type: 'main',
            color: this.theme.colors.sand
        });

        // Surrounding islands
        for (let i = 0; i < islandCount - 1; i++) {
            const angle = (i / (islandCount - 1)) * Math.PI * 2;
            const distance = 500 + Math.random() * 200;
            const radius = 150 + Math.random() * 100;

            this.islands.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                radius: radius,
                height: this.theme.terrain.baseHeight + Math.random() * 20,
                type: 'secondary',
                color: i % 2 === 0 ? this.theme.colors.grass : this.theme.colors.sand
            });
        }

        // Corner islands
        const corners = [
            { x: 250, y: 250 },
            { x: this.width - 250, y: 250 },
            { x: 250, y: this.height - 250 },
            { x: this.width - 250, y: this.height - 250 }
        ];

        corners.forEach((corner, i) => {
            this.islands.push({
                x: corner.x,
                y: corner.y,
                radius: 180 + Math.random() * 60,
                height: this.theme.terrain.baseHeight,
                type: 'corner',
                color: this.theme.colors.sand
            });
        });
    }

    /**
     * Create bridges connecting islands
     */
    createBridges() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Bridges from center to each surrounding island
        for (let i = 1; i < Math.min(this.islands.length, 5); i++) {
            const island = this.islands[i];

            // Calculate bridge position and rotation
            const dx = island.x - centerX;
            const dy = island.y - centerY;
            const length = Math.sqrt(dx * dx + dy * dy) - 300 - island.radius + 100;
            const angle = Math.atan2(dy, dx);

            if (length > 50) {
                this.bridges.push({
                    x: centerX + Math.cos(angle) * 280,
                    y: centerY + Math.sin(angle) * 280,
                    width: 80,
                    length: length,
                    rotation: angle,
                    color: this.theme.colors.track,
                    railColor: this.theme.colors.trackAlt
                });
            }
        }

        // Connect corner islands
        this.bridges.push({
            x: 250, y: this.height / 2,
            width: 60, length: 400,
            rotation: Math.PI / 2,
            color: this.theme.colors.track,
            railColor: this.theme.colors.trackAlt
        });

        this.bridges.push({
            x: this.width - 250, y: this.height / 2,
            width: 60, length: 400,
            rotation: Math.PI / 2,
            color: this.theme.colors.track,
            railColor: this.theme.colors.trackAlt
        });
    }

    /**
     * Create ramps for jumps
     */
    createRamps() {
        // Ramps on main island
        const rampPositions = [
            { x: this.width / 2 + 200, y: this.height / 2, rotation: 0 },
            { x: this.width / 2 - 200, y: this.height / 2, rotation: Math.PI },
            { x: this.width / 2, y: this.height / 2 + 180, rotation: Math.PI / 2 },
            { x: this.width / 2, y: this.height / 2 - 180, rotation: -Math.PI / 2 }
        ];

        rampPositions.forEach(pos => {
            this.ramps.push({
                x: pos.x,
                y: pos.y,
                width: 80,
                height: 60,
                rotation: pos.rotation,
                boost: 1.3,
                color: this.theme.colors.track
            });
        });

        // Ramps on outer islands
        for (let i = 1; i < this.islands.length; i++) {
            if (Math.random() > 0.5) {
                const island = this.islands[i];
                const angle = Math.random() * Math.PI * 2;
                this.ramps.push({
                    x: island.x + Math.cos(angle) * (island.radius - 50),
                    y: island.y + Math.sin(angle) * (island.radius - 50),
                    width: 60,
                    height: 50,
                    rotation: angle,
                    boost: 1.2,
                    color: this.theme.colors.track
                });
            }
        }
    }

    /**
     * Create obstacles based on theme
     */
    createObstacles() {
        // Obstacles on each island
        this.islands.forEach((island, islandIdx) => {
            const obstacleCount = islandIdx === 0 ? 8 : 4;

            for (let i = 0; i < obstacleCount; i++) {
                const angle = (i / obstacleCount) * Math.PI * 2 + Math.random() * 0.3;
                const dist = (island.radius - 80) * (0.3 + Math.random() * 0.5);

                const propType = Utils.randomChoice(this.theme.props);

                this.obstacles.push({
                    x: island.x + Math.cos(angle) * dist,
                    y: island.y + Math.sin(angle) * dist,
                    width: this.getPropSize(propType),
                    height: this.getPropSize(propType),
                    type: propType,
                    destructible: this.isDestructible(propType),
                    health: 50,
                    maxHealth: 50
                });
            }
        });
    }

    /**
     * Create decorative elements
     */
    createDecorations() {
        // Create waves/patterns in water areas
        for (let i = 0; i < 20; i++) {
            this.decorations.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                type: 'wave',
                scale: 0.5 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        // Theme-specific decorations
        if (this.theme.ambient.stars) {
            for (let i = 0; i < 50; i++) {
                this.decorations.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    type: 'star',
                    scale: 0.3 + Math.random() * 0.7,
                    twinkle: Math.random()
                });
            }
        }
    }

    /**
     * Create spawn points
     */
    createSpawnPoints() {
        // Spawn points on each island
        this.islands.forEach((island, idx) => {
            const pointCount = idx === 0 ? 6 : 2;
            for (let i = 0; i < pointCount; i++) {
                const angle = (i / pointCount) * Math.PI * 2;
                const dist = island.radius * 0.5;
                this.spawnPoints.push({
                    x: island.x + Math.cos(angle) * dist,
                    y: island.y + Math.sin(angle) * dist
                });
            }
        });

        // Power-up spawn points
        this.islands.forEach(island => {
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = island.radius * (0.3 + Math.random() * 0.4);
                this.powerUpSpawnPoints.push({
                    x: island.x + Math.cos(angle) * dist,
                    y: island.y + Math.sin(angle) * dist
                });
            }
        });

        // Weapon spawn points on bridges
        this.bridges.forEach(bridge => {
            this.weaponSpawnPoints.push({
                x: bridge.x + Math.cos(bridge.rotation) * bridge.length / 2,
                y: bridge.y + Math.sin(bridge.rotation) * bridge.length / 2
            });
        });

        // Also add weapons on larger islands
        this.islands.slice(0, 3).forEach(island => {
            this.weaponSpawnPoints.push({
                x: island.x,
                y: island.y
            });
        });
    }

    /**
     * Create boost pads
     */
    createBoostPads() {
        // Boost pads on bridges
        this.bridges.forEach(bridge => {
            this.boostPads.push({
                x: bridge.x + Math.cos(bridge.rotation) * bridge.length * 0.3,
                y: bridge.y + Math.sin(bridge.rotation) * bridge.length * 0.3,
                width: 60,
                height: 30,
                rotation: bridge.rotation,
                boost: 1.5,
                color: this.theme.colors.accent
            });
        });

        // Boost pads near ramps
        this.ramps.forEach(ramp => {
            this.boostPads.push({
                x: ramp.x - Math.cos(ramp.rotation) * 60,
                y: ramp.y - Math.sin(ramp.rotation) * 60,
                width: 50,
                height: 25,
                rotation: ramp.rotation,
                boost: 1.3,
                color: this.theme.colors.accent
            });
        });
    }

    /**
     * Create hazard zones
     */
    createHazardZones() {
        // Water/void zones are everything not covered by islands/bridges
        this.hazardZones.push({
            type: this.theme.hazards[0] || 'water',
            isWholemap: true,
            damage: 5,
            respawn: true,
            color: this.theme.colors.water
        });
    }

    /**
     * Get prop size based on type
     */
    getPropSize(propType) {
        const sizes = {
            palm_tree: 40,
            beach_umbrella: 50,
            surfboard: 30,
            tiki_hut: 80,
            rock: 45,
            neon_building: 100,
            street_light: 20,
            billboard: 70,
            barrier: 60,
            lollipop: 35,
            candy_cane: 25,
            gumdrop: 40,
            chocolate_bar: 60,
            cupcake: 45,
            volcano: 120,
            rock_formation: 80,
            crystal: 35,
            geyser: 40,
            lava_rock: 50,
            igloo: 90,
            ice_sculpture: 50,
            pine_tree: 40,
            iceberg: 100,
            snowman: 45,
            satellite: 60,
            asteroid: 70,
            antenna: 30,
            dome: 100,
            teleporter: 50,
            pyramid: 150,
            vine: 25,
            stone_head: 80,
            pillar: 40,
            waterfall: 60,
            cactus: 35,
            rock_arch: 100,
            tent: 70,
            pottery: 25,
            hologram: 50,
            neon_sign: 60,
            drone: 30,
            container: 80,
            star: 40,
            planet: 100,
            comet: 50,
            nebula: 120,
            portal: 60
        };
        return sizes[propType] || 50;
    }

    /**
     * Check if prop is destructible
     */
    isDestructible(propType) {
        const destructible = [
            'beach_umbrella', 'surfboard', 'barrier', 'lollipop',
            'candy_cane', 'gumdrop', 'ice_sculpture', 'snowman',
            'pottery', 'drone', 'container'
        ];
        return destructible.includes(propType);
    }

    /**
     * Get spawn point
     */
    getRandomSpawnPoint() {
        return Utils.randomChoice(this.spawnPoints);
    }

    /**
     * Get best spawn point away from karts
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
     * Get random power-up spawn
     */
    getRandomPowerUpSpawn() {
        return Utils.randomChoice(this.powerUpSpawnPoints);
    }

    /**
     * Get random weapon spawn
     */
    getRandomWeaponSpawn() {
        return Utils.randomChoice(this.weaponSpawnPoints);
    }

    /**
     * Check if position is on safe ground
     */
    isOnGround(x, y) {
        // Check if on any island
        for (const island of this.islands) {
            const dist = Utils.distance({ x, y }, island);
            if (dist < island.radius) return true;
        }

        // Check if on any bridge
        for (const bridge of this.bridges) {
            // Simplified bridge check
            const cos = Math.cos(-bridge.rotation);
            const sin = Math.sin(-bridge.rotation);
            const dx = x - bridge.x;
            const dy = y - bridge.y;
            const localX = dx * cos - dy * sin;
            const localY = dx * sin + dy * cos;

            if (Math.abs(localY) < bridge.width / 2 &&
                localX > 0 && localX < bridge.length) {
                return true;
            }
        }

        return false;
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
     * Resolve wall collision
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

        const overlapLeft = entityRight - wallLeft;
        const overlapRight = wallRight - entityLeft;
        const overlapTop = entityBottom - wallTop;
        const overlapBottom = wallBottom - entityTop;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

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

        return minOverlap > 5;
    }

    /**
     * Damage obstacle
     */
    damageObstacle(obstacle, damage, source) {
        if (!obstacle.destructible) return;
        obstacle.health -= damage;
        if (obstacle.health <= 0) {
            obstacle.health = 0;
        }
    }

    /**
     * Check boost pad collision
     */
    checkBoostPadCollision(entity) {
        for (const pad of this.boostPads) {
            const dist = Utils.distance(entity, pad);
            if (dist < pad.width / 2 + 20) {
                return pad;
            }
        }
        return null;
    }

    /**
     * Update arena
     */
    update(deltaTime) {
        // Update decorations (waves, etc)
        this.decorations.forEach(dec => {
            if (dec.type === 'wave') {
                dec.phase += deltaTime * 2;
            }
            if (dec.type === 'star') {
                dec.twinkle = (dec.twinkle + deltaTime) % 1;
            }
        });
    }

    /**
     * Render the arena
     */
    render(ctx, camera) {
        // Sky/background
        ctx.fillStyle = this.theme.colors.sky;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Stars for space themes
        if (this.theme.ambient.stars) {
            this.renderStars(ctx, camera);
        }

        // Water/void base
        ctx.fillStyle = this.theme.colors.water;
        const waterX = -camera.x;
        const waterY = -camera.y;
        ctx.fillRect(waterX, waterY, this.width, this.height);

        // Water pattern/waves
        this.renderWater(ctx, camera);

        // Render islands
        this.renderIslands(ctx, camera);

        // Render bridges
        this.renderBridges(ctx, camera);

        // Render ramps
        this.renderRamps(ctx, camera);

        // Render boost pads
        this.renderBoostPads(ctx, camera);

        // Render obstacles
        this.renderObstacles(ctx, camera);

        // Render walls
        this.renderWalls(ctx, camera);
    }

    /**
     * Render stars
     */
    renderStars(ctx, camera) {
        this.decorations.filter(d => d.type === 'star').forEach(star => {
            const screenX = star.x - camera.x;
            const screenY = star.y - camera.y;

            const alpha = 0.3 + Math.sin(star.twinkle * Math.PI * 2) * 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, star.scale * 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Render water effects
     */
    renderWater(ctx, camera) {
        // Wave pattern
        ctx.strokeStyle = this.theme.colors.waterDeep;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.3;

        for (let y = -camera.y % 100; y < ctx.canvas.height; y += 100) {
            ctx.beginPath();
            for (let x = 0; x < ctx.canvas.width; x += 10) {
                const waveY = y + Math.sin((x + camera.x) * 0.02 + Date.now() * 0.002) * 10;
                if (x === 0) ctx.moveTo(x, waveY);
                else ctx.lineTo(x, waveY);
            }
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    /**
     * Render islands
     */
    renderIslands(ctx, camera) {
        this.islands.forEach(island => {
            const screenX = island.x - camera.x;
            const screenY = island.y - camera.y;

            // Island shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(screenX + 5, screenY + 5, island.radius, island.radius * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

            // Beach edge
            ctx.fillStyle = this.theme.colors.sand;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY, island.radius, island.radius * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

            // Inner grass/track
            ctx.fillStyle = island.color;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY, island.radius * 0.8, island.radius * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();

            // Center area
            ctx.fillStyle = this.theme.colors.track;
            ctx.beginPath();
            ctx.ellipse(screenX, screenY, island.radius * 0.4, island.radius * 0.32, 0, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Render bridges
     */
    renderBridges(ctx, camera) {
        this.bridges.forEach(bridge => {
            const screenX = bridge.x - camera.x;
            const screenY = bridge.y - camera.y;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(bridge.rotation);

            // Bridge shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(5, -bridge.width / 2 + 5, bridge.length, bridge.width);

            // Bridge main
            ctx.fillStyle = bridge.color;
            ctx.fillRect(0, -bridge.width / 2, bridge.length, bridge.width);

            // Bridge rails
            ctx.fillStyle = bridge.railColor;
            ctx.fillRect(0, -bridge.width / 2, bridge.length, 8);
            ctx.fillRect(0, bridge.width / 2 - 8, bridge.length, 8);

            // Bridge stripes
            ctx.fillStyle = this.theme.colors.accent;
            for (let i = 0; i < bridge.length; i += 40) {
                ctx.fillRect(i, -5, 20, 10);
            }

            ctx.restore();
        });
    }

    /**
     * Render ramps
     */
    renderRamps(ctx, camera) {
        this.ramps.forEach(ramp => {
            const screenX = ramp.x - camera.x;
            const screenY = ramp.y - camera.y;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(ramp.rotation);

            // Ramp body
            ctx.fillStyle = ramp.color;
            ctx.beginPath();
            ctx.moveTo(-ramp.width / 2, ramp.height / 2);
            ctx.lineTo(ramp.width / 2, ramp.height / 2);
            ctx.lineTo(ramp.width / 2, -ramp.height / 3);
            ctx.lineTo(-ramp.width / 2, -ramp.height / 2);
            ctx.closePath();
            ctx.fill();

            // Ramp stripes
            ctx.fillStyle = this.theme.colors.accent;
            ctx.fillRect(-ramp.width / 2 + 10, -5, ramp.width - 20, 10);

            // Arrow
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(20, 0);
            ctx.lineTo(-10, -10);
            ctx.lineTo(-10, 10);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });
    }

    /**
     * Render boost pads
     */
    renderBoostPads(ctx, camera) {
        this.boostPads.forEach(pad => {
            const screenX = pad.x - camera.x;
            const screenY = pad.y - camera.y;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(pad.rotation);

            // Glow effect
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pad.width);
            gradient.addColorStop(0, pad.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
            ctx.fillRect(-pad.width / 2, -pad.height / 2, pad.width, pad.height);
            ctx.globalAlpha = 1;

            // Pad body
            ctx.fillStyle = pad.color;
            ctx.fillRect(-pad.width / 2 + 5, -pad.height / 2 + 5, pad.width - 10, pad.height - 10);

            // Arrow
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-5, -8);
            ctx.lineTo(-5, 8);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });
    }

    /**
     * Render obstacles
     */
    renderObstacles(ctx, camera) {
        this.obstacles.forEach(obstacle => {
            if (obstacle.health <= 0) return;

            const screenX = obstacle.x - camera.x;
            const screenY = obstacle.y - camera.y;

            ctx.save();
            ctx.translate(screenX, screenY);

            this.renderProp(ctx, obstacle.type, obstacle.width);

            ctx.restore();
        });
    }

    /**
     * Render a prop based on type
     */
    renderProp(ctx, type, size) {
        switch (type) {
            case 'palm_tree':
                // Trunk
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-5, -5, 10, 25);
                // Leaves
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(0, -15, 20, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'rock':
            case 'rock_formation':
            case 'lava_rock':
                ctx.fillStyle = '#696969';
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#555';
                ctx.beginPath();
                ctx.arc(-3, -3, size / 3, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'cactus':
                ctx.fillStyle = '#228B22';
                ctx.fillRect(-5, -20, 10, 40);
                ctx.fillRect(-20, -10, 15, 8);
                ctx.fillRect(5, -5, 15, 8);
                break;

            case 'pine_tree':
                ctx.fillStyle = '#4a2810';
                ctx.fillRect(-4, 0, 8, 20);
                ctx.fillStyle = '#1a4d1a';
                ctx.beginPath();
                ctx.moveTo(0, -25);
                ctx.lineTo(-15, 0);
                ctx.lineTo(15, 0);
                ctx.closePath();
                ctx.fill();
                break;

            case 'neon_building':
            case 'hologram':
                ctx.fillStyle = this.theme.colors.track;
                ctx.shadowColor = this.theme.colors.track;
                ctx.shadowBlur = 15;
                ctx.fillRect(-size / 2, -size, size, size * 2);
                ctx.shadowBlur = 0;
                break;

            case 'lollipop':
                ctx.fillStyle = '#FFC0CB';
                ctx.beginPath();
                ctx.arc(0, -15, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-3, -5, 6, 35);
                break;

            case 'candy_cane':
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(0, -15, 15, Math.PI, 2 * Math.PI);
                ctx.lineTo(15, 20);
                ctx.stroke();
                break;

            case 'crystal':
                ctx.fillStyle = '#E040FB';
                ctx.beginPath();
                ctx.moveTo(0, -20);
                ctx.lineTo(-12, 10);
                ctx.lineTo(0, 5);
                ctx.lineTo(12, 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'snowman':
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(0, 15, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, -5, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, -20, 8, 0, Math.PI * 2);
                ctx.fill();
                break;

            default:
                // Generic circular obstacle
                ctx.fillStyle = this.theme.colors.trackAlt;
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    /**
     * Render walls
     */
    renderWalls(ctx, camera) {
        ctx.fillStyle = this.theme.colors.trackAlt;

        this.walls.forEach(wall => {
            const screenX = wall.x - camera.x;
            const screenY = wall.y - camera.y;

            ctx.fillRect(screenX, screenY, wall.width, wall.height);
        });
    }

    /**
     * Render minimap
     */
    renderMinimap(ctx, karts, powerUps, camera) {
        const mapWidth = 180;
        const mapHeight = 180;
        const scale = Math.min(mapWidth / this.width, mapHeight / this.height) * 0.9;
        const offsetX = (mapWidth - this.width * scale) / 2;
        const offsetY = (mapHeight - this.height * scale) / 2;

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

        // Water background
        ctx.fillStyle = this.theme.colors.water + '80';
        ctx.fillRect(0, 0, mapWidth, mapHeight);

        // Islands
        ctx.fillStyle = this.theme.colors.sand;
        this.islands.forEach(island => {
            ctx.beginPath();
            ctx.arc(
                offsetX + island.x * scale,
                offsetY + island.y * scale,
                island.radius * scale,
                0, Math.PI * 2
            );
            ctx.fill();
        });

        // Bridges
        ctx.fillStyle = this.theme.colors.track;
        this.bridges.forEach(bridge => {
            ctx.save();
            ctx.translate(
                offsetX + bridge.x * scale,
                offsetY + bridge.y * scale
            );
            ctx.rotate(bridge.rotation);
            ctx.fillRect(0, -bridge.width * scale / 2, bridge.length * scale, bridge.width * scale);
            ctx.restore();
        });

        // Power-ups
        ctx.fillStyle = '#ffeb3b';
        powerUps.forEach(pu => {
            ctx.beginPath();
            ctx.arc(
                offsetX + pu.x * scale,
                offsetY + pu.y * scale,
                3, 0, Math.PI * 2
            );
            ctx.fill();
        });

        // Karts
        karts.forEach(kart => {
            if (!kart.alive) return;

            ctx.fillStyle = kart.isPlayer ? '#ff6b35' : '#f44336';
            ctx.beginPath();
            ctx.arc(
                offsetX + kart.x * scale,
                offsetY + kart.y * scale,
                kart.isPlayer ? 5 : 4,
                0, Math.PI * 2
            );
            ctx.fill();

            // Direction for player
            if (kart.isPlayer) {
                const dirX = Math.cos(kart.rotation) * 8;
                const dirY = Math.sin(kart.rotation) * 8;
                ctx.strokeStyle = '#ff6b35';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(
                    offsetX + kart.x * scale,
                    offsetY + kart.y * scale
                );
                ctx.lineTo(
                    offsetX + kart.x * scale + dirX,
                    offsetY + kart.y * scale + dirY
                );
                ctx.stroke();
            }
        });

        ctx.restore();
    }
}

// Export
window.MAP_THEMES = MAP_THEMES;
window.ThemedArena = ThemedArena;
