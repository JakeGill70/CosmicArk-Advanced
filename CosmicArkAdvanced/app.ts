module CosmicArkAdvanced {
    export class MyGame {
        game: Phaser.Game;

        private static AUTO_SCALING = false;

        constructor(elementHook) {
            // Phaser.AUTO selects either WebGL or canvas (Which ever the browser likes better),
            // then places it in the HTML document at 'elementHook' tag.
            this.game = new Phaser.Game(800, 450, Phaser.AUTO, elementHook, {
                create: this.create, preload: this.preload
            });
        }

        preload() {
            // Backgrounds
            this.game.load.image("title", "Graphics/Backgrounds/TitleCard.png");
            this.game.load.image("nightSky", "Graphics/Backgrounds/NightSky.png");
            this.game.load.image("city", "Graphics/Backgrounds/CityBackdrop.png");
            // Sprites
            this.game.load.image("man", "Graphics/Sprites/Man.png");
            this.game.load.image("ship", "Graphics/Sprites/dinghy.png");
            this.game.load.image("mine", "Graphics/Sprites/Mine.png");
            // Static Sprites
            this.game.load.image("planet1", "Graphics/Statics/planet_1.png");
            this.game.load.image("planet2", "Graphics/Statics/planet_2.png");
            this.game.load.image("planet3", "Graphics/Statics/planet_3.png");

            // Audio
            // Use game.load.audio for music
            // Use game.load.audiosprite for SFX
        }

        create() {
            // Add game states
            this.game.state.add("titleScreenState", CosmicArkAdvanced.TitleScreenState, true);
            this.game.state.add("gamePlayState", CosmicArkAdvanced.GamePlayState, false);
            this.game.state.add("mapSelectState", CosmicArkAdvanced.MapSelectState, false);

            if (MyGame.AUTO_SCALING == true) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
        }

    }

    function Dist(srcX, srcY, destX, destY) {
        return ((srcX - destX) + (srcY - destY));
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var game = new CosmicArkAdvanced.MyGame(el);
};