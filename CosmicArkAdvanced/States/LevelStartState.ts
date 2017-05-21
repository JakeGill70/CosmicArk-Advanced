﻿module CosmicArkAdvanced {
        /**
    * @description Level starting splash screen, explaining specifics of current level win/lose conditions
    * @property game {Phaser.Game}             - The game context
    * @property music {Phaser.Sound}           - The SFX player
    * @property game {Phaser.Sprite}           - The actual splash screen image to display
    * @property uiText {Phaser.BitmapText}     - Temp UI element for displaying score information
    */
          export class LevelStartState extends Phaser.State {
       game: Phaser.Game;
            music: Phaser.Sound;
            titleScreenImage: Phaser.Sprite;
            uiText: Phaser.BitmapText;          // UI Text for updating score information
    
               /**
        * @constructor Default.
        */
              constructor() {
                  super();
              }
    
               /**
        * @description Displays the splash image and scales it appropriately. Also registers the "onTap" event
        */
               create() {
                   //if (!this.game.device.desktop) {
                       //    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                       //    this.game.scale.startFullScreen(false);
                       //}
           
                       console.log("the LevelStartState has started!"); // testing
       
                      this.titleScreenImage = this.add.sprite(0, 0, "main"); // Pull the image out of memory
                  //this.titleScreenImage = this.add.sprite(0, 0, "nightSky"); // Pull the image out of memory
                      this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height);  // Scale it to fit the size of the screen
       
                       // UI
                       this.uiText = this.game.add.bitmapText(40, 150, "EdoSZ", // maybe x = 50 would look better
                               "TIME ALOTTED: " /*+ this.player.aliensOnBoard.toString()*/ +
                               "\nHUMANS NEEDED: " /*+ this.player.aliensCaptured.toString()*/ +
                               "\nLIVES PROVIDED: ");
       
                       // Register the "TitleClicked" even handler
                       this.input.onTap.addOnce(this.LevelStartClicked, this);
               }
    
        /**
        * @description Handles the "onTap" event. Just moves over to the gamePlayState state.
        */
               LevelStartClicked() {
                   this.game.state.start("gamePlayState"); // Jump to the GamePlayState
               }
        }
}