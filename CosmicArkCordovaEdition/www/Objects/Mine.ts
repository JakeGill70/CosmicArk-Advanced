module CosmicArkAdvanced {
    /**
     * @Description A floating obstacle that will explode if the player gets too close
     * @property game {Phaser.game}                 - The game context used by everything else in the game.
     * @property tag {CosmicArkAdvanced.PhysicsTag} - What type of physics object is this?
     */
    export class Mine extends Phaser.Sprite implements IPhysicsReady {
        game: Phaser.Game;              // Game Context
        tag: PhysicsTag;                // What type of physics object is this?


        constructor(_game: Phaser.Game, _x: number, _y: number, _name: string) {
            super(_game, _x, _y, "mine"); // Create the sprite at the x,y coordinate in game
            this.tag = CosmicArkAdvanced.PhysicsTag.MINE;       // Label what type of object this is
            this.game.add.existing(this);                   //  Add this object to the gamestate
            this.anchor.set(0.5, 0.5);              // Center the position over the center of the mind sprite
            this.game.physics.enable(this, Phaser.Physics.ARCADE);      // Enable physics for this object so collisions are possible
            this.body.setCircle(this.width / 2, 0, 0);  // Change the collider to a circle
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision first occurs.
         * @param other The object this object collided with
         */
        OnCollisionEnter(other: IPhysicsReady) {
        }

        /**
         * @description Handles what should happen the exact frame a collision occurs. Answers the question "Do I want procede with this collision?"
         * @param other The object this object collided with
         * @returns {boolean} Should this object accept the collision, or act like nothing happened?
         */
        OnCollisionProposal(other: IPhysicsReady) {
            return true; // We want to accept the collision by default
        }

        /**
         * @descirption Handles what should happen for EVERY FRAME of a collision EXCEPT for the first, which is only handled by OnCollisionProposal.
         * @see {this.OnCollisionProposal}
         * @param other The object this object collided with
         */
        OnCollision(other: IPhysicsReady) {
        }

        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object this object collided with
         */
        OnCollisionExit(other) {
        }
    }
}