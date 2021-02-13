class ColorExtractor extends EmptyTile{
    constructor(x, y, grid, tileSize, orientation){
        super(x, y, grid, tileSize);
        this.sprite.setTexture("");
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipY(true);
    }
    changeLight(light){
        var dirs = ['E', 'S', 'W', 'N'];
        if (this.orientation == 0 && light.dir == 'E') {
            var posChange = [[-1, 1, 'N'], [2, 0, 'E'], [1, -1, 'S']];
        }
        else if (this.orientation == 1 && light.dir == 'S') {
            var posChange = [[1, 1, 'E'], [0, 2, 'S'], [-1, 1, 'W']];
        }
        else if (this.orientation == 2 && light.dir == 'W'){
            var posChange = [[-1, 1, 'S'], [-2, 0, 'W'], [-1, -1, 'N']];
        }
        else if(this.orientation == 3 && light.dir == 'N'){
            var posChange = [[-1, -1, 'W'], [0, -2, 'N'], [1, -1, 'E']];
        }
        var newPos = {
            x0: light.pos.x + posChange[0][0],
            y0: light.pos.y + posChange[0][1],
            x1: light.pos.x + posChange[1][0],
            y1: light.pos.y + posChange[1][1],
            x2: light.pos.x + posChange[2][0],
            y2: light.pos.y + posChange[2][1],
        };
        this.grid.setTile(new Light(newPos.x0, newPos.y0, posChange[0][2], 'red', this.grid));
        this.grid.setTile(new Light(newPos.x1, newPos.y1, posChange[1][2], 'green', this.grid));
        this.grid.setTile(new Light(newPos.x2, newPos.y2, posChange[2][2], 'blue', this.grid));
      }
}