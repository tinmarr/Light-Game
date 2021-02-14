class Grid {
    // side length is always odd! (sideLength of entire grid)
    // (x, y) is the top left of the grid
    // tileSize is the diameter of the tile (edge to edge)
    constructor(height, width, x, y, tileSize) {
        this.tiles = []; // Stores all tiles
        this.pos = { x: x, y: y };
        this.tileSize = tileSize;
        this.dims = { h: height, w: width };
        this.initTilesArray();
    }

    initTilesArray() {
        for (var i = 0; i < this.dims.h; i++) {
            var layer = [];
            for (var j = 0; j < this.dims.w; j++) {
                layer.push(new EmptyTile(j, i, this, this.tileSize));
            }
            this.tiles.push(layer);
        }
    }
    onBoard(x, y) {
        return 0 <= y && y <= this.dims.h && 0 <= x && x <= this.dims.w;
    }

    getPixelCoords(tileCoord) {
        // tile coord is an object with x and y
        var pixelCoord = { x: null, y: null };

        if (tileCoord == null) return null;

        pixelCoord.x = this.pos.x + tileCoord.x * this.tileSize;
        pixelCoord.y = this.pos.y + tileCoord.y * this.tileSize;

        return pixelCoord;
    }

    getGridCoords(pixelCoord) {
        //       --------------bug: can still be put on other elements on the grid
        var tileCoord = { x: null, y: null };
        tileCoord.x = Math.ceil((pixelCoord.x - this.pos.x) / this.tileSize);
        tileCoord.y = Math.ceil((pixelCoord.y - this.pos.y) / this.tileSize);
        if (tileCoord.x > this.dims.w - 1) {
            tileCoord = null;
            return;
        }
        if (tileCoord.y > this.dims.h - 1) {
            tileCoord = null;
            return;
        }
        return tileCoord;
    }

    getNeighbours(row, col) {
        var locations = [
            [-1, 1],
            [0, 1],
            [1, 1],
            [-1, 0],
            [1, 0],
            [-1, -1],
            [0, -1],
            [1, -1],
        ];
        var neighbours = [];
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i];
            var add_row = loc[0];
            var add_col = loc[1];
            var new_row = row + add_row;
            var new_col = col + add_col;
            if (0 <= new_row < this.tiles[0].length && 0 <= new_col < this.tiles.length) {
                var temp = [new_row, new_col];
                neighbours.push(temp);
            }
        }
        return neighbours;
    }

    setLightTile(lightx, lighty, dir, color) {
        var pos = {
            x: lightx,
            y: lighty,
        };
        if (!(lighty > this.dims.h || lightx > this.dims.w) && this.getTile(pos).constructor.name != EmptyTile.name) {
            this.getTile(pos).changeLight(new GhostLight(pos.x, pos.y, dir, color, this));
        } else if (!(lighty > this.dims.h || lightx > this.dims.w)) {
            this.getTile(pos).changeLight(new Light(pos.x, pos.y, dir, color, this));
        }
    }

    setTile(entity) {
        if (!(entity.pos.y > this.dims.h || entity.pos.x > this.dims.w)) {
            this.tiles[entity.pos.y][entity.pos.x] = entity;
        }
    }
    //
    getTile(pos) {
        return this.tiles[pos.y][pos.x];
    }
}
