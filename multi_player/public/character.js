export default class Character {
    constructor(id, x, y, color = "blue") {
        this.id = id;
        this.x = x;
        this.y = y;
        this.health = 100;
        this.velocity = { x: 0, y: 0 };
        this.isAttacking = false;
        this.isBlocking = false;
        this.isDodging = false;
        this.color = color;
        this.canJump = true; // Flag to check if the character can jump
        this.gravity = 0.7; // Normal gravity
        this.jumpPower = 15; // Power of the jump
        this.groundY = 576; // Ground level (canvas height - character height)
        this.height = 180; // Character height
    }

    move(direction) {
        const speed = 7; // Horizontal speed

        switch (direction) {
            case 'left':
                this.velocity.x = -speed;
                break;
            case 'right':
                this.velocity.x = speed;
                break;
            case 'up':
                if (this.canJump) { 
                    this.velocity.y = -this.jumpPower; // Apply jump velocity
                    this.canJump = false; // Disable jumping mid-air
                }
                break;
        }
    }

    stop(direction) {
        if (direction === 'left' || direction === 'right') {
            this.velocity.x = 0; // Stop horizontal movement on key release
        }
    }

    update() {
        // Update horizontal movement
        this.x += this.velocity.x;

        // Apply gravity and fall after jump
        if (this.y + this.height < this.groundY) {
            this.velocity.y += this.gravity; // Apply gravity while in the air
        } else {
            // Stop falling when hitting the ground
            this.velocity.y = 0;
            this.y = this.groundY - this.height; // Prevent going below the ground
            this.canJump = true; // Allow jumping again
        }

        // Update vertical movement (falling after jump)
        this.y += this.velocity.y;
    }

    draw(c) {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, 50, 180); // Simple representation of the character
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => (this.isAttacking = false), 500);
    }

    block() {
        this.isBlocking = true;
        setTimeout(() => (this.isBlocking = false), 300);
    }

    dodge() {
        this.isDodging = true;
        setTimeout(() => (this.isDodging = false), 400);
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            health: this.health,
            isAttacking: this.isAttacking,
            isBlocking: this.isBlocking,
            isDodging: this.isDodging,
            color: this.color,
        };
    }
}
