module CosmicArkAdvanced {

    // TODO: Is supercollider still needed? Can IPhysics ready be gutted? How much of this code is dead now?


    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;                  // Game Refence
        backdrop1: Phaser.Image;            // Night Sky
        backdrop2: Phaser.Image;            // Left half of city
        backdrop2_2: Phaser.Image;          // Right half of city
        player: CosmicArkAdvanced.Player;   // Player object
        playerGroup;
        beam: Phaser.Graphics;              // Player's 'tractor beam'
        man1: CosmicArkAdvanced.Man;        // Test Alien
        aliens: CosmicArkAdvanced.IPhysicsReady[];            // List of aliens in this scene that are capable of recieving physics calls

        dict:any[];                         // 2 key dictionary of IPhysicsReady object's names which define a boolean value for if the two objects were colliding as of the previous frame.

        constructor() {
            super();
            this.aliens = [];
            this.dict = [];
        }

        create() {
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);

            

            // Be careful, the order the objects are added into the state, is the order they will be rendered onto the screen
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, this.game.world.height, "city");
            this.backdrop2_2 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");
            this.beam = new Phaser.Graphics(this.game);
            this.player = new Player(this.game, 50, 50, "player", this.beam);
            this.player.addChild(this.beam);
            this.man1 = new Man(this.game, 50, this.game.world.height - 50, "man1"); // eventually, this creation should be in a loop. Don't forget to make the name unique!

            // Make adjustments to objects
            this.backdrop1.scale.setTo(this.game.world.width / this.backdrop1.width, this.game.world.height / this.backdrop1.height);  // Scale it to fit the size of the screen
            this.backdrop2.anchor.setTo(0, 1);
            this.backdrop2_2.anchor.setTo(0, 1);
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height);        // Scale it to fit the size of the screen
            this.backdrop2_2.scale.setTo(this.game.width / this.backdrop2_2.width, this.game.height / this.backdrop2_2.height);  // Scale it to fit the size of the screen

            // Add them into the state
            this.game.add.existing(this.backdrop1);
            this.game.add.existing(this.backdrop2);
            this.game.add.existing(this.backdrop2_2);
            this.game.add.existing(this.player);
            this.game.add.existing(this.man1);

            // Set Camera settings
            this.game.camera.follow(this.player);

            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Turn on physics for the required objects
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.collideWorldBounds = true;     // Automatically lock the players sprite into the world so they cannot move off screen.
            
            this.game.physics.enable(this.man1, Phaser.Physics.ARCADE);
            this.aliens.push(this.man1);        // Man one is a test case, in reality, these would be made inside of a for loop.
            let offset = 75;
            this.man1.body.setSize(this.man1.width, this.man1.height + offset, 0, -offset);
        }

        // TODO: Move the collision stuff from the update function into it's own method, maybe two, idk at the moment. 

        update() {
            for (let i = 0; i < this.aliens.length; i++){
                let alien = this.aliens[i];
                //this.superCollider(this.player, alien); // Original

                // TEMP
                if (this.game.physics.arcade.collide(this.player, alien)) {
                    this.player.startAbducting(alien as Man);
                }
                else {
                    this.player.stopAbducting();
                }
                // END TEMP
            }
        }

        superCollider(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            if (this.game.physics.arcade.collide(obj1, obj2, this.OnCollisionCaller, this.OnCollisionProposalCaller)) {        
                                                                  // if there is a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == false) { // but there wasn't one last time we checked
                        this.OnCollisionEnterCaller(obj1, obj2);    // then tell the objects a collision has started
                    }
                    this.dict[obj1.name, obj2.name] = true;         // and mark this collision as new
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false;        // If there was an exception, 
                                                                    // it is because that dictionary entry doesn't exist yet. 
                                                                    // So add it here.
                }
            }
            else {                                              // If there WASN'T a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == true) {  // but there was last time we checked
                        this.OnCollisionExitCaller(obj1, obj2);     // then tell the objects the collision is over
                    }
                    this.dict[obj1.name, obj2.name] = false;        // and mark this collision as old
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false;        // If there was an exception, 
                                                                    // it is because that dictionary entry doesn't exist yet. 
                                                                    // So add it here.
                }
            }
        }

        OnCollisionProposalCaller(obj1:IPhysicsReady, obj2:IPhysicsReady) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        }

        OnCollisionEnterCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        }

        OnCollisionCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        }

        OnCollisionExitCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        }

        render() {
            // Debug feature...
            this.game.debug.body(this.player);
            this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
        }
    }
}
