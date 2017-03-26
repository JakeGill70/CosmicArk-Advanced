module CosmicArkAdvanced {

    /**
     * @description A rough example of how a gun will function in later iterations of the game.
     * @property game {Phaser.Game}                         - The Game context
     * @property target {Phaser.sprite}                     - What the gun will aim at
     * @property bullets {Phaser.weapon}                    - Object pool of Phaser.Bullet objects
     * @see {Phaser.bullet}
     */
    export class Gun extends Phaser.Sprite {
        game: Phaser.Game;               // Game Context
        target: Phaser.Sprite;           // What the Gun should aim at
        bullets: Phaser.Weapon;          // Object Pool of Possible Bullets

        constructor(_game: Phaser.Game, _x: number, _y: number, _graphicKey: string, _name: string) {
            super(_game, _x, _y, _graphicKey);      // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game;                      // get game contex

            this.anchor.setTo(0.0, 1);              // Move the anchor point to the bottom-left

            let debugSp = new Phaser.Sprite(this.game, this.x, this.y, "man");
        }

        /**
         * @description Adds the bullet pool to the game, and adjust all the settings associated with the bullets.
         */
        create() {
            this.bullets = this.game.add.weapon(10, "bullet");               // Create an object pool for 10 bullets
            this.bullets.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;         // Automatically "delete" the bullets after so many milliseconds
            this.bullets.bulletLifespan = 15000;                               // Set the bullet lifespan to 15000ms (15sec)
            this.bullets.bulletSpeed = 100;                                         // Speed of the bullet in pixels / second
            this.bullets.fireRate = 2000;                                            // Rate-of-fire in ms
            this.bullets.trackSprite(this, 0, 0, true);                             // Tell the bullets to base their fire position directly of this sprite 
                                                                                    // Also apply this sprite's rotation to their own.
        }

        /**
         * @description Called every frame. Calculates the angle of the gun to face the ship. Fires the gun assuming the fireRate has passed.
         */
        update() {
            if (this.target != null) {
                let deltaX = this.target.worldPosition.x - this.worldPosition.x;
                let deltaY = this.target.worldPosition.y - this.worldPosition.y;
                let angle = Math.atan2(deltaY, deltaX);
                this.rotation = angle;

                this.bullets.fire();
            }
        }
    }
}