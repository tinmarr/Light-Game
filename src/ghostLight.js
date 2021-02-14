class GhostLight {
    constructor(x, y, direction, color, grid) {
        this.pos = { x: x, y: y };
        this.dir = direction; // N, E, W, S
        this.color = color;
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
            this.grid.getTile(newPos).changeLight(this);
        }
    }
}
