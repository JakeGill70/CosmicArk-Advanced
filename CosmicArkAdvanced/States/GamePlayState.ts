module CosmicArkAdvanced {
    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;
        player: CosmicArkAdvanced.Player;

        constructor() {
            super();
        }

        create() {
            this.player = new Player(this.game, 0, this.game.height - 50);
            this.game.add.existing(this.player);

            console.log("Gameplay Create Called");
        }
    }
}