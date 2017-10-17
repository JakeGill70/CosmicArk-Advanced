var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    // Yo yo yo this be ethan dawg!
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
     * @property uiBtn_Pause {Phaser.Button}                - Temp UI element for displaying a pause button icon
     * @property uiText_Restart {Phaser.BitmapText}         - Temp UI element for displaying a restart option in the pause menu
     * @property uiText_Difficulty {Phaser.BitmapText}      - Temp UI element for displaying a difficulty option in the pause menu
     * @property uiText_Restart {Phaser.BitmapText}         - Temp UI element for displaying a restart option in the pause menu
     */
    class GamePlayState extends Phaser.State {
        /**
         * @description Mostly empty. Does initialize the aliens list and the dictionary.
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * @description TODO
         */
        init(difficulty, timeToCapture, numberToCapture, score) {
            // Assign aurguments to class level properties
            this.difficulty = difficulty;
            this.numberToCapture = numberToCapture;
            this.timeToCapture = timeToCapture;
            this.score = score;
            // Make the level timer
            this.levelTimer = this.game.time.create(false);
            this.levelTimer.loop(timeToCapture * 1000, this.OutOfTime, this);
            // Initialize arrays
            this.aliens = [];
            this.guns = [];
            this.mines = [];
            this.hooks = [];
            this.dict = [];
        }
        /**
         * @description adding mines to the level
         * @param x and y coordinates
         */
        addMine(x, y) {
            if (x == null || x == undefined) {
                x = this.game.world.width * Math.random();
            }
            if (y == null || y == undefined) {
                y = Math.floor(this.game.world.height - ((Math.random() * 150) + 125)); // 125 - 274
            }
            let m = new CosmicArkAdvanced.Mine(this.game, x, y, "mine1");
            this.mines.push(m);
        }
        addGun(spd, x, y = (this.game.world.height - 50)) {
            if (x == null) {
                x = -1;
                let minDist = 327 * (Math.E ^ (-0.592 * this.difficulty)); // Roughly equal to halfing the orginal 200, but weighting it to be a more giving in the higher levels
                while (x == -1) {
                    x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                    for (let g of this.guns) {
                        if (Phaser.Math.difference(x, g.x) < minDist) {
                            x = -1;
                            break;
                        }
                    }
                    minDist -= 0.05; // Lower the bounds in case more guns get added than the level can support
                }
            }
            if (spd == null) {
                spd = 20 * this.difficulty + 60;
            }
            let gun = new CosmicArkAdvanced.Gun(this.game, x, y, "gunTop", spd, this.player);
            //gun.bullets.fireRate = 6290 * (Math.E ^ (-0.233 * this.difficulty));
            gun.bullets.fireRate = (58 * this.difficulty * this.difficulty) - (1093 * this.difficulty) + 5946;
            gun.bullets.fireRateVariance = (Math.random() * 25 + 25) * ((this.difficulty % 3) + 1);
            this.guns.push(gun);
        }
        addHook(spd, x, y = (this.game.world.height - 50)) {
            if (x == null || x == undefined) {
                x = -1;
                let minDist = 327 * (Math.E ^ (-0.592 * this.difficulty));
                while (x == -1) {
                    x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                    for (let h of this.hooks) {
                        if (Phaser.Math.difference(x, h.x) < minDist) {
                            x = -1;
                            break;
                        }
                    }
                }
            }
            if (spd == null || spd == undefined) {
                spd = 20 * this.difficulty + 60;
            }
            let hook = new CosmicArkAdvanced.Hook(this.game, x, y, "gun", "hook1", this.player);
            // 2000ms was the original testing speed
            //hook.wep.fireRate = 6290 * (Math.E ^ (-0.233 * this.difficulty));
            hook.wep.fireRate = (58 * this.difficulty * this.difficulty) - (1093 * this.difficulty) + 5946;
            hook.wep.fireRateVariance = (Math.random() * 30 + 35) * ((this.difficulty % 3) + 1);
            this.hooks.push(hook);
        }
        /**
         * @description Creates a AI man
         * @param x Start X position, default is random (keyed as -1, if you want -1, use something like -1.000000001)
         * @param y Start Y position, default is 70px from the bottom of the world
         */
        addMan(isRespawn = false, x = (-1), y = (this.game.world.height - 70)) {
            if (!isRespawn) {
                this.alienTotal++;
            }
            // Establish a random position
            if (x == -1) {
                x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                while (Phaser.Math.difference(x, this.player.x) < 150) {
                    x = (Math.random() * 1472) + 64;
                }
            }
            // Create the alien
            let m = this.alienBatch.create(x, y, "man");
            m.data = new CosmicArkAdvanced.AlienProperties(); // Holds additional info about the alien
            m.anchor.setTo(0.5, 1.0);
            m.data.initialY = y; // Save a copy of the initial y position in case it needs to be respawned
            // Calculate the speed and direction this alien will start with
            let spd = Math.floor(Math.random() * 35) + 40; // Creates a random integer between 40 and 80
            m.data.speed = spd;
            m.animations.add("walk", null, 12 * (spd / 60), true);
            m.animations.play("walk");
            spd = (Math.random() - 0.5 >= 0) ? -spd : spd; // Assign it to a random direction
            if (spd < 0) {
                m.scale.setTo(-1, 1);
            }
            ; // If the speed if now negative, flip the sprite visuals to match
            // Enable Physics and set physics attributes
            this.game.physics.enable(m, Phaser.Physics.ARCADE); // Activate physics
            m.body.setSize(Math.abs(m.width), m.height * 2, 0, m.height * -1); // Extend the collision box upwards so it can hit the ship
            // (m.body as Phaser.Physics.Arcade.Body).setSize(w, h, x, y);
            m.body.velocity.set(spd, 0); // Set the initial velocity to be it's speed with the random direction
        }
        /**
         * @description If you are out of time the game will end.
         */
        OutOfTime() {
            let capt = this.player.aliensCaptured;
            this.game.state.start("levelFinishState", true, false, this.difficulty, this.score, this.GetTimeRemaining(), this.numberToCapture, capt); // Jump to the Level Finish State
        }
        /**
         * @description Creates the game world by both creating and initializing all the objects in the game state.
         */
        create() {
            console.log("GamePlayState has started");
            console.log("Level Difficulty is: " + this.difficulty);
            // Use this for debugging to measure FPS
            this.game.time.advancedTiming = true;
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Start the level timer
            this.levelTimer.start();
            // Make the objects
            this.makeBackgrounds();
            this.makeMotherShip();
            let pStartX = this.mothership.position.x + this.mothership.width / 2;
            this.player = new CosmicArkAdvanced.Player(this.game, pStartX, 144, "player");
            // Always start with at least ( 3 + Difficulty ) guns
            this.addGun();
            this.addGun();
            this.addGun();
            for (let i = Math.ceil(this.difficulty); i > 0; i--) {
                this.addGun();
                for (let n = Math.floor(this.difficulty); n > 0; n--) {
                    if (Math.random() <= 0.5) {
                        this.addGun();
                    }
                }
            }
            // Always start with at least 2+difficulty mines
            this.addMine();
            this.addMine();
            for (let i = Math.floor(this.difficulty); i > 0; i--) {
                this.addMine();
                // 60% chance of 1 additional mine
                // 30% chance of 2 additional mines
                // 10% chance of 3 additional mines
                let r = Math.random();
                if (r < 0.60) {
                    this.addMine();
                }
                else if (r < 0.90) {
                    this.addMine();
                    this.addMine();
                }
                else {
                    this.addMine();
                    this.addMine();
                    this.addMine();
                }
            }
            // Must at least be up to a normal difficulty curve to start seeing Hooks
            if (this.difficulty > 2.0) {
                // Add at least 1 hook for every difficulty level
                // 40% chance of an additional hook every time a single hook is added
                for (let i = Math.floor(this.difficulty); i > 0; i--) {
                    this.addHook();
                    if (Math.random() < 0.40) {
                        this.addHook();
                    }
                }
            }
            // Aliens should always be created after the player so that they don't accidently render behind the tractor beam
            this.alienBatch = this.game.add.spriteBatch(this.game.world); // Create the man sprite batch so they will all be rendered at once
            for (let i = this.numberToCapture; i > 0; i--) {
                this.addMan();
                if (Math.random() < (0.6 - ((this.difficulty - 1) * 0.1))) {
                    this.addMan();
                }
            }
            // Set Camera settings
            this.game.camera.follow(this.player);
            // UI
            this.uiText = this.game.add.bitmapText(8, 0, "EdoSZ", "IN TRANSIT: " + this.player.aliensOnBoard.toString() +
                "\nCAPTURED: " + this.player.aliensCaptured.toString());
            this.uiText.fixedToCamera = true;
            this.uiText_Score = this.game.add.bitmapText(650, 0, "EdoSZ", "Score: ");
            this.uiText_Score.fixedToCamera = true;
            this.uiBtn_Pause = this.game.add.button(this.game.width - 32, 0, "pause", this.pauseGame, this);
            this.uiBtn_Pause.fixedToCamera = true;
            // Add tweens to UI for when hit
            this.tweenSize = this.game.add.tween(this.uiText_Score.scale).to({ x: [1.75, 1], y: [1.75, 1] }, 500, Phaser.Easing.Linear.None, false, 0);
            this.tweenColor = this.game.add.tween(this.uiText_Score).to({ tint: [0xFF1122, 0xFF1122, 0xFF1122, 0xFFFFFF] }, 500, Phaser.Easing.Linear.None, false, 0);
            // this.game.add.text(8, 18, "Captured: " + this.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
        }
        /**
         * @description when paused, there will be options that come up that you can select
         */
        pauseGame() {
            this.game.paused = true;
            this.game.input.onDown.add(this.unpauseGame, this, 0, this.input.position);
            this.pauseBackground = this.game.add.image(0, 0, "blueGrid");
            this.pauseBackground.width = this.pauseBackground.width / 2 - 10;
            this.pauseBackground.height = this.pauseBackground.height / 2 - 45; // the 45 is so it doesn't obscured the top left text. probably be changed later.
            this.pauseBackground.position.x = (this.game.width / 2) + this.camera.position.x - this.pauseBackground.width / 2;
            this.pauseBackground.position.y = (this.game.height / 2) + this.camera.position.y - this.pauseBackground.height / 2;
            this.uiText_Restart = this.game.add.bitmapText(0, 0, "EdoSZ", "RESTART", 48);
            this.uiText_Restart.position.x = (this.game.width / 2) + this.camera.position.x - this.uiText_Restart.textWidth / 2;
            this.uiText_Restart.position.y = (this.game.height / 2) + this.camera.position.y - this.uiText_Restart.textHeight / 2;
        }
        /**
         * @description when you press the pause button again it will un-pause the game.
         *              handles logic for when you click options in the pause menu.
         * @param position of your finger/cursor
         */
        unpauseGame(pos) {
            if (this.uiBtn_Pause.getBounds().contains(pos.x, pos.y)) {
                this.game.paused = false;
                this.uiText_Restart.destroy();
                this.pauseBackground.destroy();
            }
            else if (this.uiText_Restart.getBounds().contains(pos.x, pos.y)) {
                //console.log("Restart has been activated"); // testing
                this.game.paused = false;
                this.game.state.start("levelStartState", true, false, this.difficulty, this.score);
            }
        }
        /**
         * @description Creates the mothership sprite and adjust it's properties accordingly.
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
            // let bd = new Phaser.Image(this.game, 0, this.game.world.height, "city1");
            this.game.add.image(0, 0, "city1");
        }
        /**
         * @description Check for collisions between objects, update the UI and coordinate AI movements
         */
        update() {
            this.collideObjects(); // Check for collisions
            this.moveMen(); // Move the men along the bottom of the screen
            for (let n = 0; n < this.alienBatch.hash.length; n++) {
                this.alienBatch.hash[n].update();
            }
            this.uiText.text = "In Transit: " + this.player.aliensOnBoard.toString() +
                "\nCaptured: " + this.player.aliensCaptured.toString() + " / " + this.numberToCapture.toString();
            this.uiText_Score.text = this.GetTimeRemaining().toFixed(2);
            if (this.player.aliensCaptured >= this.numberToCapture) {
                let capt = this.player.aliensCaptured;
                console.log("Time Remaining: " + this.GetTimeRemaining());
                this.game.state.start("levelFinishState", true, false, this.difficulty, this.score, this.GetTimeRemaining(), this.numberToCapture, capt); // Jump to the Level Finished State
            }
        }
        /**
         * @description returns how much time is remaining
        */
        GetTimeRemaining() {
            return (this.levelTimer.duration / 1000);
        }
        /**
         * @description Adds more time "levelTimer" object. Can be given a negative number to subtract time.
         * @param n The number of MILLISECONDS to change the timer by
         */
        addTime(n) {
            let d = this.levelTimer.duration + n;
            this.levelTimer.stop(true);
            this.levelTimer.loop(d, this.OutOfTime, this);
            this.levelTimer.start();
        }
        /**
         * @description Called ever frame through the update method. Place collision checks here.
         */
        collideObjects() {
            // Collide the player's ship with the gun's bullets
            for (let n = 0; n < this.guns.length; n++) {
                for (let i = 0; i < this.guns[n].bullets.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.guns[n].bullets.bullets.getAt(i))) {
                        // Destroy all bullets within the kill radius (Ess. provide a localized i-frame to the player for fairness)
                        let kill_radius = 150;
                        this.guns.forEach(function (g, gi, ga) {
                            for (let bi = 0; bi < g.bullets.bullets.length; bi++) {
                                let bull = g.bullets.bullets.getAt(bi);
                                if (bull.alive) {
                                    if (Phaser.Math.distance(bull.x, bull.y, this.player.x, this.player.y) < kill_radius) {
                                        bull.kill();
                                    }
                                }
                            }
                        }, this);
                        // Play SFX
                        this.game.sound.play("explosion", this.game.music.volume * 0.50);
                        // Reduce Time
                        this.addTime(-5000);
                        // Reduce Transit Count
                        if (this.player.aliensOnBoard > 0) {
                            this.player.aliensOnBoard--;
                            // Replace that person
                            this.addMan(true);
                        }
                        // Change UI
                        this.tweenSize.start();
                        this.tweenColor.start();
                    }
                }
            }
            // Collide the player's ship with the hooks
            for (let n = 0; n < this.hooks.length; n++) {
                for (let i = 0; i <= this.hooks[n].wep.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.hooks[n].wep.bullets.getAt(i))) {
                        let b = this.hooks[n].wep.bullets.getAt(i);
                        this.hooks[n].targetHooked();
                    }
                }
            }
            // Collide the player's ship with the aliens
            let atLeastOne = false; // Flag meaning "At least one alien is availble to be abducted"
            this.alienBatch.forEachAlive(function (alien) {
                if (this.game.physics.arcade.overlap(this.player, alien)) {
                    atLeastOne = true;
                    this.player.Abduct(alien);
                }
            }, this);
            if (!atLeastOne) {
                this.player.animations.frame = 0; // TODO: Fix this so it doesn't laugh in the face of every OOP practice I've learned over the years
            }
            // Collide the player's ship with the mines
            for (let n = 0; n < this.mines.length; n++) {
                if (this.game.physics.arcade.overlap(this.player, this.mines[n])) {
                    // Make Explosion
                    let spt = this.game.add.sprite(0, 0, "bang");
                    spt.scale.set(1.35, 1.35);
                    spt.position.setTo(this.mines[n].x - spt.width / 2, this.mines[n].y - spt.height / 2);
                    spt.animations.add("bang_anim", null, 20, false);
                    spt.animations.play("bang_anim", null, false, true);
                    // Play SFX
                    this.game.sound.play("explosion", this.game.music.volume * 0.50);
                    // Reduce Time
                    this.addTime(-10000);
                    // Reduce Transit Count
                    for (var k = 0; k < 3; k++) {
                        if (this.player.aliensOnBoard > 0) {
                            this.player.aliensOnBoard--;
                            // Replace that person
                            this.addMan(true);
                        }
                    }
                    // Change UI
                    this.tweenSize.start();
                    this.tweenColor.start();
                    // Destroy mine
                    this.mines[n].destroy(true);
                }
            }
            // Collide the player's ship with the mothership
            if (this.game.physics.arcade.overlap(this.player, this.mothership)) {
                if (this.player.aliensOnBoard > 0) {
                    this.player.aliensCaptured += this.player.aliensOnBoard;
                    // Only play the SFX if this isn't the end of the level
                    if (this.player.aliensCaptured < this.numberToCapture) {
                        this.sfxRepeater("transport", this.player.aliensOnBoard, this.game.music.volume * 0.40);
                    }
                    this.player.aliensOnBoard = 0;
                }
            }
        }
        /**
         * @description lets you stack sound effects so that one will play right after the other,
         *              but they won't all play at the same time.
         */
        sfxRepeater(key, numberOfPlays, volume = 0.7) {
            let sfx = this.game.sound.play(key, volume, false);
            // Create Timer
            let sfxRepeatTimer = this.game.time.create(true);
            sfxRepeatTimer.repeat(sfx.durationMS, numberOfPlays - 1, function () {
                sfx.play();
            }, this);
            sfxRepeatTimer.start();
        }
        /**
         * @description Helper function which cycles through the sprite batch of men along the bottom the screen and applies logic into how they should move.
         */
        moveMen() {
            this.alienBatch.forEach(function (alien) {
                if (alien.x > this.game.world.width - Math.abs(alien.width)) {
                    alien.body.velocity.setTo(-alien.data.speed, 0);
                    alien.scale.set(-1, 1);
                }
                else if (alien.x < Math.abs(alien.width)) {
                    alien.body.velocity.setTo(alien.data.speed, 0);
                    alien.scale.set(1, 1);
                }
            }, this);
        }
        /**
         * @description This is the super in-depth version of collision checking I (Jake) created. Checks for collisions between two objects and triggers the appropriate events on the object.
         * @param obj1  The first object to check collision against
         * @param obj2  The second object to check collision against
         */
        superCollider(obj1, obj2) {
            if (this.game.physics.arcade.collide(obj1, obj2, this.OnCollisionCaller, this.OnCollisionProposalCaller)) {
                // if there is a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == false) {
                        this.OnCollisionEnterCaller(obj1, obj2); // then tell the objects a collision has started
                    }
                    this.dict[obj1.name, obj2.name] = true; // and mark this collision as new
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false; // If there was an exception, 
                    // it is because that dictionary entry doesn't exist yet. 
                    // So add it here.
                }
            }
            else {
                try {
                    if (this.dict[obj1.name, obj2.name] == true) {
                        this.OnCollisionExitCaller(obj1, obj2); // then tell the objects the collision is over
                    }
                    this.dict[obj1.name, obj2.name] = false; // and mark this collision as old
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false; // If there was an exception, 
                    // it is because that dictionary entry doesn't exist yet. 
                    // So add it here.
                }
            }
        }
        /**
         * @Descirption Calls the OnCollisionProposal events on both objects, and return their answer. Both objects must accept the proposal before continueing.
         * @param obj1
         * @param obj2
         */
        OnCollisionProposalCaller(obj1, obj2) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        }
        /**
         * @Descirption Calls the OnCollisionEnter events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionEnterCaller(obj1, obj2) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        }
        /**
         * @description Calls the OnCollision events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionCaller(obj1, obj2) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        }
        /**
         * @description Calls the OnCollisionExit events on both objects
         * @param obj1
         * @param obj2
         */
        OnCollisionExitCaller(obj1, obj2) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        }
        /**
         * @description Post rendering effects.
         */
        render() {
            // Debug features...
            //this.game.debug.body(this.player);
            // this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
            // this.gun1.bullets.debug();
            // this.game.debug.body(this.mine1);
            // this.game.debug.ropeSegments(this.hook1.rope);
            // this.game.debug.body(this.mothership);
            this.game.debug.text(this.game.time.fps.toString(), 8, 80);
            //this.game.debug.body(this.myBatch.getFirstExists(true));
        }
        /**
         * @description un-initializes game objects
         */
        shutdown() {
            this.player.destroy(true);
            this.aliens = null;
            this.alienBatch.destroy(true);
            this.guns = null;
            this.mines = null;
            this.hooks = null;
            this.mothership.destroy();
            this.uiText.destroy();
            this.uiText_Score.destroy();
            this.levelTimer.destroy();
            this.game.sound.stopAll();
        }
    }
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map