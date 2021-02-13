class Grid{
    constructor(sideLength){
        this.tiles = []; // Stores all tiles
        this.initTilesArray(sideLength);
    }

    initTilesArray(sideLength){
        var numLayers = sideLength+(sideLength-1);
        var longestLength = numLayers;

        for (var i=0; i<numLayers; i++){
            var layer = [];
            if (sideLength+i <= longestLength){
                for (var j=0; j<sideLength+i; j++){
                    layer.push(null);
                }
            } else {
                for (var j=0; j< longestLength - (i - sideLength) - 1;j++){
                    layer.push(null);
                }
            }
            this.tiles.push(layer);
        }
    }

    getPixelCoords(tileCoord){

    }

    getNeighbors(tileCoord){

    }
}