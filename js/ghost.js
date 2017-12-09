/* Representation of a Ghost
 * colour: String - colour of the ghost (red, orange, blue, pink)
 * state: String - ghosts current state (alive, edible, edible_flashing, dead)
 * spawn_coord: [int, int] - [x,y] tile where ghost is spawned
 * cur_coord: [int, int] - top left [x,y] position of ghost
 * velocity: int - ghosts velocity when moving
 * size: int - ghosts size
 * int_dir: String - intended direction ("left", "right", "up", "down")
 * cur_dir: String - current direction ("left", "right", "up", "down")
 * is_moving: bool - true if ghost is currently moving in a direction with not obstacles stopping it
 * dir_timer: int - frames left before selecting a enw random direction to travel in
 * sprites: Map(String: Map(String: [Sprite, Sprite, ...])) - map of direction to map of alive/dead/edible/edible_flashing to sprites for each animation cycle
 * anim_frame: int - frame of animation currently in
 * anim_timer: int -numer of frames that pass before animation frame changes
 */
class Ghost {
	constructor(colour, state, spawn_coord, cur_coord, velocity, size, int_dir, cur_dir, is_moving, dir_timer, dir_update, sprites, anim_frame, anim_timer, anim_update, hitbox){
		this.colour = colour;
		this.state = state;
		this.spawn_coord = spawn_coord;
		this.cur_coord = cur_coord;
		this.velocity = velocity;
		this.size = size;
		this.int_dir = int_dir;
		this.cur_dir = cur_dir;
		this.is_moving = is_moving;
		this.dir_timer = dir_timer;
		this.dir_update = dir_update;
		this.sprites = sprites;
		this.anim_frame = anim_frame;
		this.anim_timer = anim_timer;
		this.anim_update = anim_update;
		this.hitbox = hitbox;
	}
	get colour(){
		return this._colour;
	}
	set colour(new_colour){
		this._colour = new_colour;
	}
	get state(){
		return this._state;
	}
	set state(new_state){
		this._state = new_state;
	}
	get spawn_coord(){
		return this._spawn_coord;
	}
	set spawn_coord(new_spawn_coord){
		this._spawn_coord = new_spawn_coord;
	}
	get cur_coord(){
		return this._cur_coord;
	}
	set cur_coord(new_cur_coord){
		this._cur_coord = new_cur_coord;
	}
	get velocity(){
		return this._velocity;
	}
	set velocity(new_velocity){
		this._velocity = new_velocity;
	}
	get size(){
		return this._size;
	}
	set size(new_size){
		this._size = new_size;
	}
	get int_dir(){
		return this._int_dir;
	}
	set int_dir(new_int_dir){
		this._int_dir = new_int_dir;
	}
	get cur_dir(){
		return this._cur_dir;
	}
	set cur_dir(new_cur_dir){
		this._cur_dir = new_cur_dir;
	}
	get is_moving(){
		return this._is_moving;
	}
	set is_moving(new_is_moving){
		this._is_moving = new_is_moving;
	}
	get dir_timer(){
		return this._dir_timer;
	}
	set dir_timer(new_dir_timer){
		this._dir_timer = new_dir_timer;
	}
	get dir_update(){
		return this._dir_update;
	}
	set dir_update(new_dir_update){
		this._dir_update = new_dir_update;
	}
	get sprites(){
		return this._sprites;
	}
	set sprites(new_sprites){
		this._sprites = new_sprites;
	}
	get anim_frame(){
		return this._anim_frame;
	}
	set anim_frame(new_anim_frame){
		this._anim_frame = new_anim_frame;
	}
	get anim_timer(){
		return this._anim_timer;
	}
	set anim_timer(new_anim_timer){
		this._anim_timer = new_anim_timer;
	}
	get anim_update(){
		return this._anim_update;
	}
	set anim_update(new_anim_update){
		this._anim_update = new_anim_update;
	}
	get hitbox(){
		return this._hitbox;
	}
	set hitbox(new_hitbox){
		this._hitbox = new_hitbox;
	}

	/* Draws a ghost in its current animation frame
	 * context: Context - the canvas context
	 * ghost: Ghost - the ghost being drawn
	 */
	draw(context){
		// array containing current animation sprites
		var ghost_anim_sprites = this._sprites.get(this._cur_dir).get(this._state);

		// check if ready to update
		if(this._anim_timer >= this._anim_update){
			this._anim_frame += 1;
			this._anim_timer = 0;
		}
		// check if at last frame
		if(this._anim_frame >= (ghost_anim_sprites.length-1)){
			this._anim_frame = 0;
		}
		// if not ready, update timer
		this._anim_timer += 1;

		// draw ghost
		var anim_sprite = ghost_anim_sprites[this._anim_frame];
		anim_sprite.draw(context, this._cur_coord);
	}

	update_pos(game_map){
		// calculate the tile positions the ghost is above
		var ghost_floor_tile_pos = [Math.floor(this._cur_coord[0]/this._size), Math.floor(this._cur_coord[1]/this._size)];
		var ghost_ceil_tile_pos = [Math.ceil(this._cur_coord[0]/this._size), Math.ceil(this._cur_coord[1]/this._size)];

		// retrieve the tiles beneath the ghost
		var ghost_floor_tile = game_map.get_map_tile(ghost_floor_tile_pos);
		var ghost_ceil_tile = game_map.get_map_tile(ghost_ceil_tile_pos);

		var directions = ["left", "right", "up", "down"];
		// check if ghost should change directions
		if(this._dir_timer >= this._dir_update){
			this._dir_timer = 0;
			// select random index ofnew direction
			var new_rand_dir = Math.floor((Math.random() * directions.length));
			// set ghosts intended direction to the random one selected
			this._int_dir = directions[new_rand_dir];
		}
		// not ready, increase timer
		this._dir_timer += 1;

		// check if ghost is perfectly on a tile
		if((ghost_floor_tile_pos[0] == ghost_ceil_tile_pos[0]) && (ghost_floor_tile_pos[1] == ghost_ceil_tile_pos[1])){

			var left_tile = game_map.get_map_tile([ghost_floor_tile_pos[0]-1, ghost_floor_tile_pos[1]]);
			var right_tile = game_map.get_map_tile([ghost_ceil_tile_pos[0]+1, ghost_ceil_tile_pos[1]]);
			var up_tile = game_map.get_map_tile([ghost_floor_tile_pos[0], ghost_floor_tile_pos[1]-1]);
			var down_tile = game_map.get_map_tile([ghost_ceil_tile_pos[0], ghost_ceil_tile_pos[1]+1]);

			var valid_tiles = ["empty", "point_small", "point_big"];

			// check if leaving spawn
			if((up_tile.type == "gate")&&(this._is_moving)){
				this._cur_dir = "up";
				this._int_dir = "up";
				this._cur_coord[1] -= this._velocity;
			}

			else if((up_tile.type == "gate_r")&&(this._is_moving)){
				this._cur_dir = "left";
				this._int_dir = "up";
				this._cur_coord[0] -= this._velocity;
			}

			else if((up_tile.type == "gate_l")&&(this._is_moving)){
				this._cur_dir = "right";
				this._int_dir = "up";
				this._cur_coord[0] += this._velocity;
			}

			// check if ghost can move in intended direction
			else if(((this._int_dir == "left") && (valid_tiles.includes(left_tile.type)))&&(this._is_moving)){
				this._cur_dir = "left";
				this._cur_coord[0] -= this._velocity;
			}
			else if(((this._int_dir == "right") && (valid_tiles.includes(right_tile.type)))&&(this._is_moving)){
				this._cur_dir = "right";
				this._cur_coord[0] += this._velocity;
			}
			else if(((this._int_dir == "up") && (valid_tiles.includes(up_tile.type)))&&(this._is_moving)){
				this._cur_dir = "up";
				this._cur_coord[1] -= this._velocity;
			}
			else if(((this._int_dir == "down") && (valid_tiles.includes(down_tile.type)))&&(this._is_moving)){
				this._cur_dir = "down";
				this._cur_coord[1] += this._velocity;
			}
			else{
				// check if ghost can move in current direction, since cant in intended
				if((this._cur_dir == "left") && (valid_tiles.includes(left_tile.type))){
					if(this._is_moving){
						this._cur_coord[0] -= this._velocity;
					}
				}
				else if((this._cur_dir == "right") && (valid_tiles.includes(right_tile.type))){
					if(this._is_moving){
						this._cur_coord[0] += this._velocity;
					}
				}
				else if((this._cur_dir == "up") && (valid_tiles.includes(up_tile.type))){
					if(this._is_moving){
						this._cur_coord[1] -= this._velocity;
					}
				}
				else if((this._cur_dir == "down") && (valid_tiles.includes(down_tile.type))){
					if(this._is_moving){
						this._cur_coord[1] += this._velocity;
					}
				}
				// ghost cant move
				else{
					// randomly select new direction to move in
					var int_dir_index = directions.indexOf(this._int_dir);
					// remove current intended direction from possible new directions
					directions.splice(int_dir_index, 1);
					var cur_dir_index = directions.indexOf(this._cur_dir);
					// remove current direction from possible new directions, if it's different than inteded directions
					if(cur_dir_index >= 0){
						directions.splice(cur_dir_index, 1);
					}
					// select random index of remaining directions array
					var rand_dir = Math.floor((Math.random() * directions.length));
					// set ghosts intended direction to the random one selected
					this._int_dir = directions[rand_dir];
				}
			}
		}
		// ghost NOT perfectly on tile (moving horizontally --> x diff y same)
		else if((ghost_floor_tile_pos[0] != ghost_ceil_tile_pos[0])&&(ghost_floor_tile_pos[1] == ghost_ceil_tile_pos[1])){
			if((this._int_dir == "left")&&(this._is_moving)){
				this._cur_dir = "left";
				this._cur_coord[0] -= this._velocity;
			}
			else if((this._int_dir == "right")&&(this._is_moving)){
				this._cur_dir = "right";
				this._cur_coord[0] += this._velocity;
			}
			else{
				if((this._cur_dir == "left")&&(this._is_moving)){
					this._cur_coord[0] -= this._velocity;
				}
				else if((this._cur_dir == "right")&&(this._is_moving)){
					this._cur_coord[0] += this._velocity;
				}
			}
		}
		// ghost NOT perfectly on tile (moving veritcally --> y diff x same)
		else if((ghost_floor_tile_pos[0] == ghost_ceil_tile_pos[0])&&(ghost_floor_tile_pos[1] != ghost_ceil_tile_pos[1])){
			if((this._int_dir == "up")&&(this._is_moving)){
				this._cur_dir = "up";
				this._cur_coord[1] -= this._velocity;
			}
			else if((this._int_dir == "down")&&(this._is_moving)){
				this._cur_dir = "down";
				this._cur_coord[1] += this._velocity;
			}
			else{
				if((this._cur_dir == "up")&&(this._is_moving)){
					this._cur_coord[1] -= this._velocity;
				}
				else if((this._cur_dir == "down")&&(this._is_moving)){
					this._cur_coord[1] += this._velocity;
				}
			}
		}
	}
}