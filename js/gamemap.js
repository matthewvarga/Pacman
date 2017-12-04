/* Representation of the games map
 * -map: Map - map of game tiles --> key: "x,y" val: Tile
 * -max_x_tile - largest x tile in map
 * -max_y_tile - largest y tile in map
 */
class GameMap {
	constructor(){
		this.map = new Map();
		this.max_x_tile = 0;
		this.max_y_tile = 0;
	};
	get map(){
		return this._map;
	}
	set map(new_map){
		this._map = new_map;
	}
	get max_x_tile(){
		return this._max_x_tile;
	}
	set max_x_tile(new_max_x_tile){
		this._max_x_tile = new_max_x_tile;
	}
	get max_y_tile(){
		return this._max_y_tile;
	}
	set max_y_tile(new_max_y_tile){
		this._max_y_tile = new_max_y_tile;
	}
	get_map_tile(tile_coord){
		return this._map.get(String(tile_coord[0] + "," + tile_coord[1]));
	}
	set_map_tile(tile){
		(this._map).set(String(tile.coord[0] + "," + tile.coord[1]), tile);
		if(tile.coord[0] > this._max_x_tile){
			this._max_x_tile = tile.coord[0];
		}
		if(tile.coord[1] > this._max_y_tile){
			this._max_y_tile = tile.coord[1];
		}
	}
	 
	/* Draws the map background (no entities such as player or ghosts)
	 * context: Context - the canvas context
	 * game_map: GameMap - the GameMap containing background tiles
	 */
	draw(context){
		for(var y = 0; y <= this._max_y_tile; y++){
			for(var x = 0; x <= this._max_x_tile; x++){ 
				var tile = this.get_map_tile([x,y])
				tile.draw(context);
			}
		}
	}
}