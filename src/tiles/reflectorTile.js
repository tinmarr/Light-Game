class ReflectorTile extends EmptyTile{
    constructor(x, y, grid, tileSize, orientation){
        super(x, y, grid, tileSize);
        this.sprite.setTexture('reflector-tile');
        this.orientation = orientation;
        if (this.orientation == 1) this.sprite.setFlipY(true);
    }
}