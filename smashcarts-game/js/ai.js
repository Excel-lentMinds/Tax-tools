/**
 * SMASH KARTS - AI System
 * Handles AI-controlled karts with different behaviors and difficulty levels
 */

// AI difficulty configurations
const AI_DIFFICULTY = {
    easy: {
        accuracy: 0.4,
        reactionTime: 500,
        aggressiveness: 0.3,
        predictionAccuracy: 0.3,
        avoidanceSkill: 0.4,
        collectPriority: 0.7
    },
    medium: {
        accuracy: 0.6,
        reactionTime: 300,
        aggressiveness: 0.5,
        predictionAccuracy: 0.5,
        avoidanceSkill: 0.6,
        collectPriority: 0.6
    },
    hard: {
        accuracy: 0.8,
        reactionTime: 150,
        aggressiveness: 0.7,
        predictionAccuracy: 0.7,
        avoidanceSkill: 0.8,
        collectPriority: 0.5
    }
};

// AI behavior states
const AI_STATE = {
    WANDER: 'wander',
    CHASE: 'chase',
    ATTACK: 'attack',
    FLEE: 'flee',
    COLLECT: 'collect',
    EVADE: 'evade'
};

// AI names for variety
const AI_NAMES = [
    'Speedy', 'Crusher', 'Blaze', 'Shadow', 'Turbo',
    'Nitro', 'Viper', 'Storm', 'Flash', 'Maverick',
    'Bolt', 'Rocket', 'Fury', 'Blitz', 'Thunder',
    'Apex', 'Nova', 'Zephyr', 'Inferno', 'Phantom'
];

// AI colors
const AI_COLORS = [
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffc107', '#ff5722'
];

class AIController {
    constructor(kart, difficulty = 'medium') {
        this.kart = kart;
        this.difficulty = AI_DIFFICULTY[difficulty] || AI_DIFFICULTY.medium;

        // Current state
        this.state = AI_STATE.WANDER;
        this.stateTimer = 0;
        this.stateData = {};

        // Target tracking
        this.target = null;
        this.targetPosition = null;
        this.lastKnownTargetPos = null;

        // Waypoint for wandering
        this.waypoint = null;
        this.waypointReachedDist = 50;

        // Decision timers
        this.decisionTimer = 0;
        this.decisionInterval = 0.5; // seconds

        // Reaction delay
        this.reactionQueue = [];

        // Threat awareness
        this.nearbyThreats = [];
        this.dangerLevel = 0;

        // Pickup awareness
        this.nearestPickup = null;
        this.nearestWeapon = null;

        // Combat state
        this.aimOffset = { x: 0, y: 0 };
        this.lastFireAttempt = 0;
    }

    /**
     * Update AI logic
     */
    update(deltaTime, gameState) {
        if (!this.kart.alive) return;

        // Process reaction queue
        this.processReactionQueue(deltaTime);

        // Update decision timer
        this.decisionTimer += deltaTime;
        if (this.decisionTimer >= this.decisionInterval) {
            this.makeDecision(gameState);
            this.decisionTimer = 0;
        }

        // Update state timer
        this.stateTimer += deltaTime;

        // Execute current behavior
        this.executeBehavior(deltaTime, gameState);

        // Handle combat
        this.handleCombat(deltaTime, gameState);
    }

    /**
     * Make tactical decision
     */
    makeDecision(gameState) {
        const { player, karts, weapons, powerups, arena } = gameState;

        // Analyze situation
        this.analyzeSituation(gameState);

        // Priority-based decision making
        let newState = AI_STATE.WANDER;

        // Check for immediate threats (projectiles, mines)
        if (this.dangerLevel > 0.7) {
            newState = AI_STATE.EVADE;
        }
        // Low health - consider fleeing
        else if (this.kart.health < 30 && this.difficulty.aggressiveness < 0.6) {
            newState = AI_STATE.FLEE;
        }
        // Have weapon and see target - attack
        else if (this.kart.weapon && this.target && this.getDistanceToTarget() < 400) {
            newState = AI_STATE.ATTACK;
        }
        // See valuable pickup nearby
        else if ((this.nearestPickup || this.nearestWeapon) && !this.kart.weapon) {
            newState = AI_STATE.COLLECT;
        }
        // Have target in range - chase
        else if (this.target && this.getDistanceToTarget() < 600) {
            newState = AI_STATE.CHASE;
        }
        // Default - wander
        else {
            newState = AI_STATE.WANDER;
        }

        // State transition
        if (newState !== this.state) {
            this.transitionToState(newState);
        }
    }

    /**
     * Analyze current situation
     */
    analyzeSituation(gameState) {
        const { player, karts, weapons, powerups } = gameState;

        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDist = Infinity;

        // Check player
        if (player && player.alive) {
            const dist = Utils.distance(this.kart, player);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = player;
            }
        }

        // Check other AI karts
        karts.forEach(kart => {
            if (kart === this.kart || !kart.alive) return;
            const dist = Utils.distance(this.kart, kart);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = kart;
            }
        });

        this.target = nearestEnemy;

        // Find nearest pickups
        this.nearestPickup = null;
        this.nearestWeapon = null;
        let nearestPickupDist = Infinity;
        let nearestWeaponDist = Infinity;

        powerups.forEach(pickup => {
            if (!pickup.active) return;
            const dist = Utils.distance(this.kart, pickup);
            if (dist < nearestPickupDist) {
                nearestPickupDist = dist;
                this.nearestPickup = pickup;
            }
        });

        weapons.forEach(pickup => {
            if (!pickup.active) return;
            const dist = Utils.distance(this.kart, pickup);
            if (dist < nearestWeaponDist) {
                nearestWeaponDist = dist;
                this.nearestWeapon = pickup;
            }
        });

        // Analyze threats (projectiles heading towards us)
        this.dangerLevel = 0;
        this.nearbyThreats = [];

        gameState.projectiles.forEach(proj => {
            if (proj.owner === this.kart) return;

            const dist = Utils.distance(this.kart, proj);
            if (dist < 200) {
                // Check if heading towards us
                const toKart = Utils.vecSub(this.kart, proj);
                const projDir = { x: proj.vx, y: proj.vy };
                const dot = Utils.vecDot(Utils.vecNormalize(toKart), Utils.vecNormalize(projDir));

                if (dot > 0.5) {
                    this.nearbyThreats.push(proj);
                    this.dangerLevel += (1 - dist / 200) * dot;
                }
            }
        });

        // Check nearby mines
        gameState.mines.forEach(mine => {
            if (!mine.armed) return;
            const dist = Utils.distance(this.kart, mine);
            if (dist < 100) {
                this.nearbyThreats.push(mine);
                this.dangerLevel += (1 - dist / 100) * 0.5;
            }
        });

        this.dangerLevel = Math.min(1, this.dangerLevel);
    }

    /**
     * Transition to new state
     */
    transitionToState(newState) {
        this.state = newState;
        this.stateTimer = 0;
        this.stateData = {};

        // State-specific initialization
        switch (newState) {
            case AI_STATE.WANDER:
                this.pickNewWaypoint();
                break;
            case AI_STATE.ATTACK:
                this.aimOffset = {
                    x: (Math.random() - 0.5) * 50 * (1 - this.difficulty.accuracy),
                    y: (Math.random() - 0.5) * 50 * (1 - this.difficulty.accuracy)
                };
                break;
        }
    }

    /**
     * Execute current behavior
     */
    executeBehavior(deltaTime, gameState) {
        // Reset inputs
        this.kart.input.accelerate = false;
        this.kart.input.brake = false;
        this.kart.input.left = false;
        this.kart.input.right = false;
        this.kart.input.drift = false;

        switch (this.state) {
            case AI_STATE.WANDER:
                this.behaviorWander(deltaTime, gameState);
                break;
            case AI_STATE.CHASE:
                this.behaviorChase(deltaTime, gameState);
                break;
            case AI_STATE.ATTACK:
                this.behaviorAttack(deltaTime, gameState);
                break;
            case AI_STATE.FLEE:
                this.behaviorFlee(deltaTime, gameState);
                break;
            case AI_STATE.COLLECT:
                this.behaviorCollect(deltaTime, gameState);
                break;
            case AI_STATE.EVADE:
                this.behaviorEvade(deltaTime, gameState);
                break;
        }
    }

    /**
     * Wander behavior - move randomly around the arena
     */
    behaviorWander(deltaTime, gameState) {
        if (!this.waypoint || this.reachedWaypoint()) {
            this.pickNewWaypoint();
        }

        this.driveTowards(this.waypoint, 0.7);
    }

    /**
     * Chase behavior - pursue target
     */
    behaviorChase(deltaTime, gameState) {
        if (!this.target || !this.target.alive) {
            this.transitionToState(AI_STATE.WANDER);
            return;
        }

        // Predict target position
        const predictionTime = 0.5 * this.difficulty.predictionAccuracy;
        const predictedPos = {
            x: this.target.x + this.target.vx * predictionTime,
            y: this.target.y + this.target.vy * predictionTime
        };

        this.driveTowards(predictedPos, 1.0);
    }

    /**
     * Attack behavior - aim and fire at target
     */
    behaviorAttack(deltaTime, gameState) {
        if (!this.target || !this.target.alive) {
            this.transitionToState(AI_STATE.WANDER);
            return;
        }

        // Predict target position for aiming
        const dist = Utils.distance(this.kart, this.target);
        const projectileSpeed = this.kart.weapon ? this.kart.weapon.projectileSpeed : 500;
        const travelTime = dist / projectileSpeed;

        const aimPoint = {
            x: this.target.x + this.target.vx * travelTime * this.difficulty.predictionAccuracy + this.aimOffset.x,
            y: this.target.y + this.target.vy * travelTime * this.difficulty.predictionAccuracy + this.aimOffset.y
        };

        // Drive towards aim point but keep distance
        const idealDist = 200;
        if (dist < idealDist) {
            // Keep distance - don't get too close
            this.driveTowards(aimPoint, 0.3);
        } else {
            this.driveTowards(aimPoint, 0.8);
        }
    }

    /**
     * Flee behavior - run away from threats
     */
    behaviorFlee(deltaTime, gameState) {
        if (!this.target) {
            this.transitionToState(AI_STATE.WANDER);
            return;
        }

        // Drive away from target
        const fleeDir = Utils.vecNormalize(Utils.vecSub(this.kart, this.target));
        const fleePoint = {
            x: this.kart.x + fleeDir.x * 300,
            y: this.kart.y + fleeDir.y * 300
        };

        // Clamp to arena bounds
        fleePoint.x = Utils.clamp(fleePoint.x, 100, gameState.arena.width - 100);
        fleePoint.y = Utils.clamp(fleePoint.y, 100, gameState.arena.height - 100);

        this.driveTowards(fleePoint, 1.0);

        // Look for health pickups while fleeing
        if (this.nearestPickup && this.nearestPickup.powerUpType === 'health') {
            const pickupDist = Utils.distance(this.kart, this.nearestPickup);
            if (pickupDist < 150) {
                this.driveTowards(this.nearestPickup, 1.0);
            }
        }
    }

    /**
     * Collect behavior - go for pickups
     */
    behaviorCollect(deltaTime, gameState) {
        const target = this.nearestWeapon || this.nearestPickup;

        if (!target || !target.active) {
            this.transitionToState(AI_STATE.WANDER);
            return;
        }

        this.driveTowards(target, 0.9);
    }

    /**
     * Evade behavior - dodge incoming threats
     */
    behaviorEvade(deltaTime, gameState) {
        if (this.nearbyThreats.length === 0) {
            this.transitionToState(AI_STATE.WANDER);
            return;
        }

        // Calculate average threat direction
        let threatDir = { x: 0, y: 0 };
        this.nearbyThreats.forEach(threat => {
            const toThreat = Utils.vecNormalize(Utils.vecSub(threat, this.kart));
            threatDir.x += toThreat.x;
            threatDir.y += toThreat.y;
        });
        threatDir = Utils.vecNormalize(threatDir);

        // Evade perpendicular to threat
        const evadeDir = {
            x: -threatDir.y * (Math.random() > 0.5 ? 1 : -1),
            y: threatDir.x * (Math.random() > 0.5 ? 1 : -1)
        };

        const evadePoint = {
            x: this.kart.x + evadeDir.x * 200,
            y: this.kart.y + evadeDir.y * 200
        };

        // Clamp to arena
        evadePoint.x = Utils.clamp(evadePoint.x, 100, gameState.arena.width - 100);
        evadePoint.y = Utils.clamp(evadePoint.y, 100, gameState.arena.height - 100);

        this.driveTowards(evadePoint, 1.0);

        // Use drift to evade faster
        if (this.kart.getSpeed() > this.kart.maxSpeed * 0.5) {
            this.kart.input.drift = Math.random() < this.difficulty.avoidanceSkill;
        }
    }

    /**
     * Handle combat actions
     */
    handleCombat(deltaTime, gameState) {
        if (!this.kart.weapon || !this.kart.alive) return;

        // Only fire in attack state or opportunistically
        const shouldFire = this.state === AI_STATE.ATTACK ||
            (this.target && this.getDistanceToTarget() < 300 &&
                Math.random() < this.difficulty.aggressiveness);

        if (!shouldFire) return;

        if (!this.target || !this.target.alive) return;

        // Check if we have line of sight and good angle
        const toTarget = Utils.vecSub(this.target, this.kart);
        const targetAngle = Math.atan2(toTarget.y, toTarget.x);
        const angleDiff = Math.abs(Utils.angleDifference(this.kart.rotation, targetAngle));

        // Only fire if facing target within tolerance
        const tolerance = Utils.degToRad(30) / this.difficulty.accuracy;

        if (angleDiff < tolerance && this.kart.canFire()) {
            // Add reaction delay
            const delay = this.difficulty.reactionTime * (0.5 + Math.random() * 0.5);

            if (Date.now() - this.lastFireAttempt > delay) {
                this.queueAction(() => {
                    this.kart.input.fire = true;
                }, delay);
                this.lastFireAttempt = Date.now();
            }
        }
    }

    /**
     * Drive towards a target position
     */
    driveTowards(target, throttle = 1.0) {
        if (!target) return;

        // Calculate direction to target
        const toTarget = Utils.vecSub(target, this.kart);
        const targetAngle = Math.atan2(toTarget.y, toTarget.x);
        const angleDiff = Utils.angleDifference(this.kart.rotation, targetAngle);

        // Steering
        const turnThreshold = 0.1;
        if (angleDiff > turnThreshold) {
            this.kart.input.right = true;
        } else if (angleDiff < -turnThreshold) {
            this.kart.input.left = true;
        }

        // Throttle based on angle - slow down for sharp turns
        const angleAbs = Math.abs(angleDiff);
        const speedFactor = angleAbs < 0.5 ? 1 : Math.max(0.3, 1 - angleAbs / Math.PI);

        if (throttle * speedFactor > 0.1) {
            this.kart.input.accelerate = true;
        }

        // Brake if going the wrong way
        if (angleAbs > Math.PI * 0.7) {
            this.kart.input.brake = true;
            this.kart.input.accelerate = false;
        }

        // Wall avoidance
        this.avoidWalls(target);
    }

    /**
     * Avoid walls
     */
    avoidWalls(gameState) {
        const margin = 80;
        const arena = gameState?.arena || { width: 2000, height: 1500 };

        // Check proximity to walls
        if (this.kart.x < margin) {
            this.kart.input.right = true;
            this.kart.input.left = false;
        } else if (this.kart.x > arena.width - margin) {
            this.kart.input.left = true;
            this.kart.input.right = false;
        }

        if (this.kart.y < margin) {
            // Turn away from top
            if (Math.cos(this.kart.rotation) > 0) {
                this.kart.input.right = Math.sin(this.kart.rotation) < 0;
                this.kart.input.left = Math.sin(this.kart.rotation) > 0;
            }
        } else if (this.kart.y > arena.height - margin) {
            // Turn away from bottom
            if (Math.cos(this.kart.rotation) > 0) {
                this.kart.input.left = Math.sin(this.kart.rotation) < 0;
                this.kart.input.right = Math.sin(this.kart.rotation) > 0;
            }
        }
    }

    /**
     * Pick new random waypoint
     */
    pickNewWaypoint() {
        this.waypoint = {
            x: Utils.random(150, 1850),
            y: Utils.random(150, 1350)
        };
    }

    /**
     * Check if reached current waypoint
     */
    reachedWaypoint() {
        if (!this.waypoint) return true;
        return Utils.distance(this.kart, this.waypoint) < this.waypointReachedDist;
    }

    /**
     * Get distance to current target
     */
    getDistanceToTarget() {
        if (!this.target) return Infinity;
        return Utils.distance(this.kart, this.target);
    }

    /**
     * Queue an action with delay (for reaction time)
     */
    queueAction(action, delay) {
        this.reactionQueue.push({
            action,
            delay,
            elapsed: 0
        });
    }

    /**
     * Process reaction queue
     */
    processReactionQueue(deltaTime) {
        this.reactionQueue = this.reactionQueue.filter(item => {
            item.elapsed += deltaTime * 1000;
            if (item.elapsed >= item.delay) {
                item.action();
                return false;
            }
            return true;
        });
    }
}

/**
 * Create AI karts for the game
 */
function createAIKarts(count, difficulty = 'medium', arena = null) {
    const aiKarts = [];
    const usedNames = new Set();
    const usedColors = new Set();

    for (let i = 0; i < count; i++) {
        // Get unique name
        let name;
        do {
            name = Utils.randomChoice(AI_NAMES);
        } while (usedNames.has(name) && usedNames.size < AI_NAMES.length);
        usedNames.add(name);

        // Get unique color
        let color;
        do {
            color = Utils.randomChoice(AI_COLORS);
        } while (usedColors.has(color) && usedColors.size < AI_COLORS.length);
        usedColors.add(color);

        // Get spawn position
        const spawn = arena ? arena.getRandomSpawnPoint() : { x: 100 + i * 100, y: 100 };

        const kart = new Kart({
            x: spawn.x,
            y: spawn.y,
            rotation: Math.random() * Math.PI * 2,
            name: name,
            color: color,
            isPlayer: false
        });

        const controller = new AIController(kart, difficulty);
        kart.aiController = controller;

        aiKarts.push(kart);
    }

    return aiKarts;
}

// Export
window.AIController = AIController;
window.createAIKarts = createAIKarts;
window.AI_DIFFICULTY = AI_DIFFICULTY;
