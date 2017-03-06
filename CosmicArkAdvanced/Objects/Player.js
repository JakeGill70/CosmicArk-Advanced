var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(_game, _x, _y) {
            this.game = _game; // get game context
            this.moveSpeed = 15; // Set current walking speed
            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen
            _super.call(this, _game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.0, 1.0); // Move anchor point to the bottom-left
            this.scale.set(2.0, 2.0);
            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        Player.prototype.create = function () {
        };
        Player.prototype.update = function () {
            this.arrowKeyMovement();
            this.touchMovement();
        };
        Player.prototype.touchMovement = function () {
            var pos = this.game.input.position;
            var ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            var moveAmtX = this.realSpeed() * Math.cos(ang);
            var moveAmtY = this.realSpeed() * Math.sin(ang);
            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold) {
                    // Move along the X-axis
                    if (Phaser.Math.difference(this.position.x, pos.x) > this.moveDistThreshold) {
                        this.x += moveAmtX;
                    }
                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.y += moveAmtY;
                    }
                }
            }
        };
        Player.prototype.arrowKeyMovement = function () {
            // TODO: Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // Horizontal movement
            if (this.cursor.right.isDown == true) {
                this.x += this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
            else if (this.cursor.down.isDown == true) {
                this.y += this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
        };
        Player.prototype.getDeltaTime = function () {
            return (this.game.time.elapsedMS / 60);
        };
        Player.prototype.realSpeed = function () {
            return (this.moveSpeed * this.getDeltaTime());
        };
        return Player;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Player = Player;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Player.js.map