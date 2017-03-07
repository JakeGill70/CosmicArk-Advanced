module CosmicArkAdvanced {

    // This interface can only be applied to objects derived from Phaser.sprite.
    // This interface forces an object to have properly qualified functions ready
    // to be called by the gamestate.
    export interface IPhysicsReady extends Phaser.Sprite{
        OnCollisionEnter(other) : Boolean;             // Determines if the collision should be ignored.    
        OnCollision(other);                            // What should happen when a collision occurs
    }
}