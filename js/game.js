// READY CONSTANTS
const READY_TEXT_COORD = [121,241];
const READY_TEXT_WIDTH = 94;
const READY_TEXT_HEIGHT = 14

// SIDEBAR CONSTANTS
const SIDEBAR_POS = [337,0];

// POINTS
const SMALL_POINT_SCORE = 10;
const BIG_POINT_SCORE = 50;
const GHOST_SCORE = 200; // ghost_score ^ (num ghosts eaten) for multiple ghosts

const MENU_SELECTOR_COORDS = [[79,145],[79,173]];
const EMPTY_TILE_SPRITE_COORD = [153,0];

// BRIDGE
const BRIDGE_RIGHT_POS = [304,208];
const BRIDGE_LEFT_POS = [16,208];

/* Representation of a pacman Game
 * context: Context - the canvas context
 * player: Player - the player of the game
 * ghosts: [Ghost, Ghost, ...] - the ghosts of the level
 * level: int - the current level of the game
 * state: String - the state of the game ("menu", "run", "end")
 * big_points: [] - the big_points on the map
 * game_map:GameMap - the GameMap containing background tile information
 * sprite_sheets: [img, img, ...] - array of img files for the sprite sheets
 * menu_miages: [img, img, ...] - array of menu img files
 */
class Game {
	constructor(context, player, ghosts, level, state, big_points, game_map, sprite_sheets, menu_images, score_sprites_map){
		this.context = context;
		this.player = player;
		this.ghosts = ghosts;
		this.level = level;
		this.state = state; //menu, run, end (into screen, game in progress, end screen)
		this.big_points = big_points;
		this.game_map = game_map;
		this.sprite_sheets = sprite_sheets;
		this.menu_images = menu_images;
		this.score_sprites_map = score_sprites_map;
	}
	get context(){
		return this._context;
	}
	set context(new_context){
		this._context = new_context;
	}
	get player(){
		return this._player;
	}
	set player(new_player){
		this._player = new_player;
	}
	get ghosts(){
		return this._ghosts;
	}
	set ghosts(new_ghosts){
		this._ghosts = new_ghosts;
	}
	get level(){
		return this._level;
	}
	set level(new_level){
		this._level = new_level;
	}
	get state(){
		return this._state;
	}
	set state(new_state){
		this._state = new_state;
	}
	get big_points(){
		return this._big_points;
	}
	set big_points(new_big_points){
		this._big_points = new_big_points;
	}
	get game_map(){
		return this._game_map;
	}
	set game_map(new_game_map){
		this._game_map = new_game_map;
	}
	get sprite_sheets(){
		return this._sprite_sheets;
	}
	set sprite_sheets(new_sprite_sheets){
		this._sprite_sheets = new_sprite_sheets;
	}
	get menu_images(){
		return this._menu_images;
	}
	set menu_images(new_menu_images){
		this._menu_images = new_menu_images;
	}
	get score_sprites_map(){
		return this._score_sprites_map;
	}
	set score_sprites_map(new_score_sprites_map){
		this._score_sprites_map = new_score_sprites_map;
	}

	load() {
		// draw intial start screen (aslong as state is "menu")
		if(this._state == "menu"){
			// draw menu screen
			this._context.drawImage(this._menu_images[0], 0, 0);
			// draw selector
			this._context.drawImage(this._menu_images[1], MENU_SELECTOR_COORDS[0][0], MENU_SELECTOR_COORDS[0][1]);
			// draw line dividing game and side bar
			this._context.fillStyle = "grey";
			this._context.fillRect(336,0,1,432);
			// draw sidebar
			this._context.drawImage(this._menu_images[2], SIDEBAR_POS[0], SIDEBAR_POS[1]);
			// draw score
			this._player.draw_score(this._context, this._score_sprites_map);
			// draw lives
			this._player.draw_lives(this._context);
		}
		else{
			// this should not happen, error?
		}
	}
	ready() {
		// draw background
		this._game_map.draw(this._context);
		// draw entities
		this.draw_entities();
		// draw READY! text
		this._context.drawImage(this._menu_images[3], READY_TEXT_COORD[0], READY_TEXT_COORD[1]);
	}
	run() {
		// clear READY! text
		this._context.fillStyle = "black";
		this._context.fillRect(READY_TEXT_COORD[0], READY_TEXT_COORD[1], 94, 14);
		// set player to moving
		this._player.is_moving = true;
		// set ghosts to moving
		for(var i = 0; i < this._ghosts.length; i++){
			this._ghosts[i].is_moving = true;
		}
		// begin game "clock"
		this.animate();
	}
	animate(){
		if(this._player.lives <= 0){
			this.end();
		}
		else{
			// check if player is on a point
			this.check_for_point();
			// update points
			this._player.draw_score(this._context, this._score_sprites_map);
			// check for collision with ghosts
			this.check_for_ghosts();
			// check if boosted and update accordingly
			this.check_boosted_state();
			// update player position
			this._player.update_pos(this._game_map);
			// update ghost positions
			for(var i = 0; i < this._ghosts.length; i ++){
				this._ghosts[i].update_pos(this._game_map);
			}
			// draw entities
			this.draw_entities();
			// Need to use => to preserve 'this'
			window.requestAnimationFrame(() => this.animate());
		}
	}
	end() {
	}


	/* Draws the player and ghosts on the canvas
	 * context: Context - the canvas context
	 * player: Player - the player of the game
	 * ghosts: [Ghost, Ghost, ..] - the Ghosts of the level
	 * game_map: GameMap - the GameMap containing background tile information
	 */
	draw_entities(){
		// draw tiles behind player and ghosts
		this.draw_background_tiles();
		// draw player in their current animation frame
		this._player.draw(this._context);
		
		// draw ghosts in their current animation frame
		for(var i = 0; i < this._ghosts.length; i ++){
			this._ghosts[i].draw(this._context);
		}
	}

	/* Draws the tiles beneath the player and ghosts positions
	 */
	draw_background_tiles(){

		// calculate the tile positions the player is above
		var player_floor_tile_pos = [Math.floor(this._player.cur_coord[0]/this._player.size), Math.floor(this._player.cur_coord[1]/this._player.size)];
		var player_ceil_tile_pos = [Math.ceil(this._player.cur_coord[0]/this._player.size), Math.ceil(this._player.cur_coord[1]/this._player.size)];

		// retrieve the tiles beneath the player
		var player_floor_tile = this._game_map.get_map_tile(player_floor_tile_pos);
		var player_ceil_tile = this._game_map.get_map_tile(player_ceil_tile_pos);

		// draw tiles beneath the player
		player_floor_tile.draw(this._context);
		player_ceil_tile.draw(this._context);

		for(var i = 0 ; i < this._ghosts.length; i++){

			// calculate the tile positions the ghost is above
			var ghost_floor_tile_pos = [Math.floor(this._ghosts[i].cur_coord[0]/this._ghosts[i].size), Math.floor(this._ghosts[i].cur_coord[1]/this._ghosts[i].size)];
			var ghost_ceil_tile_pos = [Math.ceil(this._ghosts[i].cur_coord[0]/this._ghosts[i].size), Math.ceil(this._ghosts[i].cur_coord[1]/this._ghosts[i].size)];

			// retrieve the tiles beneath the ghost
			var ghost_floor_tile = this._game_map.get_map_tile(ghost_floor_tile_pos);
			var ghost_ceil_tile = this._game_map.get_map_tile(ghost_ceil_tile_pos);

			// draw tiles beneath the ghost
			ghost_floor_tile.draw(this._context);
			ghost_ceil_tile.draw(this._context);
		}
	}

	/* checks to see if the player is ontop of a point, and updates their score accordingly
	 */
	check_for_point(){

		// calculate the tile positions the player is above
		var player_floor_tile_pos = [Math.floor(this._player.cur_coord[0]/this._player.size), Math.floor(this._player.cur_coord[1]/this._player.size)];
		var player_ceil_tile_pos = [Math.ceil(this._player.cur_coord[0]/this._player.size), Math.ceil(this._player.cur_coord[1]/this._player.size)];

		// retrieve the tiles beneath the player
		var player_floor_tile = this._game_map.get_map_tile(player_floor_tile_pos);
		var player_ceil_tile = this._game_map.get_map_tile(player_ceil_tile_pos);

		// check if floor tile is a small point
		if(player_floor_tile.type == "point_small"){

			// check distance the player center is from tile center
			var point_small_pos = [(player_floor_tile.coord[0]*player_floor_tile.size)+(player_floor_tile.size/2), (player_floor_tile.coord[1]*player_floor_tile.size)+(player_floor_tile.size/2)];
			var player_mid_pos = [this._player.cur_coord[0]+this._player.size/2, this._player.cur_coord[1] + this._player.size/2];

			// get distance
			var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

			if(dist <= this._player.hitbox){
				// change map tile to empty 
				let empty_sprite = new Sprite(this._sprite_sheets[0], EMPTY_TILE_SPRITE_COORD, player_floor_tile.size, player_floor_tile.size);
				let new_tile = new MapTile(player_floor_tile.coord, "empty", player_floor_tile.size, empty_sprite);
				this._game_map.set_map_tile(new_tile);
				// update player score
				this._player.score += SMALL_POINT_SCORE;
			}
		}
		// check if ceil tile is a small point
		else if(player_ceil_tile.type == "point_small"){

			// check distance the player center is from tile center
			var point_small_pos = [(player_ceil_tile.coord[0]*player_ceil_tile.size)+(player_ceil_tile.size/2), (player_ceil_tile.coord[1]*player_ceil_tile.size)+(player_ceil_tile.size/2)];
			var player_mid_pos = [this._player.cur_coord[0]+this._player.size/2, this._player.cur_coord[1] + this._player.size/2];

			// get distance
			var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

			if(dist <= this._player.hitbox){
				// change map tile to empty 
				let empty_sprite = new Sprite(this._sprite_sheets[0], EMPTY_TILE_SPRITE_COORD, player_ceil_tile.size, player_ceil_tile.size);
				let new_tile = new MapTile(player_ceil_tile.coord, "empty", player_ceil_tile.size, empty_sprite);
				this._game_map.set_map_tile(new_tile);
				// update player score
				this._player.score += SMALL_POINT_SCORE;
			}
		}
		// check if floor tile is a big point
		else if(player_floor_tile.type == "point_big"){

			// check distance the player center is from tile center
			var point_small_pos = [(player_floor_tile.coord[0]*player_floor_tile.size)+(player_floor_tile.size/2), (player_floor_tile.coord[1]*player_floor_tile.size)+(player_floor_tile.size/2)];
			var player_mid_pos = [this._player.cur_coord[0]+this._player.size/2, this._player.cur_coord[1] + this._player.size/2];

			// get distance
			var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

			if(dist <= this._player.hitbox){
				// change map tile to empty 
				let empty_sprite = new Sprite(this._sprite_sheets[0], EMPTY_TILE_SPRITE_COORD, player_floor_tile.size, player_floor_tile.size);
				let new_tile = new MapTile(player_floor_tile.coord, "empty", player_floor_tile.size, empty_sprite);
				this._game_map.set_map_tile(new_tile);
				// update player score
				this._player.score += BIG_POINT_SCORE;
				// set player boosted and ghosts to edible
				this._player.is_boosted = true;
				for(var i = 0; i < this._ghosts.length; i++){
					if(this._ghosts[i].state == "alive"){
						this._ghosts[i].state = "edible";
					}
				}
			}
		}
		// check if ceil tile is a big point
		else if(player_ceil_tile.type == "point_big"){

			// check distance the player center is from tile center
			var point_small_pos = [(player_ceil_tile.coord[0]*player_ceil_tile.size)+(player_ceil_tile.size/2), (player_ceil_tile.coord[1]*player_ceil_tile.size)+(player_ceil_tile.size/2)];
			var player_mid_pos = [this._player.cur_coord[0]+this._player.size/2, this._player.cur_coord[1] + this._player.size/2];

			// get distance
			var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

			if(dist <= this._player.hitbox){
				// change map tile to empty 
				let empty_sprite = new Sprite(this._sprite_sheets[0], EMPTY_TILE_SPRITE_COORD, player_ceil_tile.size, player_ceil_tile.size);
				let new_tile = new MapTile(player_ceil_tile.coord, "empty", player_ceil_tile.size, empty_sprite);
				this._game_map.set_map_tile(new_tile);
				// update player score
				this._player.score += BIG_POINT_SCORE;
				// set player boosted and ghosts to edible
				this._player.is_boosted = true;
				for(var i = 0; i < this._ghosts.length; i++){
					if(this._ghosts[i].state == "alive"){
						this._ghosts[i].state = "edible";
					}
				}
			}
		}
	}

	check_for_ghosts(){

		// calculate the tile positions the player is above
		var player_floor_tile_pos = [Math.floor(this._player.cur_coord[0]/this._player.size), Math.floor(this._player.cur_coord[1]/this._player.size)];
		var player_ceil_tile_pos = [Math.ceil(this._player.cur_coord[0]/this._player.size), Math.ceil(this._player.cur_coord[1]/this._player.size)];

		// retrieve the tiles beneath the player
		var player_floor_tile = this._game_map.get_map_tile(player_floor_tile_pos);
		var player_ceil_tile = this._game_map.get_map_tile(player_ceil_tile_pos);

		// player mid position
		var player_mid_pos = [this._player.cur_coord[0]+this._player.size/2, this._player.cur_coord[1] + this._player.size/2];

		for(var i = 0; i < this._ghosts.length; i++){

			// calculate the tile positions the player is above
			var ghost_floor_tile_pos = [Math.floor(this._ghosts[i].cur_coord[0]/this._ghosts[i].size), Math.floor(this._ghosts[i].cur_coord[1]/this._ghosts[i].size)];
			var ghost_ceil_tile_pos = [Math.ceil(this._ghosts[i].cur_coord[0]/this._ghosts[i].size), Math.ceil(this._ghosts[i].cur_coord[1]/this._ghosts[i].size)];

			// retrieve the tiles beneath the player
			var ghost_floor_tile = this._game_map.get_map_tile(ghost_floor_tile_pos);
			var ghost_ceil_tile = this._game_map.get_map_tile(ghost_ceil_tile_pos);

			// ghost mid position
			var ghost_mid_pos = [this._ghosts[i].cur_coord[0]+this._ghosts[i].size/2, this._ghosts[i].cur_coord[1] + this._ghosts[i].size/2];

			// get distance
			var dist = Math.sqrt(Math.pow((player_mid_pos[0] - ghost_mid_pos[0]),2) + Math.pow((player_mid_pos[1] - ghost_mid_pos[1]),2));

			// player collided with ghost
			if(dist <= this._player.hitbox){
				// check if player is boosted and can eat ghost
				if(this._player.is_boosted){
					// check if ghost is edible
					if((this._ghosts[i].state == "edible")||(this._ghosts[i].state == "edible_flashing")){
						this._ghosts[i].state = "dead";
						this._player.streak += 1;
						this._player.score += (Math.pow(2, this._player.streak)*100);
					}
				}
				// check if ghost is alive
				else if((this._player.is_alive) && (this._ghosts[i].state == "alive")){
					this._player.lives -= 1;
					// update lives on sidebar
					this._player.draw_lives(this._context);
					this._player.is_alive = false;
					this._player.is_moving = false;
				}
			}
		}
	}

	check_boosted_state(){
		if(this._player.is_boosted){
			// check if time to stop being boosted
			if(this._player.boosted_timer >= this._player.boosted_update){
				// stop being boosted, set ghosts to normal
				this._player.boosted_timer = 0;
				this._player.is_boosted = false;
				this._player.streak = 0;
				for(var i = 0; i < this._ghosts.length; i++){
					if(this._ghosts[i].state == "edible_flashing"){
						this._ghosts[i].state = "alive";
					}
				}
			}
			// ghosts become flashing after 2/3 of the timer is up
			else if(this._player.boosted_timer >= ((this._player.boosted_update)*(2/3))){
				// set ghosts to flashing
				for(var j = 0; j < this._ghosts.length; j++){
					if(this._ghosts[j].state == "edible"){
						this._ghosts[j].state = "edible_flashing";
					}
				}
				this._player.boosted_timer += 1;
			}
			else{
				this._player.boosted_timer += 1;
			}
		}
	}
}