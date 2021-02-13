class ColorFliterTile extends EmptyTile{
    constructor(x, y, grid, tileSize, color){
        super(x, y, grid, tileSize);
        this.sprite.setTexture(''); // TODO
        this.color = color;
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