class ReflectorTile extends EmptyTile{
    constructor(x, y, grid, tileSize, orientation, pixelCoords = null){
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture('reflector-tile');
        this.orientation = orientation; // 0 means slope -1 and 1 means slope 1
        if (this.orientation == 1) this.sprite.setFlipY(true);
    }

    changeLight(light){
        var dirs = ['E', 'S', 'W', 'N'];
        if (this.orientation == 0) {
            var posChange = [[1, 1, 'S'], [-1, -1, 'W'], [-1, -1, 'N'], [1, 1, 'N']];
        } else {
            var posChange = [[1, -1, 'N'], [1, -1, 'E'], [-1, 1, 'S'], [-1, -1, 'W']];
        }
        var newPos = {
            x: light.pos.x + posChange[dirs.indexOf(light.dir)][0],
            y: light.pos.y + posChange[dirs.indexOf(light.dir)][1],
        };
        this.grid.setTile(new Light(newPos.x, newPos.y, posChange[dirs.indexOf(light.dir)][2], light.color, this.grid));
    }
}