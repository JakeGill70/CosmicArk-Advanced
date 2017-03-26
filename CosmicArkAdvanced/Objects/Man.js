var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    // TODO: A lot of this needs to split off into a default abstract class called "ALIEN"
    var Man = (function (_super) {
        __extends(Man, _super);
        function Man(_game, _x, _y, _name) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name
            this.moveSpeed = 5; // Set current walking speed
            this.tag = CosmicArkAdvanced.PhysicsTag.ALIEN; // Physics tag to determine how other sections of code should interact with it.
            this.canMove = true; // Let the alien know that it is ok to move around for right now
            this.isBeingAbducted = false; // Let the alien know that nothing is capturing him.... yet....
            this.startY = _y;
            _super.call(this, _game, _x, _y, "man"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-center
        }
        Man.prototype.create = function () {
        };
        Man.prototype.update = function () {
            // OR this with other flags as needed
            this.canMove = !this.isBeingAbducted; // We can move if we are not being abducted
            //console.log(this.startY + ", " + this.worldPosition.y);
            if (this.canMove) {
                this.autoMovement();
            }
            else {
                if (this.isBeingAbducted) {
                    this.y -= this.realAbductionSpeed();
                }
            }
        };
        Man.prototype.autoMovement = function () {
            // Horizontal movement
            if ((this.position.x > (this.game.world.width * 0.90)) || (this.position.x < (this.game.world.width * 0.10))) {
                this.turnToFaceCenter();
            }
            this.x += this.realSpeed();
            // Reset Y coord
            this.y = this.startY;
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
        Man.prototype.realAbductionSpeed = function () {
            return (this.abductionSpeed * this.getDeltaTime());
        };
        Man.prototype.stopAbducting = function () {
            console.log("Whew, that was close - they let me go!");
            this.isBeingAbducted = false;
            this.tint = 0xFFFFFF;
        };
        Man.prototype.startAbducting = function (spd) {
            console.log("OH NO!! I'M BEING ABDUCTED!!!");
            this.isBeingAbducted = true;
            this.abductionSpeed = spd;
            this.tint = 0x5DDEFF;
        };
        Man.prototype.OnCollisionEnter = function (other) {
        };
        Man.prototype.OnCollisionProposal = function (other) {
            return true;
        };
        Man.prototype.OnCollision = function (other) {
        };
        Man.prototype.OnCollisionExit = function (other) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.PLAYER) {
            }
        };
        return Man;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Man = Man;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Man.js.map