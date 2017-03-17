var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    //TODO: Come up with someway to notify the player which the ship is close enough to abduct an alien
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(_game, _x, _y, _name, _beam) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name
            this.beam = _beam;
            this.moveSpeed = 15; // Set current walking speed
            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen
            this.tag = CosmicArkAdvanced.PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.
            this.isAbudcting = false; // is the player abduction someone right now?
            this.abductionSpeed = 10; // Set the speed which aliens are abducted at.
            _super.call(this, _game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-left
            //this.scale.set(2.0, 2.0);
            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        Player.prototype.create = function () {
        };
        Player.prototype.update = function () {
            if (!this.game.paused) {
                this.isMoving = false; // Turn this flag off. Movement will turn it back on if needed.
                this.arrowKeyMovement();
                this.touchMovement();
                if (this.isMoving) {
                    this.stopAbducting();
                }
                if (this.isAbudcting) {
                    if (this.alienAbductee.x != this.x) {
                        this.alienAbductee.x = Phaser.Math.bezierInterpolation([this.alienAbductee.x, this.x], 0.085); // 0.085 felt like a good speed. No significant meaning.
                    }
                }
            }
        };
        Player.prototype.touchMovement = function () {
            var pos = new Phaser.Point(this.game.input.worldX, this.game.input.worldY);
            var ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            var moveAmtX = this.realSpeed() * Math.cos(ang);
            var moveAmtY = this.realSpeed() * Math.sin(ang);
            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold) {
                    // Move along the X-axis
                    if (Phaser.Math.difference(this.position.x, pos.x) > this.moveDistThreshold) {
                        this.x += moveAmtX;
                        // Stop abducting when moving
                        this.isMoving = true;
                    }
                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.y += moveAmtY;
                        // Stop abducting when moving
                        this.isMoving = true;
                    }
                }
            }
        };
        Player.prototype.arrowKeyMovement = function () {
            // Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // This keeps the ship from moving too fast when diagonal. For more, look up "vector addition".
            var isDiagonal = ((this.cursor.right.isDown || this.cursor.left.isDown) && (this.cursor.up.isDown || this.cursor.down.isDown));
            // Horizontal movement
            if (this.cursor.right.isDown == true) {
                this.x += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
            else if (this.cursor.down.isDown == true) {
                this.y += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
                // Stop abducting when moving
                this.isMoving = true;
            }
        };
        Player.prototype.getDeltaTime = function () {
            return (this.game.time.elapsedMS / 60);
        };
        Player.prototype.realSpeed = function () {
            return (this.moveSpeed * this.getDeltaTime());
        };
        Player.prototype.OnCollisionEnter = function (other) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.ALIEN) {
                this.startAbducting(other);
                this.beamDrawHeight = other.worldPosition.y - this.worldPosition.y + this.height / 2;
            }
        };
        Player.prototype.OnCollisionProposal = function (other) {
            return true; // We want to accept the collision by default
        };
        Player.prototype.OnCollision = function (other) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.ALIEN) {
                this.renderBeam();
            }
        };
        Player.prototype.OnCollisionExit = function (other) {
            this.stopAbducting();
        };
        Player.prototype.stopAbducting = function () {
            if (this.alienAbductee != null) {
                this.alienAbductee.stopAbducting();
                this.alienAbductee = null;
            }
            this.isAbudcting = false;
            this.beam.clear(); // Destroy any graphic's artifacts of the beam
        };
        Player.prototype.startAbducting = function (a) {
            if (this.isMoving) {
                return; // If the player is moving, just go ahead and kick out of this.
            }
            if (this.alienAbductee == null) {
                this.beamDrawHeight = a.worldPosition.y - this.worldPosition.y + this.height / 2;
            }
            this.alienAbductee = a;
            this.alienAbductee.startAbducting(this.abductionSpeed);
            this.isAbudcting = true;
            this.renderBeam(); // TEMP
        };
        // TODO: Find some way to draw the beam behind the ship
        Player.prototype.renderBeam = function () {
            this.beam.clear(); // Destroy the beam from the previous frame
            // Pick a random color, favoriting blue, with the ranges like so:
            // r: 0-45          g: 75-150           b: 155-255
            var color = Phaser.Color.getColor(Math.random() * 45, Math.random() * 75 + 75, Math.random() * 100 + 155);
            // beamDrawHeight is calculated OnCollisionEnter()
            var rect = new Phaser.Rectangle(-this.width / 2, -this.height / 2, this.width, this.beamDrawHeight);
            this.beam.lineStyle(1, color, 0.75);
            this.beam.beginFill(color, 0.8);
            this.beam.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.beam.endFill();
        };
        return Player;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Player = Player;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Player.js.map