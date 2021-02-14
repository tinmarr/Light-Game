class FlashlightTile extends EmptyTile {
    constructor(x, y, grid, tileSize, color, orientation, pixelCoords = null) {
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture(color + '-flashlight');
        this.orientation = orientation;
        // 0: up  1: right  2: down  3: left
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipY(true);
        this.color = color;
        this.generateLight();
    }

    generateLight() {
        var pos = { x: this.pos.x, y: this.pos.y, dir: 'N' };
        if (this.orientation == 1) {
            pos.x++;
            pos.dir = 'E';
        }
        if (this.orientation == 2) {
            pos.y++;
            pos.dir = 'S';
        }
        if (this.orientation == 3) {
            pos.x--;
            pos.dir = 'W';
        }
        if (this.orientation == 0) {
            pos.y--;
            pos.dir = 'N';
        }
        this.grid.setLightTile(pos.x, pos.y, pos.dir, this.color);
    }

    changeLight(light) {
        //takes in the light and erases it
        return;
    }
}
