class StoneTile extends EmptyTile{
    constructor(x, y, grid, tileSize){
        super(x, y, grid, tileSize);
        this.sprite.setTexture("");

    }
    changeLight(light){ //takes in the light and erases it
        return;
    }
}
