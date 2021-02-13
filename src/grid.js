class Grid{
    // side length is always odd! (sideLength of entire grid)
    // (x, y) is the center of the grid
    // tileSize is the diameter of the tile (edge to edge)
    constructor(height, width, x, y, tileSize){
        this.tiles = []; // Stores all tiles
        this.initTilesArray(sideLength);
        this.pos = {x: x, y: y};
        this.tileSize = tileSize;
        this.dims = {h: height, w: width};
    }

    initTilesArray(sideLength){
        for (var i=0; i<this.dims.h; i++){
            var layer = [];
            for (var j=0; j<this.dims.w; j++){
                layer.push(null);
            }
            this.tiles.push(layer);
        }
    }

    getPixelCoords(tileCoord){ // tile coord is an object with x and y

    }

    getNeighbors(tileCoord){

    }
}