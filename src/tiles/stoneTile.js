class StoneTile extends EmptyTile {
    constructor(x, y, grid, tileSize, pixelCoords = null) {
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture('stone-tile');
    }
    changeLight(light) {
        //takes in the light and erases it
        return;
    }
}
