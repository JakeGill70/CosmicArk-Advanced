module CosmicArkAdvanced {

    /**
     * @description A rough example of how a gun will function in later iterations of the game.
     * @property game {Phaser.Game}                         - The Game context
     * @property target {Phaser.sprite}                     - What the gun will aim at
     * @property effectiveRange {number}                    - Minimum distance between the target and the gun before the gun will shoot
     * @property hooks {Phaser.weapon}                      - Object Pool of possible hooks (Should only ever have 1, but this class has other uses)
     * @see {Phaser.bullet}
     */
    export class Hook extends Phaser.Sprite {
        game: Phaser.Game;               // Game Context
        target: Phaser.Sprite;           // What the Gun should aim at
        effectiveRange: number;           // Minimum distance between the target and the gun before the gun will shoot
        rope: Phaser.Rope;              // Texture/colliders for the "link" connecting the hook to the base
        hooks: Phaser.Weapon;          // Object Pool of Possible hooks
        hasTarget: boolean;             // Determines if the player's ship has collided a hook

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
        constructor(_game: Phaser.Game, _x: number, _y: number, _graphicKey: string, _name: string, _target?: Phaser.Sprite) {
            super(_game, _x, _y, _graphicKey);      // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game;                      // get game contex

            this.game.add.existing(this);           // Add this object to the gamestate

            this.effectiveRange = 1;            // Make a default value for the range. 10,000 gives plenty of headroom

            this.anchor.setTo(0.0, 1);              // Move the anchor point to the bottom-left
            
            // If the target exists, initialize the object pool, target, and range
            if (_target != null) {
                this.init_target(_target, 200);  // A range of 375 pixels feels right for right now

                let points: Phaser.Point[] = [];
                for (let i: number = 0; i < 20; i++) {
                    points.push (new Phaser.Point(Phaser.Math.bezierInterpolation([0, 0], i / 20),
                        Phaser.Math.bezierInterpolation([0, 0], i / 20)));
                }
                this.rope = new Phaser.Rope(this.game, 0, 0, "rope", null, points);
                this.game.add.existing(this.rope);

                this.hooks.onKill.add(this.releaseHook, this);
            }
        }

        

        /**
        * @description Change the target and effective range
        * @see {Overloading in typescript} Typescript requires all signitures, but only allows one implementation
        */
        init_target(): void;
        init_target(_target: Phaser.Sprite, _range: number): void;
        init_target(_target?:Phaser.Sprite, _range?:number) {
            
            this.target = (_target != null) ? _target : null;                       // If it exists, Set the target to the given value
            this.effectiveRange = (_range != null) ? _range : null;                 // If it exists, Set the range to the given value

            this.hooks = this.game.add.weapon(1, "hook");
            this.hooks.bulletSpeed = 75;
            this.hooks.fireRate = 12000;
            this.hooks.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
            this.hooks.bulletLifespan = (this.effectiveRange / this.hooks.bulletSpeed) * 1000;
            this.hooks.trackSprite(this, 0, 0, true);
            this.hooks.autoExpandBulletsGroup = false;
        }

        /**
         * @description Called every frame. 
         * Calculates the angle of the gun to face the ship. 
         * Fires the gun assuming the fireRate has passed and the ship is within range.
         */
        update() {
           // console.log(Phaser.Point.distance(this.target.position, this.position));
          //  if (this.target != null && this.hooks != null) {
               if (Phaser.Point.distance(this.target.position, this.position) <= this.effectiveRange) {
                    let deltaX = this.target.position.x - this.position.x;
                    let deltaY = this.target.position.y - this.position.y;
                    let angle = Math.atan2(deltaY, deltaX);
                    this.rotation = angle;

                   // if (this.rope != null) {
                        this.hooks.fire();
                        
                        
                   // }
            }
               let mainHook = this.hooks.bullets.getFirstAlive(false) as Phaser.Sprite;
               for (let i: number = 0; i < 20; i++) {
                   if (mainHook != null) {
                       this.rope.points[i] = new Phaser.Point(Phaser.Math.bezierInterpolation([this.x, mainHook.x], i / 20),
                           Phaser.Math.bezierInterpolation([this.y, mainHook.y], i / 20));
                   }
                   else {
                       this.rope.points[i] = new Phaser.Point(0, 0);
                   }
               }
               this.rope.segments = new Phaser.Rope(this.game, 0, 0, "rope", null, this.rope.points).segments;
           // }
        }

        releaseHook() {
            this.hasTarget = false;
            (this.target as CosmicArkAdvanced.Player).isHooked = false;
        }

        targetHooked() {
            //TODO: Find some way to turn "hasTarget" off
            let mainHook = this.hooks.bullets.getFirstAlive(false) as Phaser.Sprite;
            if (mainHook != null && !this.hasTarget) {
                this.hasTarget = true;
                mainHook.body.velocity = new Phaser.Point(-this.hooks.bulletSpeed * Math.cos(mainHook.rotation), -this.hooks.bulletSpeed * Math.sin(mainHook.rotation));
                mainHook.lifespan = ((this.effectiveRange / this.hooks.bulletSpeed) * 1000) - mainHook.lifespan;
                console.log("ha ha got 'em");
                (this.target as CosmicArkAdvanced.Player).hookShip(mainHook.body.velocity);
            }
            else if (mainHook == null && this.hasTarget) {
                this.hasTarget = false;
            }
        }
    }
}