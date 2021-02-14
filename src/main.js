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
    scaleSize = (tileSize - 2) / 16;

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
    ]);

    // music and sound effects
    // this.load.audio("main-menu_music", "assets/main-menu_music.mp3");
    this.load.audio('incorrect', 'assets/sounds/Incorrect_3.mp3');
    this.load.audio('correct', 'assets/sounds/Correct_1.mp3')

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
        gameObject.x = newcoords.x;
        gameObject.y = newcoords.y;
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
        grid.tiles.forEach((layer) => {
            layer.forEach((tile) => {
                if (tile instanceof Light) {
                    toUpdate.push(tile);
                }
            });
        });
        toUpdate.forEach((light) => {
            light.update();
        });
    }
}

function reset() {
    newList = [];
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
        });
    });
    grid.setTile(starterLight);
    newList.push(starterLight.sprite);
    scene.children.list = newList;
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

function levelSelect() {
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    // draw background
    background = scene.add.image(0, 0, 'inventory-bg').setOrigin(0).setScale(15).setDepth(0); // levelSelect background
    //draw buttons and textboxes
    let backButton = scene.add.image(10, 10, 'back_button').setOrigin(0).setScale(2).setDepth(1);

    levels = [];
    for (let i = 0; i < 6; i++) {
        var imageSize = 36;
        levels.push(scene.add.image(10 + i * imageSize, background.displayHeight / 2, 'level_' + i).setDepth(1));
    }
    for (let i = 0; i < 6; i++) {
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

function writeText(prompt) {
    let strings = prompt.match(/.{1,30}/g);
    var bottomOfScene = {
        // make way to get this dynamically
        x: 50,
        y: 500,
    };
    for (let i = 0; i < strings.length; i++) {
        var txt = scene.add.text(bottomOfScene.x, bottomOfScene.y + 30 * i, strings[i], { font: '16px Courier', fill: '#00ff00' });
    }
}

function makeLevel(levelNumber) {
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
                temp = new ColorExtractor(tile.pos[0], tile.pos[1], grid, tileSize, tile.orientation || 0)
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'filter') {
                temp = new ColorFliterTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.color, tile.orientation || 0);
                temp.sprite.setTint(tintColor);
                grid.setTile(temp);
            } else if (tile.name == 'output') {
                grid.setTile(new OutputTile(tile.pos[0], tile.pos[1], grid, tileSize, tile.orientation || 0, tile.lightAccept));
            }
        });
        inv = new Inventory({ x: window.innerWidth - 192 / 2, y: 768 / 2 }, json.inventory);
    });
}
