module CosmicArkAdvanced {

    // This interface can only be applied to objects derived from Phaser.sprite.
    // This interface forces an object to have properly qualified functions ready
    // to be called by the gamestate.
    export interface IPhysicsReady extends Phaser.Sprite{
        tag: PhysicsTag;                                // Enum to better distinguish what class of object was collided with in the collision methods.
        OnCollisionProposal(other): boolean;            // Determines if the collision should be ignored. True accepts the collision, false denies it. 
                                                        // This is called for every frame of the collision.
        OnCollisionEnter(other);                        // What should happen the moment the two objects START colliding?
        OnCollision(other);                             // What should happen WHILE a collision occurs, and is accepted by BOTH parties.
                                                        // This is called for every frame of the collision.
        OnCollisionExit(other);                         // What should happen AFTER the two object STOPS colliding?

        //constructor (_game: Phaser.Game, _x: number, _y: number, _name: string):any; // Reccomended constructor
    }
}