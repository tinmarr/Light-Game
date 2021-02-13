class Grid{
    // side length is always odd! (sideLength of entire grid)
    // (x, y) is the top right of the grid
    // tileSize is the diameter of the tile (edge to edge)
    constructor(height, width, x, y, tileSize){
        this.tiles = []; // Stores all tiles
        this.pos = {x: x, y: y};
        this.tileSize = tileSize;
        this.dims = {h: height, w: width};
        this.initTilesArray();
    }

    initTilesArray(){
        for (var i=0; i<this.dims.h; i++){
            var layer = [];
            for (var j=0; j<this.dims.w; j++){
                layer.push(new BaseTile(j, i, this, this.tileSize));
            }
            this.tiles.push(layer);
        }
    }

    getPixelCoords(tileCoord){ // tile coord is an object with x and y
        var pixelCoord = {x: null, y:null};
        
        pixelCoord.x = this.pos.x + (tileCoord.x * this.tileSize);
        pixelCoord.y = this.pos.y + (tileCoord.y * this.tileSize);

        return pixelCoord;
    }

    getNeighbors(tileCoord){

    }
}