/**
 * SMASH KARTS - Utility Functions
 * Common helper functions used throughout the game
 */

const Utils = {
    // ============================================
    // MATH UTILITIES
    // ============================================
    
    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Linear interpolation between two values
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    /**
     * Smooth interpolation (ease in-out)
     */
    smoothStep(start, end, t) {
        t = this.clamp((t - start) / (end - start), 0, 1);
        return t * t * (3 - 2 * t);
    },
    
    /**
     * Convert degrees to radians
     */
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    /**
     * Convert radians to degrees
     */
    radToDeg(radians) {
        return radians * (180 / Math.PI);
    },
    
    /**
     * Normalize an angle to be between -PI and PI
     */
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    },
    
    /**
     * Get the shortest angle difference
     */
    angleDifference(a, b) {
        const diff = this.normalizeAngle(b - a);
        return diff;
    },
    
    /**
     * Get random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Get random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Pick a random element from an array
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Shuffle an array (Fisher-Yates)
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },
    
    // ============================================
    // VECTOR UTILITIES
    // ============================================
    
    /**
     * Create a 2D vector
     */
    vec2(x = 0, y = 0) {
        return { x, y };
    },
    
    /**
     * Add two vectors
     */
    vecAdd(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    },
    
    /**
     * Subtract two vectors
     */
    vecSub(a, b) {
        return { x: a.x - b.x, y: a.y - b.y };
    },
    
    /**
     * Multiply vector by scalar
     */
    vecMul(v, scalar) {
        return { x: v.x * scalar, y: v.y * scalar };
    },
    
    /**
     * Get vector length
     */
    vecLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    },
    
    /**
     * Get squared length (cheaper than length)
     */
    vecLengthSq(v) {
        return v.x * v.x + v.y * v.y;
    },
    
    /**
     * Normalize a vector
     */
    vecNormalize(v) {
        const len = this.vecLength(v);
        if (len === 0) return { x: 0, y: 0 };
        return { x: v.x / len, y: v.y / len };
    },
    
    /**
     * Get distance between two points
     */
    distance(a, b) {
        return this.vecLength(this.vecSub(b, a));
    },
    
    /**
     * Get squared distance (cheaper)
     */
    distanceSq(a, b) {
        return this.vecLengthSq(this.vecSub(b, a));
    },
    
    /**
     * Dot product of two vectors
     */
    vecDot(a, b) {
        return a.x * b.x + a.y * b.y;
    },
    
    /**
     * Cross product (2D - returns scalar)
     */
    vecCross(a, b) {
        return a.x * b.y - a.y * b.x;
    },
    
    /**
     * Rotate a vector by angle (radians)
     */
    vecRotate(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: v.x * cos - v.y * sin,
            y: v.x * sin + v.y * cos
        };
    },
    
    /**
     * Get angle of a vector
     */
    vecAngle(v) {
        return Math.atan2(v.y, v.x);
    },
    
    /**
     * Create a vector from angle and length
     */
    vecFromAngle(angle, length = 1) {
        return {
            x: Math.cos(angle) * length,
            y: Math.sin(angle) * length
        };
    },
    
    /**
     * Linear interpolation between two vectors
     */
    vecLerp(a, b, t) {
        return {
            x: this.lerp(a.x, b.x, t),
            y: this.lerp(a.y, b.y, t)
        };
    },
    
    // ============================================
    // COLLISION UTILITIES
    // ============================================
    
    /**
     * Check if point is inside rectangle
     */
    pointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    },
    
    /**
     * Check if point is inside circle
     */
    pointInCircle(point, circle) {
        return this.distanceSq(point, circle) <= circle.radius * circle.radius;
    },
    
    /**
     * Check if two rectangles overlap
     */
    rectOverlap(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },
    
    /**
     * Check if two circles overlap
     */
    circleOverlap(a, b) {
        const minDist = a.radius + b.radius;
        return this.distanceSq(a, b) <= minDist * minDist;
    },
    
    /**
     * Check if circle and rectangle overlap
     */
    circleRectOverlap(circle, rect) {
        // Find closest point on rectangle to circle center
        const closestX = this.clamp(circle.x, rect.x, rect.x + rect.width);
        const closestY = this.clamp(circle.y, rect.y, rect.y + rect.height);
        
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        
        return (dx * dx + dy * dy) <= circle.radius * circle.radius;
    },
    
    /**
     * Get collision normal between two circles
     */
    getCircleCollisionNormal(a, b) {
        return this.vecNormalize(this.vecSub(b, a));
    },
    
    /**
     * Line segment intersection check
     */
    lineIntersection(p1, p2, p3, p4) {
        const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
        if (Math.abs(d) < 0.0001) return null;
        
        const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
        const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
                t: t
            };
        }
        return null;
    },
    
    // ============================================
    // COLOR UTILITIES
    // ============================================
    
    /**
     * Convert HSL to RGB hex color
     */
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    },
    
    /**
     * Lerp between two colors
     */
    lerpColor(color1, color2, t) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(this.lerp(r1, r2, t));
        const g = Math.round(this.lerp(g1, g2, t));
        const b = Math.round(this.lerp(b1, b2, t));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    // ============================================
    // TIMING UTILITIES
    // ============================================
    
    /**
     * Format time as MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Throttle a function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Debounce a function
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    // ============================================
    // PARTICLE POOL
    // ============================================
    
    /**
     * Create an object pool for performance
     */
    createPool(factory, initialSize = 100) {
        const pool = [];
        const active = [];
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            pool.push(factory());
        }
        
        return {
            get() {
                const obj = pool.length > 0 ? pool.pop() : factory();
                active.push(obj);
                return obj;
            },
            
            release(obj) {
                const idx = active.indexOf(obj);
                if (idx !== -1) {
                    active.splice(idx, 1);
                    pool.push(obj);
                }
            },
            
            getActive() {
                return active;
            },
            
            releaseAll() {
                while (active.length > 0) {
                    pool.push(active.pop());
                }
            }
        };
    },
    
    // ============================================
    // DOM UTILITIES
    // ============================================
    
    /**
     * Get element by ID with shorthand
     */
    $(id) {
        return document.getElementById(id);
    },
    
    /**
     * Query selector shorthand
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    /**
     * Show element
     */
    show(element) {
        if (typeof element === 'string') element = this.$(element);
        element.classList.remove('hidden');
    },
    
    /**
     * Hide element
     */
    hide(element) {
        if (typeof element === 'string') element = this.$(element);
        element.classList.add('hidden');
    },
    
    /**
     * Toggle element visibility
     */
    toggle(element) {
        if (typeof element === 'string') element = this.$(element);
        element.classList.toggle('hidden');
    },
    
    // ============================================
    // STORAGE UTILITIES
    // ============================================
    
    /**
     * Save to localStorage
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    /**
     * Load from localStorage
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }
};

// Export for use in other modules
window.Utils = Utils;
