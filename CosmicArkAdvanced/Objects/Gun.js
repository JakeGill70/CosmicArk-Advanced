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
     * @see {Phaser.bullet}
     */
    var Gun = (function (_super) {
        __extends(Gun, _super);
        function Gun(_game, _x, _y, _graphicKey, _name) {
            _super.call(this, _game, _x, _y, _graphicKey); // Pass all the nitty gritty parts to the Phaser.Sprite constructor and let it handle that.
            this.game = _game; // get game contex
            this.anchor.setTo(0.0, 1); // Move the anchor point to the bottom-left
            var debugSp = new Phaser.Sprite(this.game, this.x, this.y, "man");
        }
        /**
         * @description Adds the bullet pool to the game, and adjust all the settings associated with the bullets.
         */
        Gun.prototype.create = function () {
            this.bullets = this.game.add.weapon(10, "bullet"); // Create an object pool for 10 bullets
            this.bullets.bulletKillType = Phaser.Weapon.KILL_LIFESPAN; // Automatically "delete" the bullets after so many milliseconds
            this.bullets.bulletLifespan = 15000; // Set the bullet lifespan to 15000ms (15sec)
            this.bullets.bulletSpeed = 100; // Speed of the bullet in pixels / second
            this.bullets.fireRate = 2000; // Rate-of-fire in ms
            this.bullets.trackSprite(this, 0, 0, true); // Tell the bullets to base their fire position directly of this sprite 
            // Also apply this sprite's rotation to their own.
        };
        /**
         * @description Called every frame. Calculates the angle of the gun to face the ship. Fires the gun assuming the fireRate has passed.
         */
        Gun.prototype.update = function () {
            if (this.target != null) {
                var deltaX = this.target.worldPosition.x - this.worldPosition.x;
                var deltaY = this.target.worldPosition.y - this.worldPosition.y;
                var angle = Math.atan2(deltaY, deltaX);
                this.rotation = angle;
                this.bullets.fire();
            }
        };
        return Gun;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Gun = Gun;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Gun.js.map