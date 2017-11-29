// MENU CONSTANTS
const NUM_MENU_IMAGES = 2;
const MENU_IMAGE_FILES = ["main_screen.png", "selector.png"];
const MENU_SELECTOR_COORDS = [[79,145],[79,173]];


// SPRITE SHEET CONSTANTS
const NUM_SPRITE_SHEETS = 3;
const IMAGE_PATH = "../../images/";
const SPRITE_FILES = ["map_sprites.png", "player_sprites.png", "ghost_sprites.png"];


// CLASSES

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
	 
}

/* Representation of a Sprite
 * sprite_sheet: Image - image file for the sprite
 * coord: [int, int] - [x,y] top left corner of sprite on spritesheet
 */
class Sprite {
	constructor(sprite_sheet, coord, size){
		this.sprite_sheet = sprite_sheet;
		this.coord = coord;
		this.size = size;
	}
	get sprite_sheet(){
		return this._sprite_sheet;
	}
	set sprite_sheet(new_image){
		this._sprite_sheet = new_image;
	}
	get coord(){
		return this._coord;
	}
	set coord(new_coord){
		this._coord = new_coord;
	}
	get size(){
		return this._size;
	}
	set size(new_size){
		this._size = new_size;
	}
}

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
}

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
	constructor(is_alive, is_boosted, spawn_coord, cur_coord, lives, velocity, size, int_dir, cur_dir, is_moving, sprites, anim_frame, anim_timer, boosted_timer, hitbox, score){
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
		this.boosted_timer = boosted_timer;
		this.hitbox = hitbox;
		this.score = hitbox;
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
}

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
	constructor(colour, state, spawn_coord, cur_coord, velocity, size, int_dir, cur_dir, is_moving, dir_timer, sprites, anim_frame, anim_timer, hitbox){
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
		this.sprites = sprites;
		this.anim_frame = anim_frame;
		this.anim_timer = anim_timer;
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
	get hitbox(){
		return this._hitbox;
	}
	set hitbox(new_hitbox){
		this._hitbox = new_hitbox;
	}
}

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
	constructor(context, player, ghosts, level, state, big_points, game_map, sprite_sheets, menu_images){
		console.log("mi: " + menu_images);
		this.context = context;
		this.player = player;
		this.ghosts = ghosts;
		this.level = level;
		this.state = state; //menu, run, end (into screen, game in progress, end screen)
		this.big_points = big_points;
		this.game_map = game_map;
		this.sprite_sheets = sprite_sheets;
		this.menu_images = menu_images;
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

	load() {
		// draw intial start screen (aslong as state is "menu")
		if(this._state == "menu"){
			// draw menu screen
			this._context.drawImage(this._menu_images[0], 0, 0);
			// draw selector
			this._context.drawImage(this._menu_images[1], MENU_SELECTOR_COORDS[0][0], MENU_SELECTOR_COORDS[0][1]);
			// begin listening to keys and pass game as param to determine how to interpret key presses
			handle_key_press(this);
		}else{
			// this should not happen, error?
		}
	}
	run() {
		// draw background
		draw_map(this._context, this._game_map);
		// draw player
		draw_player(this._context, this._player, this._game_map);
		// draw ghosts
		for(var i = 0; i < this._ghosts.length; i++){
			draw_ghost(this._context, this._ghosts[i], this._game_map);
		}
		
	}
	end() {
		
	}


}
// FUNCTIONS BELOW


/* 
 * Waits for the page to be loaded before trying to start the game
 */
$(document).ready(function() { 
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	load_menu_images(context);
});

/* Loads the manu images, once loaded tries to load sprite images
 * context: Context - the canvas context
 */
function load_menu_images(context){
	var menu_images = [];
	var num_loaded = 0;

	for(var i = 0; i < NUM_MENU_IMAGES; i++){
        var img = new Image();
        menu_images.push(img);
        img.onload = function () {
            num_loaded++;
            if (num_loaded >= NUM_MENU_IMAGES) {
                load_sprite_sheets(context, menu_images)
            }
        }
        img.src = IMAGE_PATH + MENU_IMAGE_FILES[i];
    };
}

/* Loads the sprite images, and once they are loaded, starts the game
 * context: Context - the canvas context
 * menu_images: [Image, Image, ...] - array of images used for the menu screen
 */
function load_sprite_sheets(context, menu_images){

	var sprite_sheets = [];
    var num_loaded = 0;

    for(var i = 0; i < NUM_SPRITE_SHEETS; i++){
        var img = new Image();
        sprite_sheets.push(img);
        img.onload = function () {
            num_loaded++;
            if (num_loaded >= NUM_SPRITE_SHEETS) {
                setup_from_json(context, sprite_sheets, menu_images)
            }
        }
        img.src = IMAGE_PATH + SPRITE_FILES[i];
    };
}

/* creates the GameMap and begins the game
 * context: Context - the canvas context
 * sprite_sheets: [Image, Image, ...] - array of sprite sheet images
 * menu_images: [Image, Image, ...] - array of images used for the menu screen
 */
function setup_from_json(context, sprite_sheets, menu_images){

	// contains all map tile positions on map
	$.getJSON("./json/map.json", function(map_json){

		// create empty GameMap
		let game_map = new GameMap();
		// iterate through each map tile and store in game_map
		$.each(map_json.level_1.tiles, function(key, val){
			let sprite = new Sprite(sprite_sheets[0], val.sprite_pos, val.sprite_size);
			for(var i = 0; i < (val.tile_pos).length; i++){
				let tile = new MapTile(val.tile_pos[i], key, val.tile_size, sprite);
				game_map.set_map_tile(tile);
			}
		});

		// store paramaters being used to create player
		var player_params = [];
		//iterate through player default vals from json file and store in player_params
		$.each(map_json.level_1.entities.player, function(key, val){
			if(key == "sprites"){
				var sprites_map = new Map();
				$.each(val, function(dir, data){
					var state_map = new Map();
					$.each(data, function(state, sprite_array){
						var sprites = [];
						for(var j = 0; j < sprite_array.length; j++){
							// create new sprite and store in sprites array
							sprites.push(new Sprite(sprite_sheets[1], sprite_array[j], map_json.level_1.entities.player.size));
						}
						// store sprites array in corresponding state map
						state_map.set(state, sprites);
					});
					// store corresponding state map in sprites map
					sprites_map.set(dir, state_map);
				});
				// store sprites map in player params
				player_params.push(sprites_map);
			}
			else{
				player_params.push(val);
			}
			
		});
		// create player
		let user = new Player(player_params[0], player_params[1], player_params[2], player_params[3], player_params[4], player_params[5], player_params[6], player_params[7], player_params[8], player_params[9], player_params[10], player_params[11], player_params[12], player_params[13], player_params[14], player_params[15]);
		// store all ghosts
		var ghosts = [];
		//iterate through ghost default vals from json file and store in ghost_params
		$.each(map_json.level_1.entities.ghosts, function(colour, properties){
			// store paramaters being used to create ghost, starting with its colour
			var ghost_params = [colour];
			
			$.each(properties, function(key, val){
				if(key == "sprites"){
					var sprites_map = new Map();
					$.each(val, function(dir, data){
						var state_map = new Map();
						$.each(data, function(state, sprite_array){
							var sprites = [];
							for(var j = 0; j < sprite_array.length; j++){
								// create new sprite and store in sprites array
								sprites.push(new Sprite(sprite_sheets[2], sprite_array[j], map_json.level_1.entities.player.size));
							}
							// store sprites array in corresponding state map
							state_map.set(state, sprites);
						});
						// store corresponding state map in sprites map
						sprites_map.set(dir, state_map);
					});
					// store sprites map in player params
					ghost_params.push(sprites_map);
				}
				else{
					ghost_params.push(val);
				}
			});
			// create ghost and store in ghosts
			ghosts.push(new Ghost(ghost_params[0], ghost_params[1], ghost_params[2], ghost_params[3], ghost_params[4], ghost_params[5], ghost_params[6], ghost_params[7], ghost_params[8], ghost_params[9], ghost_params[10], ghost_params[11], ghost_params[12], ghost_params[13]));
		});

		// player and ghosts are now created
		console.log(ghosts);
		
		var big_points = [];
		let game = new Game(context, user, ghosts, 1, "menu", big_points, game_map, sprite_sheets, menu_images);
		
		game.load();
		//main(context, sprite_sheets, menu_images, game_map);
	});
}

/* Draws the map background (no entities such as player or ghosts)
 * context: Context - the canvas context
 * game_map: GameMap - the GameMap containing background tiles
 */
function draw_map(context, game_map){
	for(var y = 0; y <= game_map.max_y_tile; y++){
		for(var x = 0; x <= game_map.max_x_tile; x++){
			draw_tile(context, game_map.get_map_tile([x,y]));
		}
	}
}


/* Draws a tile on the canvas
 * context: Context - the canvas context
 * tile: MapTile - the tile to be drawn
 */
function draw_tile(context, tile){
	context.drawImage(tile.sprite.sprite_sheet, tile.sprite.coord[0], tile.sprite.coord[1], tile.sprite.size, tile.sprite.size, tile.coord[0]*tile.size, tile.coord[1]*tile.size, tile.size, tile.size);
}

/* Draws a Sprite on the canvas
 * context: Context - the canvas context
 * sprite: Sprite - the sprite to be drawn
 * pos: [int, int] - the top left [x,y] pos on the canvas for the sprite to be drawn 
 */
function draw_sprite(context, sprite, pos){
	context.drawImage(sprite.sprite_sheet, sprite.coord[0], sprite.coord[1], sprite.size, sprite.size, pos[0], pos[1], sprite.size, sprite.size);
	console.log(sprite.sprite_sheet);
}

/* Determines how to interpret key presses
 * game - the pacman Game
 */
function handle_key_press(game){

	console.log(game);
	// handle key presses
	$("body").keydown(function(event){

		var key_map = new Map();
		key_map.set(65, "left");
		key_map.set(68, "right");
		key_map.set(87, "up");
		key_map.set(83, "down");

		// 13 = enter

		if(game.state == "menu"){
			if(event.which == 83){
				// move selector down
				(game.context).drawImage(game.menu_images[0], 0, 0);
				(game.context).drawImage(game.menu_images[1], MENU_SELECTOR_COORDS[1][0], MENU_SELECTOR_COORDS[1][1]);
			}
			if(event.which == 87){
				// move selector up
				(game.context).drawImage(game.menu_images[0], 0, 0);
				(game.context).drawImage(game.menu_images[1], MENU_SELECTOR_COORDS[0][0], MENU_SELECTOR_COORDS[0][1]);
			}
			if(event.which == 13){
				game.state = "run";
				game.run();
			}
		}
		else if(game.state == "end"){

		}
		// in "run" state
		else{
			// check if player is alive to prevent death animation glitching
			if(game.player.is_alive){
				game.player.int_dir = key_map.get(event.which);
			}
		}
	});
}

/* Draws the player in their current animation on the canvas
 * context: Context - the canvas context
 * player: Player - the player being drawn
 * game_map: GameMap - the GameMap containing background tiles
 */
function draw_player(context, player, game_map){

	// calculate the tile positions the player is above
	var player_floor_tile = [Math.floor(player.cur_coord[0]/player.size), Math.floor(player.cur_coord[1]/player.size)];
	var player_ceil_tile = [Math.ceil(player.cur_coord[0]/player.size), Math.ceil(player.cur_coord[1]/player.size)];


	// retrieve the tiles beneath the player
	var floor_tile = game_map.get_map_tile(player_floor_tile);
	var ceil_tile = game_map.get_map_tile(player_ceil_tile);

	// check if player alive or not
	var player_state = "dead";
	if(player.is_alive){
		player_state = "alive";
	}

	// array containing current animations sprites
	var anim_sprites = player.sprites.get(player.cur_dir).get(player_state);

	// ready to update animation
	if(player.anim_frame >= player.anim_timer){
		player.anim_timer = 0;
		// check if at last frame
		if(player.anim_frame == (anim_sprites.length - 1)){
			player.anim_frame = 0;
		}
		else{
			player.anim_frame += 1;
		}
	}
	// not ready to update animation
	else{
		player.anim_timer += 1;
	}

	// draw tiles the player is above
	draw_tile(context, floor_tile);
	draw_tile(context, ceil_tile);
	// draw player
	draw_sprite(context, anim_sprites[player.anim_frame], player.cur_coord);
}

/* Draws the ghost in its current animation on the canvas
 * context: Context - the canvas context
 * ghost: Ghost - the Ghost being drawn
 * game_map: GameMap - the GameMap containing background tiles
 */
function draw_ghost(context, ghost, game_map){

	// calculate the tile positions the ghost is above
	var ghost_floor_tile = [Math.floor(ghost.cur_coord[0]/ghost.size), Math.floor(ghost.cur_coord[1]/ghost.size)];
	var ghost_ceil_tile = [Math.ceil(ghost.cur_coord[0]/ghost.size), Math.ceil(ghost.cur_coord[1]/ghost.size)];

	// retrieve the tiles beneath the ghost
	var floor_tile = game_map.get_map_tile(ghost_floor_tile);
	var ceil_tile = game_map.get_map_tile(ghost_ceil_tile);

	// array containing current animations sprites
	var anim_sprites = ghost.sprites.get(ghost.cur_dir).get(ghost.state);

	// ready to update animation
	if(ghost.anim_frame >= ghost.anim_timer){
		ghost.anim_frame = 0;
		// check if at last frame
		if(ghost.anim_frame == (anim_sprites.length-1)){
			ghost.anim_frame = 0;
		}
		else{
			ghost.anim_frame += 1;
		}
	}
	// not ready to update animation
	else{
		ghost.anim_timer += 1;
	}

	// draw tiles the ghost is above
	draw_tile(context, floor_tile);
	draw_tile(context, ceil_tile);
	// draw ghost
	draw_sprite(context, anim_sprites[ghost.anim_frame], ghost.cur_coord);
}

