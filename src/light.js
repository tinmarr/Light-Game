class Light{
    constructor(x, y, direction, color, grid){
        this.pos = {x: x, y: y};
        this.dir = direction; // N, E, W, S
        this.color = color;
        var pixelPos = grid.getPixelCoords(this.pos);
        this.sprite = scene.add.sprite(pixelPos.x, pixelPos.y, color+'-light');
        this.rotate();
        this.grid = grid;
    }

    update(){
        var dirs = ['E', 'S', 'W', 'N'];
        var posChange = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        var newPos = {
            x: this.pos.x + posChange[dirs.indexOf(this.dir)][0],
            y: this.pos.y + posChange[dirs.indexOf(this.dir)][1],
        };
        grid.setTile(new Light(newPos.x, newPos.y, this.dir, this.color, this.grid));
    }

    rotate(){
        var rotations = [0, Math.PI/2, Math.PI, (3*Math.PI)/2];
        var dirs = ['E', 'S', 'W', 'N'];
        this.sprite.setRotation(rotations[dirs.indexOf(this.dir)]);
    }
}