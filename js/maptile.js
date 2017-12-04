/* Representation of a map tile
 * coord: [int, int] - [x,y] top left corner of tile on map
 * type: String - type of map tyle
 * sprite: Sprite - sprite representation of tile
 */
class MapTile {
	constructor(coord, type, size, sprite){
		this.coord = coord;
		this.type = type;
		this.size = size;
		this.sprite = sprite;
	}
	get coord(){
		return this._coord;
	}
	set coord(new_coord){
		this._coord = new_coord;
	}
	get type(){
		return this._type;
	}
	set type(new_type){
		this._type = new_type;
	}
	get size(){
		return this._size;
	}
	set size(new_size){
		this._size = new_size;
	}
	get sprite(){
		return this._sprite;
	}
	set sprite(new_sprite){
		this._sprite = new_sprite;
	}

	/* Draws a tile on the canvas
	 * context: Context - the canvas context
	 * tile: MapTile - the tile to be drawn
	 */
	draw(context){
		this._sprite.draw(context, [this._coord[0]*this._size, this._coord[1]*this._size]);
	}
}