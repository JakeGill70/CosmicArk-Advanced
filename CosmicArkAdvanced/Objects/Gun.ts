module CosmicArkAdvanced {

    /**
     * @description A rough example of how a gun will function in later iterations of the game.
     * @property game {Phaser.Game}                         - The Game context
     * @property target {Phaser.sprite}                     - What the gun will aim at
     * @property bullets {Phaser.weapon}                    - Object pool of Phaser.Bullet objects
     * @property effectiveRange {number}                    - Minimum distance between the target and the gun before the gun will shoot
     * @see {Phaser.bullet}
     */
    export class Gun extends Phaser.Sprite {
        game: Phaser.Game;               // Game Context
        target: Phaser.Sprite;           // What the Gun should aim at
        bullets: Phaser.Weapon;          // Object Pool of Possible Bullets
        effectiveRange: number           // Minimum distance between the target and the gun before the gun will shoot
        base: Phaser.Sprite;

        /**
         * @description Generic gun which will shoot at a given target if within range
         * @constructor
         * @param _game The game context
         * @param _x The starting world position's x-coordinate
         * @param _y The starting world position's y-coordinate
         * @param _graphicKey The string key to pull the sprite out of memory
         * @param _name A unique identifer to the object
         * @param _target Optional. What the gun should aim at
         */
        constructor(_game: Phaser.Game, _x: number, _y: number, _graphicKey: string, bulletSpeed:number, _target?: Phaser.Sprite) {
            super(_game, _x, _y, "gunTop");      // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game;                      // get game contex

            this.game.add.existing(this);           // Add this object to the gamestate

            // Create and add the base
            this.base = new Phaser.Sprite(this.game, this.x, this.y, "gunBase");
            this.base.anchor.setTo(0.50, 0.22);
            this.base.position.set(this.x, this.y);
            this.game.add.existing(this.base);

            this.effectiveRange = 10000;            // Make a default value for the range. 10,000 gives plenty of headroom

            this.anchor.setTo(0.31, 0.44);              // Move the anchor point to the bottom-left
            
            // If the target exists, initialize the object pool, target, and range
            if (_target != null) {
                this.init_target(_target, 375, bulletSpeed);  // A range of 375 pixels feels right for right now
            }
        }

        /**
        * @description Adds the bullet pool to the game, and adjust all the settings associated with the gun
        * @see {Overloading in typescript} Typescript requires all signitures, but only allows one implementation
        */
        init_target(): void;
        init_target(_target: Phaser.Sprite, _range: number): void;
        init_target(_target: Phaser.Sprite, _range: number, _speed: number): void;
        init_target(_target?:Phaser.Sprite, _range?:number, _speed?: number) {
            this.bullets = this.game.add.weapon(10, "bullet");               // Create an object pool for 10 bullets
            this.bullets.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;         // Automatically "delete" the bullets after so many milliseconds
            this.bullets.bulletLifespan = 15000;                               // Set the bullet lifespan to 15000ms (15sec)
            this.bullets.bulletSpeed = (_speed != null) ? _speed : 100;            // Speed of the bullet in pixels / second
            this.bullets.fireRate = 2000;                                            // Rate-of-fire in ms
            this.bullets.trackSprite(this, 0, 0, true);                             // Tell the bullets to base their fire position directly of this sprite 
                                                                                    // Also apply this sprite's rotation to their own.
            this.target = (_target != null) ? _target : null;                       // If it exists, Set the target to the given value
            this.effectiveRange = (_range != null) ? _range : null;                 // If it exists, Set the range to the given value
        }

        /**
         * @description Called every frame. 
         * Calculates the angle of the gun to face the ship. 
         * Fires the gun assuming the fireRate has passed and the ship is within range.
         */
        update() {
            if (this.target != null) {
                if (Phaser.Point.distance(this.target.position, this.position) <= this.effectiveRange) {
                    let deltaX = this.target.position.x - this.position.x;
                    let deltaY = this.target.position.y - this.position.y;
                    let angle = Math.atan2(deltaY, deltaX);
                    this.rotation = angle;
                    // Flip the sprite if the angle is too steep
                    if (Math.abs(Phaser.Math.radToDeg(angle)) > 90) {
                        this.scale.set(1, -1);
                        this.base.scale.set(-1, 1);
                    }
                    else {
                        this.scale.set(1, 1);
                        this.base.scale.set(1, 1);
                    }
                    //console.log(Phaser.Point.distance(this.target.worldPosition, this.worldPosition));
                    this.bullets.fire();        // Fire will not "fire" if the fireRate has not passed.
                }
            }
        }
    }
}