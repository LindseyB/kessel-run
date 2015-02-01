window.onload = function() {
    var job;
    var name;
    var money = 10000;
    var KRGame = {};
    var solar = 0;
    var food = 0;
    var clothing = 0;
    var parts = 0;
    var spice = 0;
    var crew = [];
    var day = 0;
    var meals = 3;

    KRGame.StateTitle = function (game) {
        this.title;
        this.text;
        this.timer = 0;
    };

    KRGame.StateTitle.prototype = {
        preload: function () {
            this.game.load.image('title', 'assets/title.png');
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
        },

        create: function () {
            this.title = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
            this.title.anchor.setTo(0.5, 0.5);

            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            this.text = this.game.add.bitmapText(game.world.centerX, 500, 'dosfont','Press Spacebar', 32);
            this.text.x = this.game.width / 2 - this.text.textWidth / 2;
        },

        update: function() {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.gotoStateJob();
            }

            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.text.visible = !this.text.visible;
            }
        },

        gotoStateJob: function() {
            this.state.start('StateJob');
        }
    };

    KRGame.StateJob = {};

    KRGame.StateJob = function (game) {
        this.bg;
        this.stars;
        this.timer = 0;
        this.choiceText = ""
        this.choice = -1;
        this.backspace;
        this.enter;
    };

    KRGame.StateJob.prototype = {
        preload: function() {
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('divider', 'assets/divider.png');
        },

        create: function() {
            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.stars = this.game.add.tileSprite(0, 0, 800, 600, 'stars');

            game.add.sprite(0, 10, 'divider');
            game.add.sprite(0, 545, 'divider');

            this.text = this.game.add.bitmapText(100, 100, 'dosfont','You May: \n\n1. Be an investment banker from\n   New Boston\n2. Be a doctor from Osiris\n3. Be a space cowboy from Mos Eisley\n\nWhat is your choice?', 32);
            this.cursor = this.game.add.bitmapText(450, 320, 'dosfont', '_', 32);
            this.choiceText = this.game.add.bitmapText(450, 325, 'dosfont', '', 32);

            game.input.keyboard.addKeyCapture([ Phaser.Keyboard.BACKSPACE, Phaser.Keyboard.ENTER ]);
            this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enter.onDown.add(this.submitChoice, this);
            this.backspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
            this.backspace.onDown.add(this.deleteChoice, this);

            game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
        },

        update: function() {
            this.stars.tilePosition.x += 0.5;
            this.bg.tilePosition.x -= 0.5;

            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.cursor.visible = !this.cursor.visible;
            }
        },

        deleteChoice: function() {
            if (this.choice != -1) {
                this.choice = -1;
                this.cursor.x -= 26;
                this.choiceText.setText("");
            }
        },

        submitChoice: function() {
            if (this.choice != -1) {
                job = this.choice;
                if (job == 1) { money += 5000; }
                this.state.start('StateCaptain');
            }
        },

        keyPress: function(char) {
            if (char === '1') {
                this.choiceText.setText("1");
                if (this.choice == -1 ) { this.cursor.x += 26; }
                this.choice = 1;
            } else if (char === '2') {
                this.choiceText.setText("2");
                if (this.choice == -1 ) { this.cursor.x += 26; }
                this.choice = 2;
            } else if (char === '3') {
                this.choiceText.setText("3");
                if (this.choice == -1 ) { this.cursor.x += 26; }
                this.choice = 3;
            }
        }
    };

    KRGame.StateCaptain = {};

    KRGame.StateCaptain = function (game) {
        this.bg;
        this.stars;
        this.party;
        this.text;
        this.cursor;
        this.choiceText;
        this.timer = 0;
        this.name = '';
    };

    KRGame.StateCaptain.prototype = {
        preload: function() {
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('party', 'assets/party.png');
        },

        create: function() {
            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.stars = this.game.add.tileSprite(0, 0, 800, 600, 'stars');
            this.party = this.game.add.sprite(0,0, 'party');

            this.text = this.game.add.bitmapText(100, 305, 'dosfont','What is the name of you captain?', 32);
            this.cursor = this.game.add.bitmapText(100, 337, 'dosfont', '_', 32);
            this.choiceText = this.game.add.bitmapText(100, 337, 'dosfont', '', 32);

            game.input.keyboard.addKeyCapture([ Phaser.Keyboard.BACKSPACE, Phaser.Keyboard.ENTER, Phaser.Keyboard.SPACEBAR ]);
            this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enter.onDown.add(this.submitChoice, this);
            this.backspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
            this.backspace.onDown.add(this.deleteChoice, this);
            this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.spacebar.onDown.add(this.addSpace, this);

            game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
        },

        update: function() {
            this.stars.tilePosition.x += 0.5;
            this.bg.tilePosition.x -= 0.5;

            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.cursor.visible = !this.cursor.visible;
            }
        },

        keyPress: function(char) {
            this.name += char;
            this.choiceText.setText(this.name);

            this.cursor.x = 126 + this.choiceText.width;
        },

        deleteChoice: function() {
            this.name = this.name.substring(0, this.name.length - 1);
            this.choiceText.setText(this.name);
            this.cursor.x = 100 + this.choiceText.width;
            if (this.name.length > 0) { this.cursor.x += 26; }
        },

        submitChoice: function() {
            name = "Cpt. " + this.name;
            crew.push({name: name, status: "healthy", hp: 20});
            this.state.start('StateParty');
        },

        addSpace: function() {
            this.name += ' ';
            this.choiceText.setText(this.name);
            this.cursor.x = 126 + this.choiceText.width;
        }
    };

    KRGame.StateParty = {};

    KRGame.StateParty = function (game) {
        this.bg;
        this.stars;
        this.party;
        this.text;
        this.cursor;
        this.choiceText = [];
        this.timer = 0;
        this.members = ["","","","",""];
        this.current_member = 1;
    };

    KRGame.StateParty.prototype = {
        preload: function() {
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('party', 'assets/party.png');
        },

        create: function() {
            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.stars = this.game.add.tileSprite(0, 0, 800, 600, 'stars');
            this.party = this.game.add.sprite(0,0, 'party');

            this.text = this.game.add.bitmapText(100, 305, 'dosfont','What are the names of the rest of your\ncrew?', 32);
            this.cursor = this.game.add.bitmapText(132, 401, 'dosfont', '_', 32);
            this.members[0] = name;
            for (var i = 0; i < 5; i++) {
                this.choiceText.push(this.game.add.bitmapText(100, 369+(i*32), 'dosfont', (i+1)+'. '+this.members[i]));
            }

            game.input.keyboard.addKeyCapture([ Phaser.Keyboard.BACKSPACE, Phaser.Keyboard.ENTER, Phaser.Keyboard.SPACEBAR ]);
            this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enter.onDown.add(this.submitChoice, this);
            this.backspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
            this.backspace.onDown.add(this.deleteChoice, this);
            this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.spacebar.onDown.add(this.addSpace, this);

            game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
        },

        update: function() {
            this.stars.tilePosition.x += 0.5;
            this.bg.tilePosition.x -= 0.5;

            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.cursor.visible = !this.cursor.visible;
            }
        },

        keyPress: function(char) {
            this.members[this.current_member] += char;
            this.choiceText[this.current_member].setText((this.current_member+1)+". " + this.members[this.current_member]);

            this.cursor.x = 126 + this.choiceText[this.current_member].width;
        },

        deleteChoice: function() {
            this.members[this.current_member] = this.members[this.current_member].substring(0, this.members[this.current_member].length - 1);
            this.choiceText[this.current_member].setText((this.current_member+1)+". " + this.members[this.current_member]);
            this.cursor.x = 126 + this.choiceText[this.current_member].width;
            if (this.members[this.current_member].length > 0) { this.cursor.x += 26; }
        },

        submitChoice: function() {
            crew.push({name: this.members[this.current_member], status: "healthy", hp: 20})
            if (this.current_member < 4) {
                this.current_member++;
                this.cursor.y += 32;
                this.cursor.x = 132;
            } else {
                this.state.start('StateShop');
            }
        },

        addSpace: function() {
            this.members[this.current_member] += ' ';
            this.choiceText[this.current_member].setText((this.current_member+1)+". " + this.members[this.current_member]);
            this.cursor.x = 126 + this.choiceText[this.current_member].width;
        }
    };

    KRGame.StateShop = {};

    KRGame.StateShop = function (game) {
        this.solar_amount = 0;
        this.food_amount = 0;
        this.clothing_amount = 0;
        this.parts_amount = 0;
        this.spice_amount = 0;

        this.solar_text;
        this.food_text;
        this.clothing_text;
        this.parts_text;
        this.spice_text;

        this.total = 0;
        this.total_text;

        this.enter_text;
        this.timer = 0;
    };

    KRGame.StateShop.prototype = {
        preload: function() {
            this.game.load.image('merchant', 'assets/merchant.png');
            this.game.load.image('arrow', 'assets/arrow.png');
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
        },

        create: function() {
            this.merchant = this.game.add.sprite(100, 300, 'merchant');
            this.merchant.anchor.setTo(0.5, 0.5);
            this.merchant.scale.x = 0.5;
            this.merchant.scale.y = 0.5;

            this.game.add.bitmapText(200, 20, 'dosfont','Wimateeka\'s Shoppe', 40);
            this.game.add.bitmapText(200, 70, 'dosfont', '1. Solar Panels @ $500', 32);
            this.game.add.bitmapText(200, 132, 'dosfont','2. Food         @ $10', 32);
            this.game.add.bitmapText(200, 194, 'dosfont','3. Clothing     @ $40', 32);
            this.game.add.bitmapText(200, 256, 'dosfont','4. Spare Parts  @ $100', 32);
            this.game.add.bitmapText(200, 318, 'dosfont','5. Spice        @ $100', 32);

            this.solar_text = this.game.add.bitmapText(600, 70, 'dosfont', '0', 32);
            this.solar_up = this.game.add.sprite(590, 55, 'arrow');
            this.solar_up.inputEnabled = true;
            this.solar_up.events.onInputOver.add(this.fade, this);
            this.solar_up.events.onInputDown.add(this.solarUp, this);
            this.solar_up.events.onInputOut.add(this.fade, this);
            this.solar_down = this.game.add.sprite(608, 100, 'arrow');
            this.solar_down.anchor.setTo(0.5, 0.5);
            this.solar_down.angle = 180;
            this.solar_down.inputEnabled = true;
            this.solar_down.events.onInputOver.add(this.fade, this);
            this.solar_down.events.onInputDown.add(this.solarDown, this);
            this.solar_down.events.onInputOut.add(this.fade, this);

            this.food_text = this.game.add.bitmapText(600, 132, 'dosfont', '0', 32);
            this.food_up = this.game.add.sprite(590, 117, 'arrow');
            this.food_up.inputEnabled = true;
            this.food_up.events.onInputOver.add(this.fade, this);
            this.food_up.events.onInputDown.add(this.foodUp, this);
            this.food_up.events.onInputOut.add(this.fade, this);
            this.food_down = this.game.add.sprite(608, 162, 'arrow');
            this.food_down.anchor.setTo(0.5, 0.5);
            this.food_down.angle = 180;
            this.food_down.inputEnabled = true;
            this.food_down.events.onInputOver.add(this.fade, this);
            this.food_down.events.onInputDown.add(this.foodDown, this);
            this.food_down.events.onInputOut.add(this.fade, this);

            this.clothing_text = this.game.add.bitmapText(600, 194, 'dosfont', '0', 32);
            this.clothing_up = this.game.add.sprite(590, 179, 'arrow');
            this.clothing_up.inputEnabled = true;
            this.clothing_up.events.onInputOver.add(this.fade, this);
            this.clothing_up.events.onInputDown.add(this.clothingUp, this);
            this.clothing_up.events.onInputOut.add(this.fade, this);
            this.clothing_down = this.game.add.sprite(608, 225, 'arrow');
            this.clothing_down.anchor.setTo(0.5, 0.5);
            this.clothing_down.angle = 180;
            this.clothing_down.inputEnabled = true;
            this.clothing_down.events.onInputOver.add(this.fade, this);
            this.clothing_down.events.onInputDown.add(this.clothingDown, this);
            this.clothing_down.events.onInputOut.add(this.fade, this);

            this.parts_text = this.game.add.bitmapText(600, 256, 'dosfont', '0', 32);
            this.parts_up = this.game.add.sprite(590, 241, 'arrow');
            this.parts_up.inputEnabled = true;
            this.parts_up.events.onInputOver.add(this.fade, this);
            this.parts_up.events.onInputDown.add(this.partsUp, this);
            this.parts_up.events.onInputOut.add(this.fade, this);
            this.parts_down = this.game.add.sprite(608, 288, 'arrow');
            this.parts_down.anchor.setTo(0.5, 0.5);
            this.parts_down.angle = 180;
            this.parts_down.inputEnabled = true;
            this.parts_down.events.onInputOver.add(this.fade, this);
            this.parts_down.events.onInputDown.add(this.partsDown, this);
            this.parts_down.events.onInputOut.add(this.fade, this);

            this.spice_text = this.game.add.bitmapText(600, 318, 'dosfont', '0', 32);
            this.spice_up = this.game.add.sprite(590, 303, 'arrow');
            this.spice_up.inputEnabled = true;
            this.spice_up.events.onInputOver.add(this.fade, this);
            this.spice_up.events.onInputDown.add(this.spiceUp, this);
            this.spice_up.events.onInputOut.add(this.fade, this);
            this.spice_down = this.game.add.sprite(608, 349, 'arrow');
            this.spice_down.anchor.setTo(0.5, 0.5);
            this.spice_down.angle = 180;
            this.spice_down.inputEnabled = true;
            this.spice_down.events.onInputOver.add(this.fade, this);
            this.spice_down.events.onInputDown.add(this.spiceDown, this);
            this.spice_down.events.onInputOut.add(this.fade, this);

            this.money = this.game.add.bitmapText(200, 450, 'dosfont','Your Funds: $'+money.toFixed(2), 32);
            this.total_text = this.game.add.bitmapText(200, 500, 'dosfont','     Total: $0.00', 32);

            this.enter_text = this.game.add.bitmapText(game.world.centerX, 550, 'dosfont','Press Enter to Continue', 32);
            this.enter_text.x = this.game.width / 2 - this.enter_text.textWidth / 2;

            this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enter.onDown.add(this.submitPurchase, this);
        },

        update: function() {
            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.enter_text.visible = !this.enter_text.visible;
            }
        },

        solarUp: function(sprite, pointer) {
            if ((this.total + 500) <= money){
                this.solar_amount++;
                this.solar_text.setText(this.solar_amount);
                this.total += 500;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        solarDown: function(sprite, pointer) {
            if(this.solar_amount > 0 ) {
                this.solar_amount--;
                this.solar_text.setText(this.solar_amount)
                this.total -= 500;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        foodUp: function(sprite, pointer) {
            if ((this.total + 10) <= money) {
                this.food_amount++;
                this.food_text.setText(this.food_amount);
                this.total += 10;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        foodDown: function(sprite, pointer) {
            if(this.food_amount > 0 ) {
                this.food_amount--;
                this.food_text.setText(this.food_amount)
                this.total -= 10;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        clothingUp: function(sprite, pointer) {
            if ((this.total + 40) <= money) {
                this.clothing_amount++;
                this.clothing_text.setText(this.clothing_amount);
                this.total += 40;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        clothingDown: function(sprite, pointer) {
            if(this.clothing_amount > 0 ) {
                this.clothing_amount--;
                this.clothing_text.setText(this.clothing_amount)
                this.total -= 40;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        partsUp: function(sprite, pointer) {
            if ((this.total + 100) <= money) {
                this.parts_amount++;
                this.parts_text.setText(this.parts_amount);
                this.total += 100;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        partsDown: function(sprite, pointer) {
            if(this.parts_amount > 0 ) {
                this.parts_amount--;
                this.parts_text.setText(this.parts_amount)
                this.total -= 100;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },


        spiceUp: function(sprite, pointer) {
            if((this.total + 100) <= money) {
                this.spice_amount++;
                this.spice_text.setText(this.spice_amount);
                this.total += 100;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        spiceDown: function(sprite, pointer) {
            if(this.spice_amount > 0 ) {
                this.spice_amount--;
                this.spice_text.setText(this.spice_amount)
                this.total -= 100;
                this.total_text.setText("     Total: $" + this.total.toFixed(2));
            }
        },

        fade: function(sprite, pointer) {
            if(sprite.alpha != 0.8) {
                sprite.alpha = 0.8;
            } else {
                sprite.alpha = 1;
            }
        },

        submitPurchase: function() {
            money -= this.total;
            solar = this.solar_amount;
            food = this.food_amount;
            clothing = this.clothing_amount;
            parts = this.parts_amount;
            spice = this.spice_amount;
            this.state.start('StateStartStation');
        }
    };

    KRGame.StateStartStation = {};

    KRGame.StateStartStation = function (game) {
        this.station;
        this.music;
        this.enter_text;
        this.timer = 0;
    };

    KRGame.StateStartStation.prototype = {
        preload: function() {
            this.game.load.image('station', 'assets/station.png');
            this.game.load.audio('music', 'assets/audio/SpaceGone-8bit-Chiptune-Song-36.mp3');
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
        },

        create: function() {
            this.station = this.game.add.sprite(0,0, 'station');
            this.music = this.game.add.audio('music');
            this.music.loop = true;
            this.music.play();
            this.enter_text = this.game.add.bitmapText(game.world.centerX, game.world.centerY, 'dosfont','Press Enter to Take Off', 64);
            this.enter_text.x = this.game.width / 2 - this.enter_text.textWidth / 2;

            this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enter.onDown.add(this.takeOff, this);
        },

        update: function() {
            this.timer += this.game.time.elapsed;
            if (this.timer >= 500) {
                this.timer = 0;
                this.enter_text.visible = !this.enter_text.visible;
            }
        },

        takeOff: function() {
            this.music.stop();
            this.state.start('StateTravel');
        }
    };

    KRGame.StateTravel = {};

    KRGame.StateTravel = function (game) {
        this.progressLine;
        this.shipProgress;
        this.ship;
        this.solar_status;
        this.food_status;
        this.clothing_status;
        this.parts_status;
        this.spice_status;
        this.crew_statuses;
        this.rest;
        this.distanceTraveled = 0;
        this.timer = 0;
        this.dayTimer = 0;
        this.restTimer = 0;
        this.day_status;
        this.resting = false;
        this.meal_buttons;
    };

    KRGame.StateTravel.prototype = {
        preload: function() {
            this.game.load.image('ship', 'assets/ship.png');
            this.game.load.bitmapFont('dosfont', 'assets/font/dos.png', 'assets/font/dos.fnt');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('divider', 'assets/divider.png');
            this.game.load.image('rest', 'assets/rest.png');
            this.game.load.image('food', 'assets/food.png');
            this.game.load.image('1meals', 'assets/1meal.png');
            this.game.load.image('2meals', 'assets/2meals.png');
            this.game.load.image('3meals', 'assets/3meals.png');
        },

        create: function() {
            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.stars = this.game.add.tileSprite(0, 0, 800, 600, 'stars');

            this.progressLine = this.game.add.graphics(0, 0);
            this.progressLine.lineStyle(1, 0xffffff, 0.75);
            this.progressLine.moveTo(50, 50);
            this.progressLine.lineTo(game.width - 50, 50);

            this.shipProgress = this.game.add.sprite(game.width - 50, 50, 'ship');
            this.shipProgress.anchor.setTo(0.5, 0.5);
            this.shipProgress.scale.x = 0.2;
            this.shipProgress.scale.y = 0.2;
            this.shipProgress.angle = 180;

            this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
            this.ship.angle = 180;
            this.ship.anchor.setTo(0.5, 0.5);

            this.solar_status = this.game.add.bitmapText(50, 60, 'dosfont','Solar Panels: ' + solar, 26);
            this.food_status = this.game.add.bitmapText(50, 60+26, 'dosfont','Food: ' + food, 26);
            this.clothing_status = this.game.add.bitmapText(50, 60+(26*2), 'dosfont', 'Clothing: ' + clothing, 26);
            this.parts_status = this.game.add.bitmapText(50, 60+(26*3), 'dosfont', 'Spare Parts: ' + parts, 26);
            this.spice_status = this.game.add.bitmapText(50, 60+(26*4), 'dosfont', 'Spice: ' + spice, 26);
            this.money_status = this.game.add.bitmapText(50, 60+(26*5), 'dosfont', 'Money: $' + money.toFixed(2), 26);

            this.day_status = this.game.add.bitmapText(700, 60, 'dosfont', 'Day: ' + day, 26);

            this.line1 = this.game.add.sprite(50, 60+(26*6), 'divider');
            this.line1.scale.x = 0.3;
            this.line1.scale.y = 0.3;

            this.crew_statuses = game.add.group();
            for(var i=0; i < crew.length; i++) {
                this.status = this.game.add.bitmapText(50, 236+(26*i), 'dosfont', crew[i].name + ": " + crew[i].status, 26);
                this.crew_statuses.add(this.status);
            }

            this.rest = this.game.add.sprite(50, 380, 'rest');
            this.rest.inputEnabled = true;
            this.rest.events.onInputOver.add(this.fade, this);
            this.rest.events.onInputDown.add(this.enableRest, this);
            this.rest.events.onInputOut.add(this.fade, this);

            this.food = this.game.add.sprite(50, 414, 'food');
            this.food.inputEnabled = true;
            this.food.events.onInputOver.add(this.fade, this);
            this.food.events.onInputDown.add(this.gotoAsteroids, this);
            this.food.events.onInputOut.add(this.fade, this);

            this.game.add.bitmapText(700, 98, 'dosfont', 'Rations', 26);

            this.meal_buttons = game.add.group();
            for(var i=0; i<3;  i++) {
                this.meal_button = this.game.add.sprite(700, 126+(i*34), (i+1)+'meals')
                this.meal_buttons.add(this.meal_button);
                this.meal_button.inputEnabled = true;
                this.meal_button.events.onInputOver.add(this.fade, this);
                this.meal_button.events.onInputDown.add(this.mealChanged, {amount: i+1});
                this.meal_button.events.onInputOut.add(this.fade, this);

                if(i==2) { this.meal_button.tint = 0x555555; }
            }
        },

        update: function() {
            this.stars.tilePosition.x += 0.5;
            this.bg.tilePosition.x -= 0.5;

            for(var i=0; i<3; i++){
                if(i == meals-1){
                    this.meal_buttons.getAt(i).tint = 0x555555;
                } else {
                    this.meal_buttons.getAt(i).tint = 0xffffff;
                }
            }


            if(!this.resting){
                this.timer += this.game.time.elapsed;
                if (this.timer >= 500) {
                    this.timer = 0;
                    this.distanceTraveled += .05; //TODO: update for speed
                    if(this.distanceTraveled > 58) { this.distanceTraveled = 58; }
                    this.shipProgress.x = 750 - (this.distanceTraveled/58 * 700);
                }
            }

            if (this.resting) {
                this.restTimer += this.game.time.elapsed;
                if(this.restTimer >= 5000) {
                    this.restTimer = 0;
                    this.resting = false;
                    this.rest.tint = 0xffffff;
                    //TODO: update statuses after resting
                }
            }

            this.dayTimer += this.game.time.elapsed;
            if (this.dayTimer >= 5000) {
                this.dayTimer = 0;
                day++;

                for (var i=0; i < crew.length; i++){
                    if ( food > 0 && crew[i].hp > 0) {
                        // TODO: update for rations
                        food -= meals;
                        if (food < 0) { food = 0; }
                        if (crew[i].status == "starving") { crew[i].status = "healthy";}
                    } else if (food == 0 && crew[i].hp > 0) {
                        crew[i].hp--;
                        crew[i].status = "starving";
                    } else {
                        crew[i].status = "dead";
                    }

                    this.crew_statuses.getAt(i).setText(crew[i].name + ": " + crew[i].status);
                }

                this.day_status.setText('Day:' + day);
                this.food_status.setText('Food: ' + food);
            }
        },

        gotoAsteroids: function() {
            this.state.start('StateAsteroids');
        },

        fade: function(sprite, pointer) {
            if(sprite.alpha != 0.8) {
                sprite.alpha = 0.8;
            } else {
                sprite.alpha = 1;
            }
        },

        enableRest: function() {
            if(!this.resting) {
                this.resting = true;
                this.rest.tint = 0x555555;
            }
        },

        mealChanged: function() {
            meals = this.amount;
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
            this.game.load.image('asteroid', 'assets/asteroid.png');

            this.game.load.audio('bulletSound', 'assets/audio/170161__timgormly__8-bit-laser.mp3');
            this.game.load.audio('explosionSound', 'assets/audio/170144__timgormly__8-bit-explosion2.mp3');
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
            this.explosionSound = game.add.audio('explosionSound');

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
                Phaser.Keyboard.Q,
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.W,
                Phaser.Keyboard.A,
                Phaser.Keyboard.D ]);

            this.escape = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            this.escape.onDown.add(this.gotoTravel, this);
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
            this.explosionSound.play();
            bullet.kill();
            asteroid.kill();
            food += Math.floor(Math.random() * 5) + 1;
        },

        playerHitHander: function(ship, asteroid) {
            asteroid.kill();
            live = this.lives.getFirstAlive();
            if (live) { live.kill(); }
            this.hurt = true;
            this.hurtDuration = this.game.time.now + 800;

            if (this.lives.countLiving() < 1){
                this.state.start('StateTravel');
            }
        },

        gotoTravel: function() {
            this.state.start('StateTravel');
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
    game.state.add('StateJob', KRGame.StateJob);
    game.state.add('StateCaptain', KRGame.StateCaptain);
    game.state.add('StateParty', KRGame.StateParty);
    game.state.add('StateShop', KRGame.StateShop);
    game.state.add('StateStartStation', KRGame.StateStartStation);
    game.state.add('StateTravel', KRGame.StateTravel);
    game.state.add('StateAsteroids', KRGame.StateAsteroids);

    game.state.start('StateTitle');
};