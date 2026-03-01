/**
 * Ball physics and movement handler
 * Manages ball position, velocity, gravity, and collision interactions
 */

class Ball {
  constructor(x, y, radius = 10, mass = 1) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;

    // Velocity components (pixels per frame)
    this.vx = 0;
    this.vy = 0;

    // Physics constants
    this.gravity = 0.5; // Pixels per frame squared
    this.friction = 0.99;
    this.bounce = 0.8; // Coefficient of restitution
  }

  /**
   * Update ball position and apply gravity
   * @param {number} deltaTime - Time since last frame (in ms)
   */
  update(deltaTime) {
    // Apply gravity (increase downward velocity)
    this.vy += this.gravity;

    // Apply friction to all velocity
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Handle collision with canvas boundaries
   * @param {number} canvasWidth - Width of the game canvas
   * @param {number} canvasHeight - Height of the game canvas
   */
  handleBoundaryCollision(canvasWidth, canvasHeight) {
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -this.bounce;
    }
    if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.vx *= -this.bounce;
    }

    // Top boundary
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -this.bounce;
    }

    // Bottom boundary (floor)
    if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;
      this.vy *= -this.bounce;

      // Stop very small vertical movements to prevent jitter
      if (Math.abs(this.vy) < 0.5) {
        this.vy = 0;
      }
    }
  }

  /**
   * Apply a force to the ball
   * @param {number} fx - Force in x direction
   * @param {number} fy - Force in y direction
   */
  applyForce(fx, fy) {
    // F = ma, so a = F/m
    this.vx += fx / this.mass;
    this.vy += fy / this.mass;
  }

  /**
   * Directly set velocity
   * @param {number} vx - Velocity in x direction
   * @param {number} vy - Velocity in y direction
   */
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * Get ball's current speed (magnitude of velocity)
   * @returns {number} Speed in pixels per frame
   */
  getSpeed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  /**
   * Check if ball is moving (speed above threshold)
   * @returns {boolean} True if ball is moving
   */
  isMoving() {
    return this.getSpeed() > 0.1;
  }

  /**
   * Reset ball to starting position with zero velocity
   * @param {number} x - Starting x position
   * @param {number} y - Starting y position
   */
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  /**
   * Get ball state as object
   * @returns {Object} Ball position, velocity, and radius
   */
  getState() {
    return {
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      radius: this.radius,
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ball;
}
