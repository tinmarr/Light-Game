class Light {
    constructor(x, y, direction, color, grid) {
        this.pos = { x: x, y: y };
        this.dir = direction; // N, E, W, S
        this.color = color;
        var pixelPos = grid.getPixelCoords(this.pos);
        this.sprite = scene.add.sprite(pixelPos.x, pixelPos.y, color + '-light');
        this.sprite.setScale(scaleSize);
        this.sprite.setData('type', 'light');
        this.rotate();
        this.grid = grid;
    }

    update() {
        var dirs = ['E', 'S', 'W', 'N'];
        var posChange = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
        ];
        var newPos = {
            x: this.pos.x + posChange[dirs.indexOf(this.dir)][0],
            y: this.pos.y + posChange[dirs.indexOf(this.dir)][1],
        };
        if (newPos.x >= this.grid.dims.w || newPos.x < 0) {
            return;
        } else if (newPos.y >= this.grid.dims.h || newPos.y < 0) {
            return;
        }
        if (!(this.grid.getTile(newPos) instanceof Light)) {
            if (this.grid.getTile(newPos) instanceof EmptyTile) {
            }
            this.grid.getTile(newPos).changeLight(this);
        }
    }

    rotate() {
        var rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
        var dirs = ['E', 'S', 'W', 'N'];
        this.sprite.setRotation(rotations[dirs.indexOf(this.dir)]);
    }
}
