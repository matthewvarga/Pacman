// GAME CONSTANTS
const TILE_SIZE = 16;
const PLAYER_ANIM_FRAME_UPDATE = 6;
const GHOST_ANIM_FRAME_UPDATE = 12;
const HITBOX = 3;
// SPRITE SHEET CONSTANTS
const NUM_SPRITE_SHEETS = 3;
const IMAGE_PATH = "../../images/";
const SPRITE_FILES = ["map_sprites.png", "player_sprites.png", "ghost_sprites.png"];

/* Waits for the page to be loaded before trying to start the game
 */
$(document).ready(function() { 
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	load_sprites(context);
});

/* Loads the sprite images, and once they are loaded, starts the game
 * context - the canvas context
 */
function load_sprites(context){

	var sprite_sheets = [];
    var num_loaded = 0;

    for(var i = 0; i < NUM_SPRITE_SHEETS; i++){
        var img = new Image();
        sprite_sheets.push(img);
        img.onload = function () {
            num_loaded++;
            if (num_loaded >= NUM_SPRITE_SHEETS) {
                draw_background(context, sprite_sheets)
            }
        }
        img.src = IMAGE_PATH + SPRITE_FILES[i];
    };
}

/* Draws the background tiles from map.json with their corresponding sprite
 * context - the canvas context
 * sprite_sheets - array containing all loaded sprite sheet images
 */
function draw_background(context, sprite_sheets){
	// contains tile positions on map
	$.getJSON("./json/map.json", function(map_json){
		// map representation of the games map
		var game_map = new Map();

		// iterate through each map tile in map.json
		$.each(map_json.level_1, function(key, val){

			// contains sprite positions of map tiles on tilesheet
			$.getJSON("./json/sprite.json", function(sprite_json){

				// iterate through the positions of each map tile, and draw their sprite in their location
				for(var i = 0; i < (val.pos).length; i++){
					context.drawImage(sprite_sheets[0], (sprite_json.tiles.map)[String(key)].pos[0], (sprite_json.tiles.map)[String(key)].pos[1], (sprite_json.tiles.map)[String(key)].size, (sprite_json.tiles.map)[String(key)].size, val.pos[i][0]*val.size, val.pos[i][1]*val.size, val.size, val.size);
				}
			});

			// iterate through the position of each map tile, and store in game map
			for(var i = 0; i < (val.pos).length; i++){
				var map_key = val.pos[i][0] + "," + val.pos[i][1];
				var map_value = String(key);
				game_map.set(map_key, map_value);
			}

		});

		load_entities(context, sprite_sheets, game_map);
	});
}

/* Loads the entities into the game games map from entities.json
 * context - the canvas context
 * sprite_sheets - array containing all loaded sprite sheet images
 * game_map - map representation of the game  -> key: "i,j" tile position, val: ["map_tile"]
 */
function load_entities(context, sprite_sheets, game_map){

	// contains ghosts and player starting values
	$.getJSON("./json/entities.json", function(entity_json){

		var ghosts = [];
		// iterate through each ghost in entities.json and store in array
		$.each(entity_json.level_1.ghosts, function(key, val){
			// state = [normal, edible, edible flashing, dead]
			ghosts.push(
				{colour: key,
				spawn_tile: val.pos,
				size: val.size,
				state: [1, 0, 0, 0], 
				velocity: val.velocity, 
				direction: "up", 
				intended_direction: "up",
				exact_pos: [val.pos[0]*TILE_SIZE, val.pos[1]*TILE_SIZE],
				anim_frame: 0,
				counter: 0
			});
		});

		// create player object
		var player = {
			spawn_tile: entity_json.level_1.player.pos,
			lives: entity_json.level_1.player.lives,
			velocity: entity_json.level_1.player.velocity,
			size: entity_json.level_1.player.size,
			direction: "",
			intended_direction: "",
			exact_pos: [entity_json.level_1.player.pos[0]*TILE_SIZE, entity_json.level_1.player.pos[1]*TILE_SIZE],
			is_alive: true,
			anim_frame: 0,
			counter: 0,
			score: 0,
			invincible: false
		}

		run_game(context, sprite_sheets, game_map, player, ghosts);
	});

}

/* Begins the game after all map data is loaded and the player has moved pacman
 * context - the canvas context
 * sprite_sheets - array containing all loaded sprite sheet images
 * game_map - map representation of the game -> key: "i,j" tile position, val: ["map_tile"]
 * player - object representation fo player
 * ghosts - array of object representations of each ghost
 */
function run_game(context, sprite_sheets, game_map, player, ghosts){
	
	// flag indicating if the game has started yet (if the player has moved pacman)
	var has_started = false;
	

	// handle key presses
	$("body").keydown(function(event){

		var key_map = new Map();
		key_map.set(65, "left");
		key_map.set(68, "right");
		key_map.set(87, "up");
		key_map.set(83, "down");

		if(key_map.has(event.which)){
			if(has_started == false){
				has_started = true;
				player.direction = key_map.get(event.which);
			}
			else{
				// prevent players from being able to move while dead
				if(player.is_alive){
					player.intended_direction = key_map.get(event.which);
				}
			}
		}

	});
	var game_clock = setInterval(function(){

		// flag indicating if the game is over or not
		var game_over = (player.lives == 0);

		if(has_started){
			// check if game over (player has no lives left)
			if(game_over){
				// stop cycling
				clearInterval(game_clock);
			}
			else{
				// calculate the tiles the player is above
				var player_floor_tile = [Math.floor(player.exact_pos[0]/16), Math.floor(player.exact_pos[1]/16)];
				var player_ceil_tile = [Math.ceil(player.exact_pos[0]/16), Math.ceil(player.exact_pos[1]/16)];
				// draw player
				draw_player(context, sprite_sheets, game_map, player, ghosts, player_floor_tile, player_ceil_tile);
				// draw ghosts ** TODO
				draw_ghosts(context, sprite_sheets, game_map, player, ghosts)
				// check if player on a point
				check_for_point(game_map, player, player_floor_tile, player_ceil_tile);
				// check if player on a ghost
				check_for_ghost(player, ghosts);
				// update position
				update_player_position(player, game_map, player_floor_tile, player_ceil_tile);
				// update ghosts positions ** TODO
			}
		}
			
	}, 16);
	
}

/* Draws the player in their current animation frame
 * context - the canvas context
 * sprite_sheets - array containing all loaded sprite sheet images
 * game_map - map representation of the game -> key: "i,j" tile position val: ["map_tile"]
 * player - object representation of player
 * ghosts - array of object representations of each ghost
 * floor_tile - [x,y] tile closest to origin that player is above
 * ceil_tile - [x,y] tile furthest from origin that player is above
 */
function draw_player(context, sprite_sheets, game_map, player, ghosts, floor_tile, ceil_tile){

	// contains positions of player sprites on spritesheet
	$.getJSON("./json/sprite.json", function(sprite_json){

		// retrieve type of tile beneath player
		var floor_tile_type = game_map.get(floor_tile[0] + "," + floor_tile[1]);
		var ceil_tile_type = game_map.get(ceil_tile[0] + "," + ceil_tile[1]);

		// if player is in alive animation
		if(player.is_alive){
			// get animation frames
			var animation_frames = sprite_json.tiles.player[String(player.direction)].alive;
		}
		else{
			var animation_frames = sprite_json.tiles.player[String(player.direction)].dead;
		}

		if(player.counter >= PLAYER_ANIM_FRAME_UPDATE){
			player.counter = 0;
			// check if at last frame
			if(player.anim_frame == (animation_frames.length - 1)){
				player.anim_frame = 0;
			}
			else{
				player.anim_frame += 1;
			}
			
		}
		else{
			player.counter += 1;
		}
		// draw the tiles the player is above (floor_tile and ceil_tile)
		context.drawImage(sprite_sheets[0], sprite_json.tiles.map[String(floor_tile_type)].pos[0], sprite_json.tiles.map[String(floor_tile_type)].pos[1], sprite_json.tiles.map[String(floor_tile_type)].size, sprite_json.tiles.map[String(floor_tile_type)].size, floor_tile[0]*TILE_SIZE, floor_tile[1]*TILE_SIZE, TILE_SIZE, TILE_SIZE);
		context.drawImage(sprite_sheets[0], sprite_json.tiles.map[String(ceil_tile_type)].pos[0], sprite_json.tiles.map[String(ceil_tile_type)].pos[1], sprite_json.tiles.map[String(ceil_tile_type)].size, sprite_json.tiles.map[String(ceil_tile_type)].size, ceil_tile[0]*TILE_SIZE, ceil_tile[1]*TILE_SIZE, TILE_SIZE, TILE_SIZE);
		// draw the player
		context.drawImage(sprite_sheets[1], animation_frames[player.anim_frame][0], animation_frames[player.anim_frame][1], sprite_json.tiles.player[String(player.direction)].size, sprite_json.tiles.player[String(player.direction)].size, player.exact_pos[0], player.exact_pos[1], player.size, player.size);
	});
}

/* Draws the ghosts in their current animation frame
 * context - the canvas context
 * sprite_sheets - array containing all loaded sprite sheet images
 * game_map - map representation of the game -> key: "i,j" tile position val: ["map_tile"]
 * player - object representation of player
 * ghosts - array of object representations of each ghost
 */
function draw_ghosts(context, sprite_sheets, game_map, player, ghosts){

	// contains positions of ghsot sprites on spritesheet
	$.getJSON("./json/sprite.json", function(sprite_json){

		// cycle through each ghost
		for(var i = 0; i < ghosts.length; i++){

			// calculate the tiles the ghost is above
			var floor_tile = [Math.floor(ghosts[i].exact_pos[0]/16), Math.floor(ghosts[i].exact_pos[1]/16)];
			var ceil_tile = [Math.ceil(ghosts[i].exact_pos[0]/16), Math.ceil(ghosts[i].exact_pos[1]/16)];

			// retrieve type of tile beneath ghost
			var floor_tile_type = game_map.get(floor_tile[0] + "," + floor_tile[1]);
			var ceil_tile_type = game_map.get(ceil_tile[0] + "," + ceil_tile[1]);

			// array to store animation frames location on sprite sheet
			var animation_frames;
			// speed at which animation is played (default 1)
			var animation_speed = 1;

			// check which state the ghost is in to retrieve the animation frames
			if(ghosts[i].state[0] == 1){
				animation_frames = sprite_json.tiles.ghosts[String(ghosts[i].colour)][String(ghosts[i].direction)].alive;
			}
			else if(ghosts[i].state[1] == 1){
				animation_frames = sprite_json.tiles.ghosts.edible;
			}
			else if(ghosts[i].state[2] == 1){
				animation_frames = sprite_json.tiles.ghosts.edible_flashing;
				animation_speed = 1.5;
			}
			else{
				animation_frames = sprite_json.tiles.ghosts[String(ghosts[i].colour)][String(ghosts[i].direction)].dead;
			}
			// check if on animation cycle
			if(ghosts[i].counter >= GHOST_ANIM_FRAME_UPDATE){
				ghosts[i].counter = 0;
				// check if at last frame
				if(ghosts[i].anim_frame == (animation_frames.length - 1)){
					ghosts[i].anim_frame = 0;
				}
				else{
					ghosts[i].anim_frame += 1;
				}
			}
			else{
				ghosts[i].counter += animation_speed;
			}
			// draw the tiles the ghost is above (floor_tile and ceil_tile)
			context.drawImage(sprite_sheets[0], sprite_json.tiles.map[String(floor_tile_type)].pos[0], sprite_json.tiles.map[String(floor_tile_type)].pos[1], sprite_json.tiles.map[String(floor_tile_type)].size, sprite_json.tiles.map[String(floor_tile_type)].size, floor_tile[0]*TILE_SIZE, floor_tile[1]*TILE_SIZE, TILE_SIZE, TILE_SIZE);
			context.drawImage(sprite_sheets[0], sprite_json.tiles.map[String(ceil_tile_type)].pos[0], sprite_json.tiles.map[String(ceil_tile_type)].pos[1], sprite_json.tiles.map[String(ceil_tile_type)].size, sprite_json.tiles.map[String(ceil_tile_type)].size, ceil_tile[0]*TILE_SIZE, ceil_tile[1]*TILE_SIZE, TILE_SIZE, TILE_SIZE);
			// draw the ghost
			context.drawImage(sprite_sheets[2], animation_frames[ghosts[i].anim_frame][0], animation_frames[ghosts[i].anim_frame][1], sprite_json.tiles.ghosts.size, sprite_json.tiles.ghosts.size, ghosts[i].exact_pos[0], ghosts[i].exact_pos[1], ghosts[i].size, ghosts[i].size);
		}
	});
}

/* Check if the player is within 5 pixels of a point, and if so, rewards the player with an increase in score
 * and removes the point. 
 * game_map - map representation of the game -> key: "i,j" tile position val: ["map_tile"]
 * player - object represenetation of player
 * floor_tile - [x,y] tile closest to origin that player is above
 * ceil_tile - [x,y] tile furthest from origin that player is above
 */
function check_for_point(game_map, player, floor_tile, ceil_tile){
	// check if floor tile is a small point
	if(game_map.get(floor_tile[0] + "," + floor_tile[1]) == "point_small"){
		// check distance the player center is from tile center
		var point_small_pos = [(floor_tile[0]*TILE_SIZE)+(TILE_SIZE/2), (floor_tile[1]*TILE_SIZE)+(TILE_SIZE/2)];
		var player_mid_pos = [player.exact_pos[0]+TILE_SIZE/2, player.exact_pos[1] + TILE_SIZE/2];
		// distance = root([x2-x1]^2 + [y2-y1]^2)
		var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

		if(dist <= HITBOX){
			// change to empty tile
			game_map.set((floor_tile[0] + "," + floor_tile[1]), "empty");
			// update player score
			player.score += 1;

		}
	}
	// check if ceil tile is a small point
	if(game_map.get(ceil_tile[0] + "," + ceil_tile[1]) == "point_small"){
		// check distance the player center is from tile center
		var point_small_pos = [(ceil_tile[0]*TILE_SIZE)+(TILE_SIZE/2), (ceil_tile[1]*TILE_SIZE)+(TILE_SIZE/2)];
		var player_mid_pos = [player.exact_pos[0]+TILE_SIZE/2, player.exact_pos[1] + TILE_SIZE/2];
		// distance = root([x2-x1]^2 + [y2-y1]^2)
		var dist = Math.sqrt(Math.pow((player_mid_pos[0] - point_small_pos[0]),2) + Math.pow((player_mid_pos[1] - point_small_pos[1]),2));

		if(dist <= HITBOX){
			// change to empty tile
			game_map.set((ceil_tile[0] + "," + ceil_tile[1]), "empty");
			// update player score
			player.score += 1;

		}
	}
	// check if on big point for invincibility
}

/* Finds the distance between the player and all ghosts, checking for collision
 * player - object representation of player
 * ghosts - array of object representations of each ghost
 */
function check_for_ghost(player, ghosts){

	for(var i = 0; i < ghosts.length; i++){
		var ghost_mid_pos = [ghosts[i].exact_pos[0]+TILE_SIZE/2, ghosts[i].exact_pos[1] + TILE_SIZE/2];
		var player_mid_pos = [player.exact_pos[0]+TILE_SIZE/2, player.exact_pos[1] + TILE_SIZE/2];

		var dist = Math.sqrt(Math.pow((player_mid_pos[0] - ghost_mid_pos[0]),2) + Math.pow((player_mid_pos[1] - ghost_mid_pos[1]),2));

		if(dist <= HITBOX){
			alert("on ghost");
			// check if invincible **CHANGE TO CHECK IF FLASHING OR NOT TO AWARD POINTS
			if(player.invincible){
				ghost.state = [0, 0, 0, 1] // normal, edible, edible_flashing, dead
			}
			else{
				player.is_alive = false;
				player.counter = 0;
				player.anim_frame = 0;
			}
		}
	}
}

/* Checks if player can move in intended direction, if so moves them and updates direction.
 * If not, checks if they can move in current direction, and mvoes them if so.
 * player - object representation of player
 * game_map - map representation of the game -> key: "i,j" tile position val: ["map_tile"]
 * floor_tile - [x,y] tile closest to origin that player is above
 * ceil_tile - [x,y] tile furthest from origin that player is above
 */
function update_player_position(player, game_map, floor_tile, ceil_tile){
	// if perfectly on a tile
	if((floor_tile[0] == ceil_tile[0])&&(floor_tile[1] == ceil_tile[1])){

		// check if it is either of the two edge paths
		if((floor_tile[0] == 0)&&(floor_tile[1] == 13)){
			if(player.direction == "left"){
				player.exact_pos = [20*TILE_SIZE, 13*TILE_SIZE];
			}
			else{
				player.direction = "right";
				player.exact_pos[0] += player.velocity;
			}
		}
		else if((ceil_tile[0] == 20)&&(ceil_tile[1] == 13)){
			if(player.direction == "right"){
				player.exact_pos = [0*TILE_SIZE, 13*TILE_SIZE];
			}
			else{
				player.direction = "left";
				player.exact_pos[0] -= player.velocity;
			}
		}

		// check if the intended direction is possible, and if so set as new direction

		var left_tile = game_map.get((floor_tile[0] - 1) + "," + floor_tile[1]);
		var right_tile = game_map.get((ceil_tile[0]+1) + "," + ceil_tile[1]);
		var up_tile = game_map.get(floor_tile[0] + "," + (floor_tile[1] - 1));
		var down_tile = game_map.get(ceil_tile[0] + "," + (ceil_tile[1] + 1));


		if((player.intended_direction == "left") && ((left_tile == "empty") || ((left_tile == "point_small") || (left_tile == "point_big")))){
			player.direction = "left";
			player.exact_pos[0] -= player.velocity;
		}
		else if((player.intended_direction == "right") && ((right_tile == "empty") || ((right_tile == "point_small") || (right_tile == "point_big")))){
			player.direction = "right";
			player.exact_pos[0] += player.velocity;
		}
		else if((player.intended_direction == "up") && ((up_tile == "empty") || ((up_tile == "point_small") || (up_tile == "point_big")))){
			player.direction = "up";
			player.exact_pos[1] -= player.velocity;
		}
		else if((player.intended_direction == "down") && ((down_tile == "empty") || ((down_tile == "point_small") || (down_tile == "point_big")))){
			player.direction = "down";
			player.exact_pos[1] += player.velocity;
		}

		// update player position when intended direction is not viable
		else{
			if(player.direction == "left"){
				if((left_tile == "empty") || ((left_tile == "point_small") || (left_tile == "point_big"))){
					player.exact_pos[0] -= player.velocity;
				}
			}
			else if(player.direction == "right"){
				if((right_tile == "empty") || ((right_tile == "point_small") || (right_tile == "point_big"))){
					player.exact_pos[0] += player.velocity;
				}
			}
			else if(player.direction == "up"){
				if((up_tile == "empty") || ((up_tile == "point_small") || (up_tile == "point_big"))){
					player.exact_pos[1] -= player.velocity;
				}
			}
			else if(player.direction == "down"){
				if((down_tile == "empty") || ((down_tile == "point_small") || (down_tile == "point_big"))){
					player.exact_pos[1] += player.velocity;
				}
			}
		}
		
	}
	// y vals are same, but x are diff
	else if((floor_tile[0] != ceil_tile[0])&&(floor_tile[1] == ceil_tile[1])){
		if(player.intended_direction == "left"){
			player.direction = "left";
			player.exact_pos[0] -= player.velocity;
		}
		else if(player.intended_direction == "right"){
			player.direction = "right";
			player.exact_pos[0] += player.velocity;
		}
		else{
			if(player.direction == "left"){
				player.exact_pos[0] -= player.velocity;
			}
			else if(player.direction == "right"){
				player.exact_pos[0] += player.velocity;
			}
		}
	}
	// x vals are same, but y vals are diff
	else if((floor_tile[0] == ceil_tile[0])&&(floor_tile[1] != ceil_tile[1])){
		if(player.intended_direction == "up"){
			player.direction = "up";
			player.exact_pos[1] -= player.velocity;
		}
		else if(player.intended_direction == "down"){
			player.direction = "down";
			player.exact_pos[1] += player.velocity;
		}
		else{
			if(player.direction == "up"){
				player.exact_pos[1] -= player.velocity;
			}
			else if(player.direction == "down"){
				player.exact_pos[1] += player.velocity;
			}
		}
	}
}