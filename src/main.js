var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config),
    grid,
    scene,
    updating = false,
    start = {x: 0, y: 0},
    tileSize = 34,
    tintColor = 0x696a6a,
    starterLight;

function preload(){
    scene = this;
    width = this.game.canvas.width;
    height = this.game.canvas.height;
    var progressBar = this.add.graphics(),
        progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect((width/2)-150, (height/2)-25, 300, 50, 5);

    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRoundedRect((width/2)-140, (height/2)-15, 280 * value, 30, 5);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
    });

    this.load.image('empty-tile', 'assets/empty-tile.jpg');
    // load light colors
    this.load.image('white-light', 'assets/white-light.png');
    this.load.image('red-light', 'assets/red-light.png');
    this.load.image('green-light', 'assets/green-light.png');
    this.load.image('blue-light', 'assets/blue-light.png');
    //endlights
    this.load.image('reflector-tile', 'assets/reflector.png');
    this.load.image('extractor-tile', 'assets/extractor.png');

    this.load.scripts('all', [
        makeURL('tiles', 'emptyTile'),
        makeURL('', 'grid'),
        makeURL('', 'light'),
        makeURL('tiles', 'reflectorTile'),
        makeURL('tiles', 'stoneTile'),
        makeURL('tiles', 'colorExtractor'),
        makeURL('tiles', 'colorFilterTile'),
        makeURL('tiles', 'outputTile'),
    ]);

    // music and sound effects
    this.load.audio("main-menu_music", "assets/main-menu_music.mp3")
}

function create(){
    // menu();
    makeLevel(1);
}

function update(){
    if (updating){
        var toUpdate = [];
        grid.tiles.forEach(layer => {
            layer.forEach(tile => {
                if (tile instanceof Light){
                    toUpdate.push(tile);
                }
            });
        });
        toUpdate.forEach(light =>{
            light.update();
        });
    }
}

function makeURL(folder,file){
    if (folder === ''){
        var name = file;
    } else {
        var name = folder+'/'+file;
    }
    return './src/'+name+'.js';
}

function keyBinds(e){
    if (e.key == ' '){
        if (updating){
            updating = false;
            newList = [];
            scene.children.getChildren().forEach(sprite => {
                if (sprite.getData('type') != 'light'){
                    newList.push(sprite);
                }
            })
            grid.tiles.forEach(layer => {
                layer.forEach(tile => {
                    if (tile instanceof Light){
                        grid.setTile(new EmptyTile(tile.pos.x, tile.pos.y, grid, tileSize));
                    }
                    if(tile instanceof OutputTile) tile.reset();
                })
            })
            grid.setTile(starterLight);
            newList.push(starterLight.sprite);
            scene.children.list = newList;
        } else {
            updating = true;
        }
    }
}


function levelSelect(){
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    // draw background
    background = scene.add.image(0,0, "empty-tile").setOrigin(0).setScale(5).setDepth(0); // levelSelect background
    //draw buttons and textboxes
    let backButton = scene.add.image(background.displayWidth / 2, background.displayHeight / 2, "back_button").setDepth(1);

    for (let i = 0; i < 5; i++){
      var tempboi = scene.add.image(background.displayWidth / 2, background.displayHeight / 2, "level_" + i).setDepth(1);
      tempboi.setInteractive();
      tempboi.on("pointerover", ()=>{
          tempboi.setTint(tintColor);
          // console.log("in");
      });
      tempboi.on("pointerout", ()=>{
          tempboi.clearTint();
          // console.log("out");
      });
      tempboi.on("pointerup", ()=>{
          makeLevel(i);
          // level select
      });
    }
    // interactivity
    backButton.setInteractive();
    backButton.on("pointerover", ()=>{
        backButton.setTint(tintColor);
        console.log("in");
    });
    backButton.on("pointerout", ()=>{
        backButton.clearTint();
        console.log("out");
    });
    backButton.on("pointerup", ()=>{
        console.log("out");
        menu();
    });
}


function menu(){
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    scene.sound.pauseOnBlur = false;
    // scene.sound.play("main-menu_music", {  --- uncomment when music is available
    //   loop: true,
    // });
    background = scene.add.image(0,0, "empty-tile").setOrigin(0).setScale(5).setDepth(0); //main-menu_background get rid of setscale
    let playButton = scene.add.image(background.displayWidth / 2, background.displayHeight / 2, "play_button").setDepth(1);

    playButton.setInteractive();
    playButton.on("pointerover", ()=>{
        playButton.setTint(tintColor);
        console.log("in");
    });
    playButton.on("pointerout", ()=>{
        playButton.clearTint();
        console.log("out");
    });
    playButton.on("pointerup", ()=>{
        console.log("out");
        levelSelect();
    });
}

function writeText(prompt){
    let strings = (prompt.match(/.{1,30}/g));
    var bottomOfScene = { // make way to get this dynamically
      x:50,
      y:500,
    }
    for(let i = 0; i< strings.length; i++){
    var txt = scene.add.text(bottomOfScene.x, bottomOfScene.y+30*i, strings[i], { font: '16px Courier', fill: '#00ff00' });
    }
}

function makeLevel(levelNumber){
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    $.getJSON('levels/'+levelNumber+'.json', (json)=>{
        grid = new Grid(json.dims.h, json.dims.w, 50, 50, tileSize);
        starterLight = new Light(json.startPos.x, json.startPos.y, json.startPos.dir, json.startPos.color, grid);
        grid.setTile(starterLight);
        json.level.forEach(tile => {
            if (tile.tileType == 'reflector'){
                grid.setTile(new ReflectorTile(tile.pos.x, tile.pos.y, grid, tileSize, tile.orientation));
            } else if (tile.tileType == 'stone'){
                grid.setTile(new StoneTile(tile.pos.x, tile.pos.y, grid, tileSize));
            } else if (tile.tileType == 'extractor'){
                grid.setTile(new ColorExtractor(tile.pos.x, tile.pos.y, grid, tileSize, tile.orientation));
            } else if (tile.tileType == 'filter'){
                grid.setTile(new ColorFliterTile(tile.pos.x, tile.pos.y, grid, tileSize, tile.color, tile.orientation));
            } else if (tile.tileType == 'output'){
                grid.setTile(new OutputTile(tile.pos.x, tile.pos.y, grid, tileSize, tile.orientation, tile.lightAccept));
            }
        });
    });
}
