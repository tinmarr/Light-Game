class ColorFliterTile extends EmptyTile {
    constructor(x, y, grid, tileSize, color, orientation, pixelCoords = null) {
        super(x, y, grid, tileSize, pixelCoords);
        this.sprite.setTexture(color + '-filter'); // TODO
        this.color = color;
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipY(true);
    }

    changeLight(light) {
        super.change_sound();
        if (this.color == light.color) {
            if (this.orientation == 0 && light.dir == 'E') {
                var posChange = [1, 0];
            } else if (this.orientation == 1 && light.dir == 'S') {
                var posChange = [0, 1];
            } else if (this.orientation == 2 && light.dir == 'W') {
                var posChange = [-1, 0];
            } else if (this.orientation == 3 && light.dir == 'N') {
                var posChange = [0, -1];
            } else {
                return;
            }
            var newPos = {
                x: this.pos.x + posChange[0],
                y: this.pos.y + posChange[1],
            };
            if (this.grid.onBoard(newPos.x, newPos.y)) {
                grid.setTile(new Light(newPos.x, newPos.y, light.dir, light.color, this.grid));
            }
        }
    }
}
