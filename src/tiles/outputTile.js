class OutputTile extends EmptyTile{
    constructor(x, y, grid, tileSize, orientation, lightAccept='white'){
        super(x, y, grid, tileSize);
        this.sprite.setTexture('output-tile-withoutlight');
        this.sprite.setScale(0.5);
        this.orientation = orientation; // the orientation refers to the white light position
        // 0: left  1: top  2: right  3: bottom
        if (this.orientation == 1) this.sprite.angle = 90;
        if (this.orientation == 3) this.sprite.angle = -90;
        if (this.orientation == 2) this.sprite.setFlipY(true);

        this.lightAccept = lightAccept;
    }
    reset(){
        this.sprite.setTexture('output-tile-withoutlight');
    }
    changeLight(light){
        // check if white light enters: this should be changed if we want different lights to enter the splitter
        if (light.color != this.lightAccept) {
          this.sprite.setTexture('red-light');
          // this.sprite.setTexture('output-tile-withoutlight');
          return;
        }else {
          this.sprite.setTexture('green-light');
          // this.sprite.setTexture('output-tile-withlight');
        }
      }
}
