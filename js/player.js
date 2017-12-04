//SIDEBAR CONSTANTS
const SCORE_POS = [[441,4],[452,4],[463,4],[474,4]];
const LIVES_POS = [[440,32],[460,32],[480,32]];


/* Representation of a player
 * is_alive: bool - true if player is alive, false if in death animation
 * is_boosted: bool - true if player is boosted (eaten big point), false o/w
 * spawn_coord: [int, int] - [x,y] tile where player is spawned
 * cur_coord: [int, int] - top left [x,y] position of player
 * lives: int - num lives remaining
 * velocity: int - players velocity when moving
 * size: int - players size
 * int_dir: String - intended direction ("left", "right", "up", "down")
 * cur_dir: String - current direction ("left", "right", "up", "down")
 is_moving: bool - true if player is currently moving in a direction with not obstacles stopping them
 * sprites: Map(String: Map(String: [Sprite, Sprite, ...])) - map of direction to map of alive/dead to sprites for each animation cycle
 * anim_frame: int - frame of animation currently in
 * anim_timer: int -numer of frames that pass before animation frame changes
 * boost_timer: int - number of frames the player is boosted for 
 */
class Player {
	constructor(is_alive, is_boosted, spawn_coord, cur_coord, lives, velocity, size, int_dir, cur_dir, is_moving, sprites, anim_frame, anim_timer, anim_update, boosted_timer, hitbox, score){
		this.is_alive = is_alive;
		this.is_boosted = is_boosted;
		this.spawn_coord = spawn_coord;
		this.cur_coord = cur_coord;
		this.lives = lives;
		this.velocity = velocity;
		this.size = size;
		this.int_dir = int_dir;
		this.cur_dir = cur_dir;
		this.is_moving = is_moving;
		this.sprites = sprites;
		this.anim_frame = anim_frame;
		this.anim_timer = anim_timer;
		this.anim_update = anim_update;
		this.boosted_timer = boosted_timer;
		this.hitbox = hitbox;
		this.score = score;
	}
	get is_alive(){
		return this._is_alive;
	}
	set is_alive(new_is_alive){
		this._is_alive = new_is_alive;
	}
	get is_boosted(){
		return this._is_boosted;
	}
	set is_boosted(new_is_boosted){
		this._is_boosted = new_is_boosted;
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
	get lives(){
		return this._lives;
	}
	set lives(new_lives){
		this._lives = new_lives;
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
	get boosted_timer(){
		return this._boosted_timer;
	}
	set boosted_timer(new_boosted_timer){
		this._boosted_timer = new_boosted_timer;
	}
	get hitbox(){
		return this._hitbox;
	}
	set hitbox(new_hitbox){
		this._hitbox = new_hitbox;
	}
	get score(){
		return this._score;
	}
	set score(new_score){
		this._score = new_score;
	}

	draw(context){
		// check if player alive or not
		var player_state = "dead";
		if(this._is_alive){
			player_state = "alive";
		}
		// array containing current animations sprites
		var player_anim_sprites = this._sprites.get(this._cur_dir).get(player_state);

		// ready to update animation
		if(this._anim_timer >= this._anim_update){
			this._anim_timer = 0;
			// check if at last frame
			if(this._anim_frame == (player_anim_sprites.length - 1)){
				this._anim_frame = 0;
			}
			else{
				this._anim_frame += 1;
			}
		}
		// not ready to update animation
		else{
			this._anim_timer += 1;
		}
		// draw player
		var anim_sprite = player_anim_sprites[this._anim_frame];
		anim_sprite.draw(context, this._cur_coord);
	}

	/* Draws the players score on the sidebar
	 * context: Context - the canvas context
	 * player: Player - the player of the game
	 * score_sprites_map : Map(String -> Sprite) - Map containing score sprites ("0" -> 0 sprite, "1" -> 1 sprite...)
	 */
	draw_score(context, score_sprites_map){
		// clear prev score
		context.fillStyle = "black";
		for(var i = 0; i < SCORE_POS.length; i++){
			context.fillRect(SCORE_POS[i][0], SCORE_POS[i][1], (score_sprites_map.get("0")).width, (score_sprites_map.get("0")).height);
		}
		// split player score into array [0, 0, 0, 0]
		var split_score = this._score.toString(10).split("");
		for(var j = 0; j < split_score.length; j++){
			// draw players score
			var score_sprite = score_sprites_map.get(split_score[j]);
			score_sprite.draw(context, SCORE_POS[j]);
		}
	}

	/* Draws the players lives on the sidebar
	 * context: Context - the canvas context
	 * player: Player - the player of the game
	 */
	draw_lives(context){
		// clear prev lives
		context.fillStyle = "black";
		for(var i = 0; i < LIVES_POS.length; i++){
			context.fillRect(LIVES_POS[i][0], LIVES_POS[i][1], this._size, this._size);
		}
		// draw lives
		for(var j = 0; j < this._lives; j++){
			var lives_sprite = this._sprites.get("right").get("alive")[1];
			lives_sprite.draw(context, LIVES_POS[j]);
		}
	}

	update_pos(game_map){
		// calculate the tile positions the player is above
		var player_floor_tile_pos = [Math.floor(this._cur_coord[0]/this._size), Math.floor(this._cur_coord[1]/this._size)];
		var player_ceil_tile_pos = [Math.ceil(this._cur_coord[0]/this._size), Math.ceil(this._cur_coord[1]/this._size)];

		// retrieve the tiles beneath the player
		var player_floor_tile = game_map.get_map_tile(player_floor_tile_pos);
		var player_ceil_tile = game_map.get_map_tile(player_ceil_tile_pos);

		//check if at bridge
		if(this._cur_coord[0] > BRIDGE_RIGHT_POS[0]){
			this._cur_coord = BRIDGE_LEFT_POS;
			this._int_dir = "right";
			this._cur_dir = "right";
		}
		else if(this._cur_coord[0] < BRIDGE_LEFT_POS[0]){
			this._cur_coord = BRIDGE_RIGHT_POS;
			this._int_dir = "left";
			this._cur_dir = "left";
		}

		// check if player is perfectly on a tile
		else if((player_floor_tile_pos[0] == player_ceil_tile_pos[0]) && (player_floor_tile_pos[1] == player_ceil_tile_pos[1])){

			var left_tile = game_map.get_map_tile([player_floor_tile_pos[0]-1, player_floor_tile_pos[1]]);
			var right_tile = game_map.get_map_tile([player_ceil_tile_pos[0]+1, player_ceil_tile_pos[1]]);
			var up_tile = game_map.get_map_tile([player_floor_tile_pos[0], player_floor_tile_pos[1]-1]);
			var down_tile = game_map.get_map_tile([player_ceil_tile_pos[0], player_ceil_tile_pos[1]+1]);

			var valid_tiles = ["empty", "point_small", "point_big"];

			// check if player can move in intended direction
			if(((this._int_dir == "left") && (valid_tiles.includes(left_tile.type)))&&(this._is_moving)){
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
				// check if player can move in current direction, since cant in intended
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
				// player cant move
				else{
					//
				}
			}
		}
		// player NOT perfectly on tile (moving horizontally --> x diff y same)
		else if((player_floor_tile_pos[0] != player_ceil_tile_pos[0])&&(player_floor_tile_pos[1] == player_ceil_tile_pos[1])){
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
		// player NOT perfectly on tile (moving veritcally --> y diff x same)
		else if((player_floor_tile_pos[0] == player_ceil_tile_pos[0])&&(player_floor_tile_pos[1] != player_ceil_tile_pos[1])){
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
