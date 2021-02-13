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
    tileSize = 34;

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
    this.load.image('white-light', 'assets/white-light.png');
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
    ]);
}

function create(){
    makeLevel(1);
}

function update(){
    if (updating){
        grid.tiles.forEach(layer => {
            layer.forEach(tile => {
                if (tile instanceof Light){
                    tile.update();
                }
            });
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
    if (e.key == 'r'){
        updating = true;
    } else if (e.key == 's'){
        updating = false;
    }
}

function makeLevel(levelNumber){
    scene.children.getChildren().splice(0, scene.children.getChildren().length); // clear canvas
    $.getJSON('levels/'+levelNumber+'.json', (json)=>{
        grid = new Grid(json.dims.h, json.dims.w, 50, 50, tileSize);
        grid.setTile(new Light(json.startPos.x, json.startPos.y, json.startPos.dir, 'white', grid));
        json.level.forEach(tile => {
            if (tile.tileType == 'reflector'){
                grid.setTile(new ReflectorTile(tile.pos.x, tile.pos.y, grid, tileSize, tile.orientation));
            } else if (tile.tileType == 'stone'){
                grid.setTile(new StoneTile(tile.pos.x, tile.pos.y, grid, tileSize));
            } else if (tile.tileType == 'extractor'){
                grid.setTile(new ColorExtractor(tile.pos.x, tile.pos.y, grid, tileSize, tile.orientation));
            } else if (tile.tileType == 'filter'){
                grid.setTile(new ColorFliterTile(tile.pos.x, tile.pos.y, grid, tileSize, tile.color, tile.orientation));
            }
        });
    });
}