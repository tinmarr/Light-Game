class MergerTile extends EmptyTile {
    constructor(x, y, grid, tileSize, orientation, pixelCoords = null) {
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture('merger-tile');
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipX(true);
    }// discontinued
}
