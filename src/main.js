var config = {
    type: Phaser.AUTO,
    width: window.innerHeight,
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
    scene;

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

    this.load.image('white-square', 'assets/White-Square.jpg');

    this.load.scripts('all', [
        makeURL('tiles', 'baseTile'),
        makeURL('', 'grid'),
    ]);
}

function create(){
    grid = new Grid(5, 5, window.innerWidth / 2, window.innerHeight / 2, 30);
}

function update(){

}

function makeURL(folder,file){
    if (folder === ''){
        var name = file;
    } else {
        var name = folder+'/'+file;
    }
    return './src/'+name+'.js';
}