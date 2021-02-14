var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    render: {
        pixelArt: true,
    },
};

var game = new Phaser.Game(config),
    grid,
    scene,
    updating = false,
    liveupdate = true,
    start = { x: 0, y: 0 },
    tileSize = 64,
    tintColor = 0x696a6a,
    starterLight,
    scaleSize = (tileSize - 2) / 16,
    win = false;

function preload() {
    scene = this;
    width = this.game.canvas.width;
    height = this.game.canvas.height;
    var progressBar = this.add.graphics(),
        progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect(width / 2 - 150, height / 2 - 25, 300, 50, 5);

    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRoundedRect(width / 2 - 140, height / 2 - 15, 280 * value, 30, 5);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
    });

    this.load.image('empty-tile', './assets/imgs/BaseBack.png');
    // load light colors
    this.load.image('white-light', './assets/imgs/Light/WhiteLight.png');
    this.load.image('red-light', './assets/imgs/Light/RedLight.png');
    this.load.image('green-light', './assets/imgs/Light/GreenLight.png');
    this.load.image('blue-light', './assets/imgs/Light/BlueLight.png');
    //load tiles
    this.load.image('reflector-tile', './assets/imgs/reflector.png');
    this.load.image('extractor-tile', './assets/imgs/extractor.png');
    this.load.image('stone-tile', './assets/imgs/stone.png');
    //inventory bg
    this.load.image('inventory-bg', './assets/imgs/Inventory.png');
    //Filters
    this.load.image('blue-filter', './assets/imgs/Filter/BlueFilter.png');
    this.load.image('green-filter', './assets/imgs/Filter/GreenFilter.png');
    this.load.image('red-filter', './assets/imgs/Filter/RedFilter.png');
    this.load.image('white-filter', './assets/imgs/Filter/WhiteFilter.png');
    // ouputs
    //   blue
    this.load.image('blue-out-clear', './assets/imgs/output/blue/OutputBlueCleared.png');
    this.load.image('blue-out-no', './assets/imgs/output/blue/OutputBlueNoInput.png');
    this.load.image('blue-out-wrong', './assets/imgs/output/blue/OutputBlueWrong.png');
    //   green
    this.load.image('green-out-clear', './assets/imgs/output/green/OutputGreenCleared.png');
    this.load.image('green-out-no', './assets/imgs/output/green/OutputGreenNoInput.png');
    this.load.image('green-out-wrong', './assets/imgs/output/green/OutputGreenWrong.png');
    //   red
    this.load.image('red-out-clear', './assets/imgs/output/red/OutputRedCleared.png');
    this.load.image('red-out-no', './assets/imgs/output/red/OutputRedNoInput.png');
    this.load.image('red-out-wrong', './assets/imgs/output/red/OutputRedWrong.png');
    //   white
    this.load.image('white-out-clear', './assets/imgs/output/white/OutputWhiteCleared.png');
    this.load.image('white-out-no', './assets/imgs/output/white/OutputWhiteNoInput.png');
    this.load.image('white-out-wrong', './assets/imgs/output/white/OutputWhiteWrong.png');
    // menu
    this.load.image('back_button', './assets/imgs/back.png');
    this.load.image('play_button', './assets/imgs/play.png');
    this.load.image('0', './assets/imgs/Numbers/zero.png');
    this.load.image('1', './assets/imgs/Numbers/one.png');
    this.load.image('2', './assets/imgs/Numbers/two.png');
    this.load.image('3', './assets/imgs/Numbers/three.png');
    this.load.image('4', './assets/imgs/Numbers/four.png');
    this.load.image('5', './assets/imgs/Numbers/five.png');
    // Flashlight
    this.load.image('red-flashlight', './assets/imgs/Flashlight/FlashlightRed.png');
    this.load.image('blue-flashlight', './assets/imgs/Flashlight/FlashlightBlue.png');
    this.load.image('green-flashlight', './assets/imgs/Flashlight/FlashlightGreen.png');
    this.load.image('white-flashlight', './assets/imgs/Flashlight/FlashlightWhite.png');

    this.load.scripts('all', [
        makeURL('tiles', 'emptyTile'),
        makeURL('', 'grid'),
        makeURL('', 'light'),
        makeURL('tiles', 'reflectorTile'),
        makeURL('tiles', 'stoneTile'),
        makeURL('tiles', 'colorExtractor'),
        makeURL('tiles', 'colorFilterTile'),
        makeURL('tiles', 'outputTile'),
        makeURL('', 'inventory'),
        makeURL('', 'ghostLight'),
        makeURL('tiles', 'flashlightTile'),
    ]);

    // music and sound effects
    // this.load.audio("main-menu_music", "assets/main-menu_music.mp3");
    this.load.audio('incorrect', 'assets/sounds/Incorrect_3.mp3');
    this.load.audio('correct', 'assets/sounds/Correct_1.mp3');
}

function create() {
    menu();
    scene.input.on('dragstart', (pointer, gameObject) => {
        updating = false;
        reset();
        var gridCoords = grid.getGridCoords({ x: gameObject.x, y: gameObject.y });
        var tileClass = gameObject.getData('class');
        if (gridCoords != null) {
            var empty = new EmptyTile(tileClass.pos.x, tileClass.pos.y, grid, tileSize);
            grid.setTile(empty);
            empty.sprite.depth--;
        }
    });
    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    scene.input.on('dragend', (pointer, gameObject) => {
        var pixelCoord = { x: gameObject.x, y: gameObject.y };
        var newcoords = grid.getPixelCoords(grid.getGridCoords(pixelCoord));
        if (newcoords != null) {
            gameObject.x = newcoords.x;
            gameObject.y = newcoords.y;
        }
        var gridCoords = grid.getGridCoords({ x: gameObject.x, y: gameObject.y });
        var tileClass = gameObject.getData('class');
        if (gridCoords == null) {
            tileClass.grid = null;
            tileClass.pos.x = null;
            tileClass.pos.y = null;
        } else {
            tileClass.pos.x = gridCoords.x;
            tileClass.pos.y = gridCoords.y;
            tileClass.grid = grid;
            grid.setTile(tileClass);
        }
        reset();
        if (liveupdate) {
            updating = true;
        }
    });
}

function update() {
    if (updating) {
        var toUpdate = [];
        var outputTiles = [];
        grid.tiles.forEach((layer) => {
            layer.forEach((tile) => {
                if (tile instanceof Light) {
                    toUpdate.push(tile);
                }
                if (tile instanceof OutputTile) {
                    outputTiles.push(tile);
                }
            });
        });
        toUpdate.forEach((light) => {
            light.update();
        });
        for (var i = 0; i < outputTiles.length; i++) {
            win = outputTiles[i];
        }
        if (win) {
            writeText('You Win!\nGo back to the main menu and move on to the next level!', window.innerWidth / 2, window.innerHeight / 2, 24);
        }
    }
}

function reset() {
    newList = [];
    flashlights = [];
    scene.children.getChildren().forEach((sprite) => {
        if (sprite.getData('type') != 'light') {
            newList.push(sprite);
        }
    });
    grid.tiles.forEach((layer) => {
        layer.forEach((tile) => {
            if (tile instanceof Light) {
                grid.setTile(new EmptyTile(tile.pos.x, tile.pos.y, grid, tileSize));
            }
            if (tile instanceof OutputTile) tile.reset();
            if (tile instanceof FlashlightTile) flashlights.push(tile);
        });
    });
    grid.setTile(starterLight);
    newList.push(starterLight.sprite);
    scene.children.list = newList;
    flashlights.forEach((fl) => {
        fl.generateLight();
    });
}

function makeURL(folder, file) {
    if (folder === '') {
        var name = file;
    } else {
        var name = folder + '/' + file;
    }
    return './src/' + name + '.js';
}

function keyBinds(e) {
    if (e.key == ' ') {
        if (!updating) {
            liveupdate = true;
            updating = true;
        } else {
            liveupdate = false;
            updating = false;
            reset();
        }
    }
}
var txt;
function level0(){
    makeLevel(0);
    var instructions_index = 0;
    Instructions = [
      "Press Space to start and retract light",
      "Drag a mirror from your right to interact with light (try row: 2, col: 5)",
      "The Color splitter takes in white light and outputs the rest (try row: 4, col: 5)",
      "The filter only lets a certain color pass (try row: 4, col:3 see how it blocks light)",
      "The output requires a certain color from a certain direction if you followed instrusction you should have won"
    ]
    txt = scene.add.text(400, 10, "Next Instruction", { font: '16px Courier', fill: '#00ff00' });
    txt.setInteractive();
    // this.add.text(350, 250, '', { font: '16px Courier', fill: '#00ff00' });
    txt.on('pointerover', () => {
        levels[0].setTint(tintColor);
    });
    txt.on('pointerout', () => {
        levels[0].clearTint();
    });
    txt.on('pointerup', () => {
        console.log("here");
        writeText(Instructions[instructions_index], 400, 40 + instructions_index*100, 16);
        instructions_index ++;
    });

}
function levelSelect() {
    try {
        updating = false;
        liveupdate = false;
        reset();
    } catch (e) {}
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    // draw background
    background = scene.add.image(0, 0, 'inventory-bg').setOrigin(0).setScale(15).setDepth(0); // levelSelect background
    //draw buttons and textboxes
    let backButton = scene.add.image(10, 10, 'back_button').setOrigin(0).setScale(2).setDepth(1);

    levels = [];
    for (let i = 0; i < 6; i++) {
        var imageSize = 36;
        levels.push(scene.add.image(10 + i * imageSize, background.displayHeight / 2, '' + i).setDepth(1));
    }
    levels[0].setInteractive();
    levels[0].on('pointerover', () => {
        levels[0].setTint(tintColor);
    });
    levels[0].on('pointerout', () => {
        levels[0].clearTint();
    });
    levels[0].on('pointerup', () => {
        levels.forEach((level) => {
            level.off('pointerover');
            level.off('pointerout');
            level.off('pointerup');
        });
        backButton.off('pointerover');
        backButton.off('pointerout');
        backButton.off('pointerup');

        level0();
        // level select
    });
    for (let i = 1; i < 6; i++) {
        levels[i].setInteractive();
        levels[i].on('pointerover', () => {
            levels[i].setTint(tintColor);
            // console.log("in");
        });
        levels[i].on('pointerout', () => {
            levels[i].clearTint();
            // console.log("out");
        });
        levels[i].on('pointerup', () => {
            levels.forEach((level) => {
                level.off('pointerover');
                level.off('pointerout');
                level.off('pointerup');
            });
            backButton.off('pointerover');
            backButton.off('pointerout');
            backButton.off('pointerup');
            makeLevel(i);
            // level select
        });
    }
    // interactivity
    backButton.setInteractive();
    backButton.on('pointerover', () => {
        backButton.setTint(tintColor);
    });
    backButton.on('pointerout', () => {
        backButton.clearTint();
    });
    backButton.on('pointerup', () => {
        levels.forEach((level) => {
            level.off('pointerover');
            level.off('pointerout');
            level.off('pointerup');
        });
        backButton.off('pointerover');
        backButton.off('pointerout');
        backButton.off('pointerup');
        menu();
    });
}

function menu() {
    try {
        updating = false;
        liveupdate = false;
        reset();
    } catch (e) {}
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    scene.sound.pauseOnBlur = false;
    // scene.sound.play("main-menu_music", {  --- uncomment when music is available
    //   loop: true,
    // });
    background = scene.add.image(0, 0, 'inventory-bg').setOrigin(0).setScale(15).setDepth(0); //main-menu_background get rid of setscale
    let playButton = scene.add
        .image(background.displayWidth / 2, background.displayHeight / 2, 'play_button')
        .setScale(4)
        .setDepth(1);

    playButton.setInteractive();
    playButton.on('pointerover', () => {
        playButton.setTint(tintColor);
        // console.log('in');
    });
    playButton.on('pointerout', () => {
        playButton.clearTint();
        // console.log('out');
    });
    playButton.on('pointerup', () => {
        // console.log('out');
        playButton.off('pointerover');
        playButton.off('pointerout');
        playButton.off('pointerup');
        levelSelect();
    });
}

function writeText(prompt, x, y, size) {
    let strings = prompt.match(/.{1,30}/g);
    var bottomOfScene = {
        x: x,
        y: y,
    };
    for (let i = 0; i < strings.length; i++) {
        var txt = scene.add.text(bottomOfScene.x, bottomOfScene.y + 30 * i, strings[i], { font: size + 'px Courier', fill: '#00ff00' });
    }
}

function makeLevel(levelNumber) {
    try {
        updating = false;
        liveupdate = false;
        reset();
    } catch (e) {}
    scene.input.pointerOver;
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    $.getJSON('levels/' + levelNumber + '.json', (json) => {
        grid = new Grid(json.dims[1], json.dims[0], 50, 50, tileSize);
        starterLight = new Light(json.startPos.pos[0], json.startPos.pos[1], json.startPos.dir, json.startPos.color, grid);
        grid.setTile(starterLight);
        json.level.forEach((tile) => {
            if (tile.name == 'mirror') {
                temp = new ReflectorTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.orientation || 0);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'stone') {
                temp = new StoneTile(tile.pos[0], tile.pos[1], grid, tileSize);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'prism') {
                temp = new ColorExtractor(tile.pos[0], tile.pos[1], grid, tileSize, tile.orientation || 0);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'filter') {
                temp = new ColorFliterTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.color || 'white', tile.orientation || 0);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'output') {
                grid.setTile(new OutputTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.orientation || 0, tile.lightAccept));
            } else if (tile.name == 'flashlight') {
                temp = new FlashlightTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.color || 'white', tile.orientation || 0);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            }
        });
        let backButton = scene.add.image(10, 10, 'back_button').setOrigin(0).setScale(2).setDepth(1);
        backButton.setInteractive();
        backButton.on('pointerup', () => {
            if(levelNumber == 0){
              txt.off('pointerover');
              txt.off('pointerout');
              txt.off('pointerup');
            }
            backButton.off('pointerover');
            backButton.off('pointerout');
            backButton.off('pointerup');
            levelSelect();
        });
        inv = new Inventory({ x: window.innerWidth - 192 / 2, y: 768 / 2 }, json.inventory);
    });
}
