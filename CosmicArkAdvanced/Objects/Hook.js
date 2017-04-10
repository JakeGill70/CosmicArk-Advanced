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
     * @see {Phaser.bullet}
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
            this.frameDelay = 0;
            this.game.add.existing(this); // Add this object to the gamestate
            this.effectiveRange = 10000; // Make a default value for the range. 10,000 gives plenty of headroom
            this.anchor.setTo(0.0, 1); // Move the anchor point to the bottom-left
            // If the target exists, initialize the object pool, target, and range
            if (_target != null) {
                this.init_target(_target, 375); // A range of 375 pixels feels right for right now
                var points = [];
                for (var i = 0; i < 20; i++) {
                    points.push(new Phaser.Point(Phaser.Math.bezierInterpolation([this.x, this.target.x], i / 20), Phaser.Math.bezierInterpolation([this.y, this.target.y], i / 20)));
                }
                this.rope = new Phaser.Rope(this.game, 0, 0, "rope", null, points);
                this.game.add.existing(this.rope);
            }
        }
        Hook.prototype.init_target = function (_target, _range) {
            this.target = (_target != null) ? _target : null; // If it exists, Set the target to the given value
            this.effectiveRange = (_range != null) ? _range : null; // If it exists, Set the range to the given value
        };
        /**
         * @description Called every frame.
         * Calculates the angle of the gun to face the ship.
         * Fires the gun assuming the fireRate has passed and the ship is within range.
         */
        Hook.prototype.update = function () {
            this.frameDelay++;
            if (this.target != null) {
                if (Phaser.Point.distance(this.target.worldPosition, this.worldPosition) <= this.effectiveRange) {
                    var deltaX = this.target.worldPosition.x - this.worldPosition.x;
                    var deltaY = this.target.worldPosition.y - this.worldPosition.y;
                    var angle = Math.atan2(deltaY, deltaX);
                    this.rotation = angle;
                    if (this.rope != null && this.frameDelay % 5 == 0) {
                        this.frameDelay = 0;
                        //for (let i: number = 0; i < 20; i++) {
                        //    this.rope.points[i] = new Phaser.Point(Phaser.Math.bezierInterpolation([this.x, this.target.x], i / 20),
                        //        Phaser.Math.bezierInterpolation([this.y, this.target.y], i / 20));
                        //}
                        for (var i = 0; i < 20; i++) {
                            this.rope.points[i] = new Phaser.Point(Phaser.Math.bezierInterpolation([this.x, this.target.x], i / 20), Phaser.Math.bezierInterpolation([this.y, this.target.y], i / 20));
                        }
                        this.rope.segments = new Phaser.Rope(this.game, 0, 0, "rope", null, this.rope.points).segments;
                    }
                }
            }
        };
        return Hook;
    }(Phaser.Sprite));
    CosmicArkAdvanced.Hook = Hook;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Hook.js.map