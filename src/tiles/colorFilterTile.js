class ColorFliterTile extends EmptyTile{
    constructor(x, y, grid, tileSize, color, orientation){
        super(x, y, grid, tileSize);
        this.sprite.setTexture(''); // TODO
        this.color = color;
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipY(true);
    }

    changeLight(light){
        if (this.color == light.color){
            var dirs = ['E', 'S', 'W', 'N'];
            var posChange = [[1, 0], [0, 1], [-1, 0], [0, -1]];
            var newPos = {
                x: this.pos.x + posChange[dirs.indexOf(light.dir)][0],
                y: this.pos.y + posChange[dirs.indexOf(light.dir)][1],
            };
            grid.setTile(new Light(newPos.x, newPos.y, light.dir, light.color, this.grid));
        }   
    }
}