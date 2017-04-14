var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @description A rough example of how a gun will function in later iterations of the game.
     * @property game {Phaser.Game}                         - The Game context
     * @property target {Phaser.sprite}                     - What the gun will aim at
     * @property effectiveRange {number}                    - Minimum distance between the target and the gun before the gun will shoot
     * @property rope {Phaser.Rope}                         - Texture/colliders for the "link" connecting the hook to the base
     * @property hooks {Phaser.weapon}                      - Object Pool of possible hooks (Should only ever have 1, but this class has other uses)
     * @hasTarget hasTarget {boolean}                       - Flag for if the player's ship is currently "hooked" to this object
     * @see {Phaser.bullet, Phaser.Rope}
     */
    var Hook = (function (_super) {
        __extends(Hook, _super);
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
        function Hook(_game, _x, _y, _graphicKey, _name, _target) {
            _super.call(this, _game, _x, _y, _graphicKey); // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game; // get game contex
            this.game.add.existing(this); // Add this object to the gamestate
            this.effectiveRange = 1; // Make a default value for the range. 10,000 gives plenty of headroom
            this.anchor.setTo(0.0, 1); // Move the anchor point to the bottom-left
            this.init_target(_target, 200); // A range of 200 pixels feels right for right now
            // Make nodes for the rope
            var points = [];
            for (var i = 0; i < 20; i++) {
                points.push(new Phaser.Point(Phaser.Math.bezierInterpolation([0, 0], i / 20), Phaser.Math.bezierInterpolation([0, 0], i / 20)));
            }
            this.rope = new Phaser.Rope(this.game, 0, 0, "rope", null, points); // Make the rope object
            this.game.add.existing(this.rope); // Add the rope to the game state
            this.hooks.onKill.add(this.releaseHook, this); // Register the onKill event from the weapon class 
        }
        Hook.prototype.init_target = function (_target, _range) {
            this.target = (_target != null) ? _target : null; // If it exists, Set the target to the given value
            this.effectiveRange = (_range != null) ? _range : null; // If it exists, Set the range to the given value
            this.hooks = this.game.add.weapon(1, "hook"); // Add an object pool of just 1 hook object
            this.hooks.bulletSpeed = 75; // Set the hook's speed in px / sec
            this.hooks.fireRate = (this.effectiveRange / this.hooks.bulletSpeed) * 1000 * 2; // Fire rate is 2.5 times the time it takes the hook to reach the end of the effective range
            this.hooks.bulletKillType = Phaser.Weapon.KILL_LIFESPAN; // Set the kill event to fire off if the object exists longer than it should
            this.hooks.bulletLifespan = (this.effectiveRange / this.hooks.bulletSpeed) * 1000; // Set the fire rate to be the time it takes the bullet to reach the end of its effective range
            this.hooks.trackSprite(this, 0, 0, true); // Tell the object pool to rotate the hook's sprite to be the same as this object's rotation
            this.hooks.autoExpandBulletsGroup = false; // We only ever want to fire 1 hook at a time, this tells the object pool not to fire if the 1 hook is already in use.
        };
        /**
         * @description Called every frame.
         * Calculates the angle of the gun to face the ship.
         * Fires the hook assuming the fireRate has passed and the ship is within range.
         */
        Hook.prototype.update = function () {
            if (Phaser.Point.distance(this.target.position, this.position) <= this.effectiveRange) {
                // Calculate the rotation of the gun
                var deltaX = this.target.position.x - this.position.x;
                var deltaY = this.target.position.y - this.position.y;
                var angle = Math.atan2(deltaY, deltaX);
                // Set the rotation of the object
                this.rotation = angle;
                // Attempt to fire the weapon, this will do nothing if not enough time has passed
                this.hooks.fire();
            }
            var mainHook = this.hooks.bullets.getFirstAlive(false); // If the hook exists, grab a copy of it
            // Re-calculate the nodes of the rope to be evenly distributed between the base and the hook
            for (var i = 0; i < 20; i++) {
                if (mainHook != null) {
                    this.rope.points[i] = new Phaser.Point(Phaser.Math.bezierInterpolation([this.x, mainHook.x], i / 20), Phaser.Math.bezierInterpolation([this.y, mainHook.y], i / 20));
                }
                else {
                    this.rope.points[i] = new Phaser.Point(0, 0);
                }
            }
            // Re-calculating the rope segments may not be needed if we never have it collide with anything
            this.rope.segments = new Phaser.Rope(this.game, 0, 0, "rope", null, this.rope.points).segments; // Recalculate the rope's segments, which are similar to colliders
        };
        /**
         * @description Clears the hasTarget flag, and clears the isHooked flag on the player object
         */
        Hook.prototype.releaseHook = function () {
            this.hasTarget = false;
            this.target.isHooked = false;
        };
        /**
         * @Description function which is called when the hook collides with the player's ship.
         * Sets the hasTarget flag, inverts the hook's velocity, and call the hookShip function on the player's ship
         * @see {CosmicArkAdvanced.Player.hookShip()}
         */
        Hook.prototype.targetHooked = function () {
            var mainHook = this.hooks.bullets.getFirstAlive(false); // If the hook exists, grab a copy of it
            if (mainHook != null && !this.hasTarget) {
                this.hasTarget = true; // Set the hasTarget flag
                mainHook.body.velocity = new Phaser.Point(-this.hooks.bulletSpeed * Math.cos(mainHook.rotation), -this.hooks.bulletSpeed * Math.sin(mainHook.rotation)); // Set the hook's velocity to return to the base
                mainHook.lifespan = ((this.effectiveRange / this.hooks.bulletSpeed) * 1000) - mainHook.lifespan; // Extend the hook's lifespan to last until it reaches the base
                console.log("ha ha got 'em"); // Debugging purposes for now.
                this.target.hookShip(mainHook.body.velocity); // Tell the ship it has been hooked
            }
            else if (mainHook == null && this.hasTarget) {
                // and the hasTarget flag is still set, 
                // clear it so that it can be set the next time 
                // the hook collides with the player's ship.
                this.hasTarget = false;
            }
        };
        return Hook;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Hook = Hook;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Hook.js.map