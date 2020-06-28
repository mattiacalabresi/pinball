// Geometric convention: x to the right, y upward, z out of the screen (counter-clockwise / right-handed basis)
// All distance measurements and related (velocity, acceleration, area...) are expressed in custom "abstract" units, from now on simply called "units"


// +--------------------------------------+
// |   PHYSICAL / GEOMETRICAL CONSTANTS   |  adjust at your own pleasing (and risk)
// +--------------------------------------+

/**
 * @type {number} number of frames per second, used in physics calculations
 */
const FRAMERATE = 60;

/**
 * @type {number} number of collision checks & updates per frame, used in physics calculations
 */
const SUBSTEPS = 6;

/**
 * @type {number} width of the pinball board in units
 */
const BOARD_WIDTH = 4.95;

/**
 * @type {number} height of the pinball board in units
 */
const BOARD_HEIGHT = 10.9;

/**
 * @type {number} gravitational acceleration downwards in units per second squared
 */
const GRAVITATIONAL_ACCELERATION = 4;

/**
 * @type {number} radius of the ball in units
 */
const BALL_RADIUS = .16;

/**
 * @type {number} coefficient of dynamic friction in units per second squared
 */
const FRICTION = .02;

/**
 * @type {number} coefficient of fluid friction in 1 / units (acceleration per velocity squared)
 */
const DRAG = .012;

/**
 * @type {number} ratio between the ball's velocity's component normal to the wall after vs. before the impact with said wall
 */
const WALL_RESTITUTION = -.5;

/**
 * @type {number} ratio between the ball's velocity after vs. before the impact with a bumper
 */
const BUMPER_RESTITUTION = -1.4;

/**
 * @type {number} radius of the bumpers in units
 */
const BUMPER_RADIUS = .33;

/**
 * @type {number} angle of the left flipper, in resting position, w.r.t the horizontal (x axis) measured counterclockwise in radians
 */
const FLIPPER_RESTING_ANGLE = -.5236;

/**
 * @type {number} angle of the left flipper, after a full swipe, w.r.t the horizontal (x axis) measured counterclockwise in radians
 */
const FLIPPER_ACTIVE_ANGLE = .5236;

/**
 * @type {number} sweep time of the left flipper in seconds
 */
const FLIPPER_SWEEP_TIME = .12;

/**
 * @type {number} length of the flippers in units
 */
const FLIPPER_LENGTH = .9;

/**
 * @type {number} ratio between the ball's velocity after vs. before the impact with a non-moving flipper
 */
const FLIPPER_RESTITUTION = -.4;

/**
 * @type {number} portion of the kinetic energy transferred from flipper to ball ~ `1` is perfectly elastic, `0` is as if the flipper were stationary
 * The flipper is idealized as an infinite mass object
 */
const FLIPPER_ENERGY_TRANSFER_EFFICIENCY = .4;

/**
 * @type {number} x coordinate of the start position of the ball
 */
const BALL_START_X = 4.6;

/**
 * @type {number} y coordinate of the start position of the ball
 */
const BALL_START_Y = 2;

/**
 * @type {number} y component of the launch velocity of the ball
 */
const BALL_LAUNCH_SPEED = 14;

// INFFERRED:

/**
 * angular velocity of the left flipper while moving up
 */
const FLIPPER_PULSE = (FLIPPER_ACTIVE_ANGLE - FLIPPER_RESTING_ANGLE) / FLIPPER_SWEEP_TIME;

/**
 * velocity at which the ball covers a distance equal to its radius in one frame
 */
const CRITICAL_VELOCITY = BALL_RADIUS * FRAMERATE;

/**
 * velocity above which collisions are not guaranteed to be detected (ball may clip through walls)
 */
const SAFE_VELOCITY = .5 * CRITICAL_VELOCITY * SUBSTEPS;

// +----------------------+
// |   GLOBAL VARIABLES   |
// +----------------------+

/**
 * @type {number} the accumulated score of the game
 */
var score = 0;

/**
 * @type {number} the remaining lives of the player
 */
var lives = 3;

// +--------------------------------------------+
// |   MODEL CLASSES AND STATE REPRESENTATION   |
// +--------------------------------------------+

/**
 * A 2D vector embedded in the flipper board plane. Used to represent positions, velocities, accelerations, distances and so on.
 * This class is immutable, i.e.: every operation applied to a vector results in a new vector being created and the original one being left unchanged.
 */
class Vector {
    /**
     * Creates a new vector given its components.
     * @param {number} x horizontal component (positive to the right)
     * @param {number} y vertical component (positive upward)
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the absolute value (or magnitude) of the vector.
     */
    get abs() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Returns the phase (i.e. angle w.r.t. positive x-axis) of the vector.
     */
    get phase() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * the null vector `(0, 0)`
     */
    static NULL = new Vector(0, 0);

    /**
     * Creates a unit vector whose phase is given.
     * @param {number} angle the phase of the vector
     */
    static unit(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    /**
     * Returns the result of component-wise (euclidean) addition with another vector.
     * @param {Vector} vector the other vector
     */
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Returns the scaling of the vector by a given factor.
     * @param {number} factor the scaling factor
     */
    scale(factor) {
        return new Vector(factor * this.x, factor * this.y);
    }

    /**
     * Returns the result of component-wise (euclidean) subtraction with another vector.
     * @param {Vector} vector the other vector
     */
    sub(vector) {
        return this.add(vector.scale(-1));
    }

    /**
     * Returns the normalization of the vector.
     */
    unit() {
        return new Vector(Math.cos(this.phase), Math.sin(this.phase));
    }

    /**
     * Returns the dot product with another vector.
     * @param {Vector} vector the other vector.
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Returns the counterclockwise normal of the vector.
     */
    normal() {
        return new Vector(-this.y, this.x);
    }
}

/**
 * Walls are lines through which the ball shall not pass.
 */
class Wall {
    /**
     * Creates a new wall given a start and an end point (which are totally interchangeable).
     * @param {Vector} start the start point
     * @param {Vector} end the end point
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.length = end.sub(start).abs;
        this.direction = end.sub(start).unit();

        Wall.list.push(this);
    }

    /**
     * @type {Wall[]} list of all instances
     */
    static list = [];
}

/**
 * Bumpers are stationary round objects that bounce the ball away from them, along the direction they were hit from.
 */
class Bumper {
    /**
     * Creates a new bumper given its position.
     * @param {Vector} position the bumper's position on the flipper board
     */
    constructor(position) {
        this.position = position;
        Bumper.list.push(this);
    }

    /**
     * @type {Bumper[]} list of all instances
     */
    static list = [];
}

class Flipper {
    constructor(position, isLeft) {
        this.position = position;
        this.isLeft = isLeft;

        Flipper.list.push(this);
    }

    /**
     * @type {Flipper[]} list of all instances
     */
    static list = [];

    /**
     * @type {boolean} seeking the 'up' position
     */
    active = false;

    /**
     * @type {boolean} currently in motion to achieve its desired position
     */
    isMoving = false;

    /**
     * @type {number} current relative angular position: `0` totally down, `1` totally up
     */
    angleRatio = 0;

    /**
     * Returns the flipper's current angle w.r.t. the positive x-axis.
     */
    get angle() {
        let leftAngle = FLIPPER_RESTING_ANGLE + (FLIPPER_ACTIVE_ANGLE - FLIPPER_RESTING_ANGLE) * this.angleRatio;
        return this.isLeft ? leftAngle : Math.PI - leftAngle;
    }

    /**
     * Returns the flipper's unit vector from hinge to extremity.
     */
    get direction() {
        return Vector.unit(this.angle);
    }

    /**
     * Returns the position of the flipper's extremity.
     */
    get extremity() {
        return this.direction.scale(FLIPPER_LENGTH).add(this.position);
    }

    /**
     * Returns the flipper's current angular velocity in radians per second (positive = counterclockwise).
     */
    get pulse() {
        if (!this.isMoving)
            return 0;
        if (this.isLeft ^ this.active)
            return -FLIPPER_PULSE;
        return FLIPPER_PULSE;
    }

    /**
     * Updates the flipper's position and motion over a small time differential.
     * @param {number} dt the time differential
     */
    update(dt) {
        let pulseDirection = this.active ? 1 : -1;
        let rawAngleRatio = this.angleRatio + pulseDirection * dt / FLIPPER_SWEEP_TIME;
        if (rawAngleRatio >= 0 && rawAngleRatio <= 1) {
            this.angleRatio = rawAngleRatio;
            this.isMoving = true;
        }
        else this.isMoving = false;
    }
}

class Ball {
    /**
     * @type {Vector} the position of the ball in units
     */
    position = new Vector(BALL_START_X, BALL_START_Y);

    /**
     * @type {Vector} the velocity of the ball in units per second
     */
    velocity = new Vector(0, 0);

    /**
     * @type {boolean} whether the ball has been launched
     */
    launched = false;

    /**
     * Updates the ball's position and velocity regardless of collisions over a small time differential.
     * @param {Vector} gravity the direction of gravity
     * @param {number} dt the time differential
     */
    update(gravity, dt) {
        const CENTER_SEEKING_FORCE = .4;
        this.velocity = this.velocity.add(gravity.scale(dt)).sub(this.velocity.unit().scale(FRICTION * dt)).sub(this.velocity.scale(this.velocity.abs * DRAG * dt));
        if(this.position.x < 1.52 && this.launched)
            this.velocity = this.velocity.add(new Vector(CENTER_SEEKING_FORCE, 0).scale(dt));
        else if(this.position.x > 3.5 && this.launched)
            this.velocity = this.velocity.sub(new Vector(CENTER_SEEKING_FORCE, 0).scale(dt));

        if(this.velocity.abs > SAFE_VELOCITY)
            this.velocity = this.velocity.unit().scale(SAFE_VELOCITY);

        this.position = this.position.add(this.velocity.scale(dt));

        if(this.position.y < -2 * BALL_RADIUS) {
            if(lives > 1) {
                this.position = new Vector(BALL_START_X, BALL_START_Y);
                this.launched = false;
                lives--;
                updateBallCounter(lives, false);
                playSound(soundReload);
            } else if(lives == 1)
                updateBallCounter(0, true);
            this.velocity = Vector.NULL;
        }
    }

    /**
     * Checks and manages collisions with a wall.
     * @param {Wall} wall the wall
     */
    checkCollisionWithWall(wall) {
        let relativeToStart = this.position.sub(wall.start);
        let wallAbscissa = relativeToStart.dot(wall.direction);
        wallAbscissa = Math.max(0, Math.min(wallAbscissa, wall.length)); // clamp wallAbscissa in [0, length]
        let impactPoint = wall.direction.scale(wallAbscissa).add(wall.start);

        let hit = this.handleCollision(impactPoint, Vector.NULL, WALL_RESTITUTION, 0);

        if(hit) {
            if(this.velocity.abs < 1 || this.position.y < 1.4 && Math.abs(this.velocity.y) < 1)
                return;
            let i = Math.floor(3 * Math.random());
            let sound = [soundWall1, soundWall2, soundWall3][i];
            playSound(sound);
        }
    }

    /**
     * Checks and manages collisions with a bumper.
     * @param {Bumper} bumper the bumper
     */
    checkCollisionWithBumper(bumper) {
        let bumperCenterToBall = this.position.sub(bumper.position);
        let bumperCenterToImpactPoint = bumperCenterToBall.unit().scale(BUMPER_RADIUS);
        let impactPoint = bumperCenterToImpactPoint.add(bumper.position);

        let hit = this.handleCollision(impactPoint, Vector.NULL, BUMPER_RESTITUTION, 0);
        if(hit) {
            score += Date.now() % 61;
            let i = Math.floor(3 * Math.random());
            let sound = [soundBumper1, soundBumper2, soundBumper3][i];
            playSound(sound);
        }
    }

    /**
     * Checks and manages collisions with a flipper.
     * @param {Flipper} flipper the flipper
     */
    checkCollisionWithFlipper(flipper) {
        let relativeToHinge = this.position.sub(flipper.position);
        let flipperAbscissa = relativeToHinge.dot(flipper.direction);
        flipperAbscissa = Math.max(0, Math.min(flipperAbscissa, FLIPPER_LENGTH)); // clamp flipperAbscissa in [0, length]
        let impactPoint = flipper.direction.scale(flipperAbscissa).add(flipper.position);
        let impactPointVelocity = flipper.direction.normal().scale(flipperAbscissa * flipper.pulse); // apply rivals theorem: new basis rotating with flipper

        let hit = this.handleCollision(impactPoint, impactPointVelocity, FLIPPER_RESTITUTION, FLIPPER_ENERGY_TRANSFER_EFFICIENCY);

        if(hit) {
            if(this.velocity.abs < 1 || this.position.y < 1.4 && Math.abs(this.velocity.y) < 1)
                return;
            let i = Math.floor(3 * Math.random());
            let sound = [soundWall1, soundWall2, soundWall3][i];
            playSound(sound);
        }
    }

    /**
     * Updates the ball's position and velocity considering a collision with a flat surface in a neighbourhood of a given impact point
     * @param {Vector} impactPoint the position of the point of impact
     * @param {Vector} impactPointVelocity the velocity of the point of impact on the moving surface (null vector if stationary)
     * @param {number} restitution the ratio between the ball's velocity's normal-to-the-surface component before vs. after the impact
     * @param {number} energyTransferEfficiency the portion of the kinetic energy transferred from the surface to the ball, if the surface is moving
     */
    handleCollision(impactPoint, impactPointVelocity, restitution, energyTransferEfficiency) {
        let relativePosition = this.position.sub(impactPoint);
        let distance = relativePosition.abs;

        if (distance >= BALL_RADIUS)
            return false;

        // "bounce" the ball out of the surface along a line connecting the impact point to the center of the ball (i.e. normal to the surface)
        let normal = relativePosition.unit();
        let penetration = BALL_RADIUS - distance;
        distance = BALL_RADIUS + penetration;
        relativePosition = normal.scale(distance);
        this.position = impactPoint.add(relativePosition);

        // adjust velocity ~ restitution and energy transfer efficiency only apply to the normal component of the relative velocity
        let relativeVelocity = this.velocity.sub(impactPointVelocity);
        let tangent = normal.normal(); // sounds dodgy but it's true
        let velocityTangent = relativeVelocity.dot(tangent);
        let velocityNormal = relativeVelocity.dot(normal);
        velocityNormal *= restitution;
        velocityNormal += 2 * impactPointVelocity.abs * energyTransferEfficiency;
        relativeVelocity = normal.scale(velocityNormal).add(tangent.scale(velocityTangent));
        this.velocity = impactPointVelocity.add(relativeVelocity);
        return true;
    }

    /**
     * Launches the ball.
     */
    launch(force) {
        if(this.launched)
            return;
        this.velocity = new Vector(0, force * BALL_LAUNCH_SPEED);
        this.launched = true;
        playSound(soundLaunch);
    }
}