class EmptyTile {
    constructor(x, y, grid, tileSize){
        this.pos = {x: x, y: y};
        this.grid = grid
        var pixelCoords = grid.getPixelCoords(this.pos);
        this.sprite = scene.add.sprite(pixelCoords.x, pixelCoords.y, 'empty-tile');
    }

    changeLight(light){
        grid.setTile(new Light(this.pos.x, this.pos.y, light.dir, light.color, this.grid));
    }
}