window.onload = function() {

    var KRGame = {};

    KRGame.StateTitle = function (game) {
        this.title;
        this.text;
        this.style;
        this.timer = 0;
    };

    KRGame.StateTitle.prototype = {
        preload: function () {
            this.game.load.image('title', 'assets/title.png');
        },

        create: function () {
            this.title = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
            this.title.anchor.setTo(0.5, 0.5);

            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
            
            this.style = { font: "40px Monospace", fill: "#66ff66", align: "center" };
            this.text = game.add.text(game.world.centerX, 500, "Press Spacebar", this.style);
            this.text.anchor.set(0.5);
        },

        update: function() {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.gotoStateAsteroids();
            }

            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.text.visible = !this.text.visible;
            }
        },

        gotoStateAsteroids: function() {
            this.state.start('StateAsteroids');
        }
    };

    KRGame.StateAsteroids = {};

    KRGame.StateAsteroids = function (game) {
        this.bg;
        this.ship;
        this.stars;
        this.bullet;
        this.bullets;
        this.bulletTime = 0;
        this.bulletSound;
        this.asteroid;
        this.asteroids;
        this.asteroidTime = 0;
        this.lives;
        this.hurt = false;
        this.hurtTime = 0;
        this.hurtDuration = 0;
        this.cursors;
    };

    KRGame.StateAsteroids.prototype = {
        preload: function() {
            this.game.load.image('ship', 'assets/ship.png');
            this.game.load.image('asteroid', 'assets/asteroid.png');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('bullet', 'assets/bullet.png');
            this.game.load.audio('bulletSound', 'assets/audio/Pew_Pew-DKnight556.mp3');
            this.game.load.image('asteroid', 'assets/asteroid.png');
        },

        create: function() {
            this.game.renderer.clearBeforeRender = false;
            this.game.renderer.roundPixels = true;

            this.game.physics.startSystem(Phaser.Physics.ARCADE)

            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.stars = this.game.add.tileSprite(0, 0, 800, 600, 'stars');

            this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
            this.ship.anchor.setTo(0.5, 0.5);

            this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
            this.ship.body.drag.set(100);
            this.ship.body.maxVelocity.set(400);

            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(20, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);

            this.asteroids = this.game.add.group();
            this.asteroids.enableBody = true;
            this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;
            this.asteroids.createMultiple(5, 'asteroid');
            this.asteroids.setAll('anchor.x', 0.5);
            this.asteroids.setAll('anchor.y', 0.5);

            this.bulletSound = game.add.audio('bulletSound');

            this.lives = this.game.add.group();
            for (var i = 0; i < 3; i++) {
                var life = this.lives.create(this.game.world.width - 100 + (30 * i), 60, 'ship');
                life.anchor.setTo(0.5, 0.5);
                life.angle = 90;
                life.scale.x = 0.2;
                life.scale.y = 0.2;
                life.alpha = 0.8
            }

            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture([ 
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.W,
                Phaser.Keyboard.A,
                Phaser.Keyboard.D ]);
        },

        update: function() {
            this.stars.tilePosition.x += 0.5;
            this.bg.tilePosition.x -= 0.5;

            if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
            } else {
                this.ship.body.acceleration.set(0);
            }

            if (this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.ship.body.angularVelocity = -300;
            } else if (this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.ship.body.angularVelocity = 300;
            } else {
                this.ship.body.angularVelocity = 0;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.fireBullet();
            }

            this.screenWrap(this.ship);
            this.animateHurt();

            this.createAsteroid();
            this.asteroids.forEachExists(this.screenWrap, this);

            this.game.physics.arcade.overlap(this.bullets, this.asteroids, this.collisionHandler, null, this);
            this.game.physics.arcade.overlap(this.asteroids, this.ship, this.playerHitHander, null, this);            
        },

        fireBullet: function() {
            if (this.game.time.now > this.bulletTime) {
                this.bullet = this.bullets.getFirstExists(false);

                if (this.bullet) {
                    this.bulletSound.play();
                    this.bullet.reset(this.ship.body.x + 64, this.ship.body.y + 48);
                    this.bullet.lifespan = 2000;
                    this.bullet.rotation = this.ship.rotation;
                    this.game.physics.arcade.velocityFromRotation(this.ship.rotation, 400, this.bullet.body.velocity);
                    this.bulletTime = this.game.time.now + 200;
                }
            }            
        },

        createAsteroid: function() {
            if (this.game.time.now > this.asteroidTime) {
                this.asteroid = this.asteroids.getFirstExists(false);

                if (this.asteroid) {
                    this.asteroid.reset(Math.floor((Math.random() * this.game.width) + 1), Math.floor(Math.random() * 2)*this.game.height);
                    this.asteroid.rotation = Math.floor((Math.random() * 360) + 0);
                    var scale = (Math.random() * (0.7 - 0.3) + 0.3)
                    this.asteroid.scale.x = scale;
                    this.asteroid.scale.y = scale;
                    this.game.physics.arcade.velocityFromRotation(this.asteroid.rotation, 10, this.asteroid.body.velocity);
                    this.asteroidTime = this.game.time.now + 1000;
                }
            }            
        },

        screenWrap: function(sprite) {
            if (sprite.x < 0) {
                sprite.x = this.game.width;
            } else if (sprite.x > this.game.width) {
                sprite.x = 0;
            }

            if (sprite.y < 0) {
                sprite.y = this.game.height;
            } else if (sprite.y > this.game.height) {
                sprite.y = 0;
            }            
        },

        collisionHandler: function(bullet, asteroid) {
            bullet.kill();
            asteroid.kill();            
        },

        playerHitHander: function(ship, asteroid) {
            asteroid.kill();
            live = this.lives.getFirstAlive();
            if (live) { live.kill(); }
            this.hurt = true;
            this.hurtDuration = this.game.time.now + 800;            
        },

        animateHurt: function() {
            if (this.hurt && this.game.time.now > this.hurtTime) {
                if(this.ship.alpha == 1){
                    this.ship.alpha = 0.5;
                } else {
                    this.ship.alpha = 1;
                }
                this.hurtTime = this.game.time.now + 150;
            }

            if (this.hurt && this.game.time.now > this.hurtDuration) {
                this.hurt = false;
                this.ship.alpha = 1;
            }            
        }
    };

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'kessel-run-container');

    game.state.add('StateTitle', KRGame.StateTitle);
    game.state.add('StateAsteroids', KRGame.StateAsteroids);

    game.state.start('StateTitle');
};