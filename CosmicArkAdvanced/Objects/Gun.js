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
     * @property bullets {Phaser.weapon}                    - Object pool of Phaser.Bullet objects
     * @property effectiveRange {number}                    - Minimum distance between the target and the gun before the gun will shoot
     * @see {Phaser.bullet}
     */
    var Gun = (function (_super) {
        __extends(Gun, _super);
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
        function Gun(_game, _x, _y, _graphicKey, _name, _target) {
            _super.call(this, _game, _x, _y, _graphicKey); // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game; // get game contex
            this.game.add.existing(this); // Add this object to the gamestate
            this.effectiveRange = 10000; // Make a default value for the range. 10,000 gives plenty of headroom
            this.anchor.setTo(0.0, 1); // Move the anchor point to the bottom-left
            // If the target exists, initialize the object pool, target, and range
            if (_target != null) {
                this.init_target(_target, 375); // A range of 375 pixels feels right for right now
            }
        }
        Gun.prototype.init_target = function (_target, _range) {
            this.bullets = this.game.add.weapon(10, "bullet"); // Create an object pool for 10 bullets
            this.bullets.bulletKillType = Phaser.Weapon.KILL_LIFESPAN; // Automatically "delete" the bullets after so many milliseconds
            this.bullets.bulletLifespan = 15000; // Set the bullet lifespan to 15000ms (15sec)
            this.bullets.bulletSpeed = 100; // Speed of the bullet in pixels / second
            this.bullets.fireRate = 2000; // Rate-of-fire in ms
            this.bullets.trackSprite(this, 0, 0, true); // Tell the bullets to base their fire position directly of this sprite 
            // Also apply this sprite's rotation to their own.
            this.target = (_target != null) ? _target : null; // If it exists, Set the target to the given value
            this.effectiveRange = (_range != null) ? _range : null; // If it exists, Set the range to the given value
        };
        /**
         * @description Called every frame.
         * Calculates the angle of the gun to face the ship.
         * Fires the gun assuming the fireRate has passed and the ship is within range.
         */
        Gun.prototype.update = function () {
            if (this.target != null) {
                if (Phaser.Point.distance(this.target.position, this.position) <= this.effectiveRange) {
                    var deltaX = this.target.position.x - this.position.x;
                    var deltaY = this.target.position.y - this.position.y;
                    var angle = Math.atan2(deltaY, deltaX);
                    this.rotation = angle;
                    //console.log(Phaser.Point.distance(this.target.worldPosition, this.worldPosition));
                    this.bullets.fire(); // Fire will not "fire" if the fireRate has not passed.
                }
            }
        };
        return Gun;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Gun = Gun;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Gun.js.map