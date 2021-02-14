class Inventory {
    constructor(pos, items) {
        this.pos = pos;
        this.items = items;
        this.bg = scene.add.sprite(pos.x, pos.y, 'inventory-bg');
        this.bg.setScale(8, 32);

        for (var i = 0; i < items.length; i++) {
            this.initItems(i, items[i]);
        }
    }

    initItems(number, item) {
        var pixelX = null;
        var pixelY = null;
        if (number % 2 == 0) {
            pixelX = this.bg.x - tileSize;
        } else {
            pixelX = this.bg.x + tileSize;
        }

        pixelY = this.bg.y - (this.bg.height * 1.5) / 2 + Math.floor(number / 2) * tileSize + tileSize;
        var pixelCoords = { x: pixelX, y: pixelY };

        var tile;
        if (item == 'reflector') {
            tile = new ReflectorTile(null, null, null, tileSize, 0, pixelCoords);
        } else if (item == 'extractor') {
            tile = new ColorExtractor(null, null, null, tileSize, 0, pixelCoords);
        } else if (item == 'filter') {
            tile = new ColorFliterTile(null, null, null, tileSize, 'white', 0, pixelCoords);
        }
        tile.sprite.setInteractive();
        scene.input.setDraggable(tile.sprite);
    }
}
