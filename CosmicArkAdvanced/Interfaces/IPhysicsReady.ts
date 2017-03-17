module CosmicArkAdvanced {

    /** 
    * @desription This interface forces an object to have properly qualified functions ready
    * to be called by the gamestate. This interface should only be applied to objects derived from Phaser.sprite.
    * It is reccomended that the the constructor include a parameter for the Sprite.name property.
    * This property is used like a unique identifer to the object, and is how collision data is stored in a dictionary in the gamestate.
    * @interface
    * @see {Phaser.Sprite} */
    export interface IPhysicsReady extends Phaser.Sprite{

        /** @desription Enum to better distinguish what class of object was collided with in the collision methods. 
        * @property 
        * @see {CosmicArkAdvanced.PysicsTag} */
        tag: PhysicsTag;

        /** @desription Determines if the collision should be ignored.
        * This is called for every frame of the collision.
        * @returns {boolean} True accepts the collision, false denies it. 
        * @function */
        OnCollisionProposal(other): boolean;             
       
        /** @desription What should happen the moment the two objects START colliding? 
        * @function */ 
        OnCollisionEnter(other);     
        
        /** @desription What should happen WHILE a collision occurs? (Assuming it has been accepted by BOTH parties.)
        * This is called for every frame of the collision.
        * @function */                  
        OnCollision(other); 

        /** @desription What should happen AFTER the two object STOPS colliding? 
        * @function */ 
        OnCollisionExit(other);
    }
}