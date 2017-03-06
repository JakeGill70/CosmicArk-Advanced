module CosmicArkAdvanced {
    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;
        backdrop1: Phaser.Image;
        backdrop2: Phaser.Image;
        player: CosmicArkAdvanced.Player;
        man1: CosmicArkAdvanced.Man;

        constructor() {
            super();
        }

        create() {
            // Be careful, the order the objects are added into the state, is the order they will be rendered onto the screen
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, 0, "city");
            this.player = new Player(this.game, 0, 50);
            this.man1 = new Man(this.game, 50, this.game.height - 50);

            // Make adjustments
            this.backdrop1.scale.setTo(this.game.width / this.backdrop1.width, this.game.height / this.backdrop1.height);  // Scale it to fit the size of the screen
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height);  // Scale it to fit the size of the screen

            // Add them into the state
            this.game.add.existing(this.backdrop1);
            this.game.add.existing(this.backdrop2);
            this.game.add.existing(this.player);
            this.game.add.existing(this.man1);

            console.log("Gameplay Create Called");
        }
    }
}