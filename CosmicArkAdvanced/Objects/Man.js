var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var Man = (function (_super) {
        __extends(Man, _super);
        function Man(_game, _x, _y, _name) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name
            this.moveSpeed = 5; // Set current walking speed
            this.tag = CosmicArkAdvanced.PhysicsTag.ALIEN; // Physics tag to determine how other sections of code should interact with it.
            _super.call(this, _game, _x, _y, "man"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center
        }
        Man.prototype.create = function () {
        };
        Man.prototype.update = function () {
            this.autoMovement();
        };
        Man.prototype.autoMovement = function () {
            // Horizontal movement
            if ((this.position.x > (this.game.world.width * 0.90)) || (this.position.x < (this.game.world.width * 0.10))) {
                this.turnToFaceCenter();
            }
            this.x += this.realSpeed();
        };
        Man.prototype.turnToFaceCenter = function () {
            if (this.position.x > this.game.world.width * 0.5) {
                this.moveSpeedCurr = this.moveSpeed * -1.0;
                this.scale.setTo(-1, 1);
            }
            else {
                this.moveSpeedCurr = this.moveSpeed;
                this.scale.setTo(1, 1);
            }
        };
        Man.prototype.getDeltaTime = function () {
            return (this.game.time.elapsedMS / 60);
        };
        Man.prototype.realSpeed = function () {
            return (this.moveSpeedCurr * this.getDeltaTime());
        };
        Man.prototype.OnCollisionEnter = function (other) {
            console.log("Man Enter");
        };
        Man.prototype.OnCollisionProposal = function (other) {
            return true;
        };
        Man.prototype.OnCollision = function (other) {
            //console.log("Collision Code on man");
        };
        Man.prototype.OnCollisionExit = function (other) {
            console.log("Man Exit");
        };
        return Man;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Man = Man;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Man.js.map