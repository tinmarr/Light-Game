class OutputTile extends EmptyTile {
    constructor(x, y, grid, tileSize, orientation, lightAccept = 'white', pixelCoords = null) {
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture(lightAccept + '-out-no');
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.setRotation(Math.PI / 2);
        if (this.orientation == 3) this.sprite.setRotation(-Math.PI / 2);
        if (this.orientation == 2) this.sprite.setFlipX(true);

        this.lightAccept = lightAccept;
    }
    reset() {
        this.sprite.setTexture(this.lightAccept + '-out-no');
    }
    changeLight(light) {
        // check if white light enters: this should be changed if we want different lights to enter the splitter
        if (light.color != this.lightAccept) {
            this.sprite.setTexture(this.lightAccept + '-out-wrong');
            // this.sprite.setTexture('output-tile-withoutlight');
            return;
        } else {
            this.sprite.setTexture(this.lightAccept + '-out-clear');
            // this.sprite.setTexture('output-tile-withlight');
        }
    }
}
