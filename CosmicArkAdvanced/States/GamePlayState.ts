module CosmicArkAdvanced {
    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;                  // Game Refence
        backdrop1: Phaser.Image;            // Night Sky
        backdrop2: Phaser.Image;            // Left half of city
        backdrop2_2: Phaser.Image;          // Right half of city
        player: CosmicArkAdvanced.Player;   // Player object
        man1: CosmicArkAdvanced.Man;        // Test Alien
        aliens: CosmicArkAdvanced.IPhysicsReady[];            // List of aliens in this scene that are capable of recieving physics calls

        constructor() {
            super();
            this.aliens = [];
        }

        create() {
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);

            // Be careful, the order the objects are added into the state, is the order they will be rendered onto the screen
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, this.game.world.height, "city");
            this.backdrop2_2 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");
            this.player = new Player(this.game, 0, 50);
            this.man1 = new Man(this.game, 50, this.game.world.height - 50);

            // Make adjustments to objects
            this.backdrop1.scale.setTo(this.game.world.width / this.backdrop1.width, this.game.world.height / this.backdrop1.height);  // Scale it to fit the size of the screen
            this.backdrop2.anchor.setTo(0, 1);
            this.backdrop2_2.anchor.setTo(0, 1);
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height);  // Scale it to fit the size of the screen
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

            
            
        }

        update() {
            for (let i = 0; i < this.aliens.length; i++){
                let alien = this.aliens[i];
                this.game.physics.arcade.collide(this.player, alien, this.OnCollisionCaller, this.OnCollisionEnterCaller);
            }
        }

        OnCollisionEnterCaller(obj1:IPhysicsReady, obj2:IPhysicsReady) {
            return (obj1.OnCollisionEnter(obj2) && obj2.OnCollisionEnter(obj1));
        }

        OnCollisionCaller(obj1, obj2) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        }

        render() {
            // Debug feature...
            this.game.debug.body(this.player);
            this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
        }
    }
}