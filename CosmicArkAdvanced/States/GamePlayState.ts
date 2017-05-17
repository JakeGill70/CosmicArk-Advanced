﻿module CosmicArkAdvanced {

    // TODO: Is supercollider still needed? Can IPhysics ready be gutted? How much of this code is dead now?

    /**
     * @description The meat and potatoes of the game. This is where the actual "game" part lives.
     * @property game {Phaser.Game}                         - The game context
     * @property player {Phaser.Sprite}                     - The player object 
     * @property man1 {CosmicArkAdvanced.Man}               - Test Alien
     * @property aliens {CosmicArkAdvance.IPhysicsReady[]}  - List of aliens in this scene that are capable of recieving physics calls
     * @property dict {any[]}                               - A 2-keyed dictionary which maps 2 strings to a boolean value. Maps out physics collision states.
     * @property gun1 {CosmicArkAdvanced.Gun}               - Test Gun
     * @property mine1 {CosmicArkAdvanced.Mine}             - Test Mine
     * @property hook1 {CosmicArkAdvanced.Hook}             - Test Hook
     * @property uiText {Phaser.BitmapText}                 - Temp UI element for displaying score information
     * @property uiText_Score {Phaser.BitmapText}           - Temp UI element for displaying the literal score information <edf>
     */
    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;                  // Game Refence
        player: CosmicArkAdvanced.Player;   // Player object
        man1: CosmicArkAdvanced.Man;        // Test Alien
        aliens: CosmicArkAdvanced.IPhysicsReady[];          // List of aliens in this scene that are capable of recieving physics calls

        men: Phaser.Group;

        myBatch: Phaser.SpriteBatch;

        guns: CosmicArkAdvanced.Gun[];      // Collection of guns  in the game <edf>
        mines: CosmicArkAdvanced.Mine[];    // Collection of mines in the game <edf>
        hooks: CosmicArkAdvanced.Hook[];    // Collection of hooks in the game <edf>

        mothership: Phaser.Sprite;          // Mothership object

        dict: any[];                        // 2 key dictionary of IPhysicsReady object's names which define a boolean value for if the two objects were colliding as of the previous frame.

        gun1: CosmicArkAdvanced.Gun;        // Test gun
        mine1: CosmicArkAdvanced.Mine;      // Test mine
        hook1: CosmicArkAdvanced.Hook;      // Test hook

        uiText: Phaser.BitmapText;          // UI Text for updating score information
        uiText_Score: Phaser.BitmapText;    // UI Text for updating the literal score information <edf>

        /**
         * @description Mostly empty. Does initialize the aliens list and the dictionary.
         * @constructor
         */
        constructor() {
            super();
            this.aliens = [];
            this.guns = [];
            this.mines = [];
            this.hooks = [];
            this.dict = [];
        }

        addMan(x: number = (-1), y: number = (this.game.world.height - 70)) {
            console.log(this.myBatch);
            if (x == -1) {
                x = Math.random() * 1000 + 150;
                x = Math.round(x);
            }
            let m = new Man(this.game, x, y);    // eventually, this creation should be in a loop. Don't forget to make the name unique!
            //this.men.add(m);
            //this.aliens.push(m);        // Man one is a test case, in reality, these would be made inside of a for loop.
            this.myBatch.add(m);
        }

        /**
         * @description Creates the game world by both creating and initializing all the objects in the game state.
         */
        create() {

            this.men = this.game.add.group();

            

            // Use this for debugging to measure FPS
            this.game.time.advancedTiming = true;

            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            
            // Make the objects
            this.makeBackgrounds();
            this.makeMotherShip();
            this.player = new Player(this.game, 0, 0, "player");
            this.gun1 = new Gun(this.game, 150, this.game.world.height - 50, "gun", "gun1", this.player);
            this.guns.push(this.gun1);
            this.mine1 = new Mine(this.game, 200, 200, "mine1");
            this.mines.push(this.mine1);
            this.hook1 = new Hook(this.game, 400, this.game.world.height - 50, "gun", "hook1", this.player);
            this.hooks.push(this.hook1);

            // Aliens should always be created after the player so that they don't accidently render behind the tractor beam
            this.myBatch = this.game.add.spriteBatch(this.game.add.image(0,0));
            this.addMan(50); 
            this.addMan(100); 
            this.addMan(150); 
            this.addMan(200); 
            this.addMan(250);
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();
            this.addMan();

            // Set Camera settings
            this.game.camera.follow(this.player);

            // UI
            this.uiText = this.game.add.bitmapText(8, 0, "EdoSZ",
                "IN TRANSIT: " + this.player.aliensOnBoard.toString() +
                "\nCAPTURED: " + this.player.aliensCaptured.toString());
            this.uiText.fixedToCamera = true;

            this.uiText_Score = this.game.add.bitmapText(650, 0, "EdoSZ",
                "Score: ");

            this.uiText_Score.fixedToCamera = true;


            //this.game.add.text(8, 18, "Captured: " + this.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
        }

        /**
         * @descirption Creates the mothership sprite and adjust it's properties accordingly.
         */
        makeMotherShip() {
            this.mothership = this.game.add.sprite(0, 0, "mothership");
            this.mothership.scale.set(1, 1);
            // These numbers are largely abitrary. I did some trial and error and came up with these. -- Jake Gillenwater
            this.mothership.position.set(this.game.world.width / 2 - this.mothership.width / 2, (-this.mothership.height / 2) + 32);
            this.game.physics.enable(this.mothership, Phaser.Physics.ARCADE);
            this.mothership.body.setCircle(this.mothership.width * 0.75, this.mothership.width * -0.25, this.mothership.width * -1.18);
        }

        /**
         * @description Adds the background images to the gamestate and scales them appropriately
         */
        makeBackgrounds() {
            //let bd = new Phaser.Image(this.game, 0, this.game.world.height, "city1");
            this.game.add.image(0, 0, "city1");
        }

        /**
         * @description Currently only used for checking collisions between objects
         */
        update() {
            this.collideObjects();


            for (let n = 0; n < this.myBatch.hash.length; n++) {
                (this.myBatch.hash[n] as CosmicArkAdvanced.Man).update();
            }


            // For testing purposes only
            let alienPos = [];
            for (let i = 0; i < this.myBatch.length; i++) {
                alienPos.push("Hello");
            }
            console.log(alienPos);



            this.uiText.text = "In Transit: " + this.player.aliensOnBoard.toString() +
                //"\tSCORE: " +
                "\nCaptured: " + this.player.aliensCaptured.toString();

            this.uiText_Score.text = "Score: "; // <edf>
        }

        /**
         * @description Called ever frame through the update method. Place collision checks here.
         */
        collideObjects() {
            // Collide the player's ship with the gun's bullets
            for (let n = 0; n < this.guns.length; n++) {
                for (let i = 0; i < this.guns[n].bullets.bullets.length; i++) {
                    if (!this.player.isHooked && this.game.physics.arcade.overlap(this.player, this.guns[n].bullets.bullets.getAt(i))) {
                        let b = this.guns[n].bullets.bullets.getAt(i) as Phaser.Bullet;
                        b.kill();
                        console.log("OUCH!!!!!");
                    }
                }
            }
            
            
            // Collide the player's ship with the hooks
            for (let n = 0; n < this.hooks.length; n++) {
                for (let i = 0; i <= this.hooks[n].wep.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.hooks[n].wep.bullets.getAt(i))) {
                        let b = this.hooks[n].wep.bullets.getAt(i) as Phaser.Bullet;
                        this.hooks[n].targetHooked();
                    }
                }
            }
            

            // Collide the player's ship with the aliens
            for (let i = 0; i < this.aliens.length; i++) {
                let alien = this.aliens[i];
                
                // TODO: Bugfix: Fix it so that the ship cannot abduct an alien if the ship is too low
                // TODO: Changing animation shouldn't happen here, bad OOP practice. Move it to the OnCollision inside of player instead
                if (this.game.physics.arcade.overlap(this.player, alien)) {
                    if (this.player.isAbudcting) {
                        this.player.animations.frame = 0;
                    }
                    else {
                        this.player.animations.frame = 1;
                    }

                    this.player.Abduct(alien as Man);
                }
                else {
                    this.player.animations.frame = 0;
                }
            }

            // Collide the player's ship with the mines
            for (let n = 0; n < this.mines.length; n++) {
                if (this.game.physics.arcade.overlap(this.player, this.mines[n])) {
                    let spt = this.game.add.sprite(0, 0, "bang");
                    spt.scale.set(1.35, 1.35);
                    spt.position.setTo(this.mines[n].x - spt.width / 2, this.mines[n].y - spt.height / 2);
                    spt.animations.add("bang_anim", null, 20, false);
                    spt.animations.play("bang_anim", null, false, true);
                    this.mines[n].destroy(true);
                }
            }
            

            // Collide the player's ship with the mothership
            if (this.game.physics.arcade.overlap(this.player, this.mothership)) {
                this.player.Capture();
            }
        }

        /**
         * @description This is the super in-depth version of collision checking I (Jake) created. Checks for collisions between two objects and triggers the appropriate events on the object.
         * @param obj1  The first object to check collision against
         * @param obj2  The second object to check collision against
         */
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

        /**
         * @descirption Calls the OnCollisionProposal events on both objects, and return their answer. Both objects must accept the proposal before continueing.
         * @param obj1
         * @param obj2
         */
        OnCollisionProposalCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        }

        /**
         * @descirption Calls the OnCollisionEnter events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionEnterCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        }

        /**
         * @description Calls the OnCollision events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        }

        /**
         * @description Calls the OnCollisionExit events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionExitCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        }

        /**
         * @description Post rendering effects.
         */
        render() {
            // Debug features...
            // this.game.debug.body(this.player);
            // this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
            // this.gun1.bullets.debug();
            // this.game.debug.body(this.mine1);
            // this.game.debug.ropeSegments(this.hook1.rope);
            // this.game.debug.body(this.mothership);
            this.game.debug.text(this.game.time.fps.toString(), 8, 80);

        }
    }
}
