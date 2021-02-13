class BaseTile {
    constructor(x, y, grid, tileSize){
        this.pos = {x: x, y: y};
        this.grid = grid
        var pixelCoords = grid.getPixelCoords(this.pos);
        this.sprite = scene.add.sprite(pixelCoords.x, pixelCoords.y, 'white-square');
    }
}
