const IMAGE_PATH = "../../images/";

// MENU CONSTANTS
const NUM_MENU_IMAGES = 4;
const MENU_IMAGE_FILES = ["main_screen.png", "selector.png", "side_bar.png", "ready.png"];


// SPRITE CONSTANTS
const NUM_SPRITE_SHEETS = 4;
const SPRITE_FILES = ["map_sprites.png", "player_sprites.png", "ghost_sprites.png", "score_sprites.png"];


// BRIDGE
const BRIDGE_RIGHT_POS = [316,209];
const BRIDGE_LEFT_POS = [6,209];


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
			let sprite = new Sprite(sprite_sheets[0], val.sprite_pos, val.sprite_size, val.sprite_size);
			for(var i = 0; i < (val.tile_pos).length; i++){
				let tile = new MapTile(val.tile_pos[i], key, val.tile_size, sprite);
				game_map.set_map_tile(tile);
			}
		});

		// store paramaters being used to create player
		var params = [];
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
							sprites.push(new Sprite(sprite_sheets[1], sprite_array[j], map_json.level_1.entities.player.size, map_json.level_1.entities.player.size));
						}
						// store sprites array in corresponding state map
						state_map.set(state, sprites);
					});
					// store corresponding state map in sprites map
					sprites_map.set(dir, state_map);
				});
				params.push(sprites_map);
			}
			
			else{
				params.push(val);
			}
		});
		let user = new Player(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9], params[10], params[11], params[12], params[13], params[14], params[15], params[16]);
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
								sprites.push(new Sprite(sprite_sheets[2], sprite_array[j], map_json.level_1.entities.player.size, map_json.level_1.entities.player.size));
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

		// store score number sprites in map "0" -> 0 sprite, "1" -> 1 sprite, etc...
		var score_sprite_map = new Map();
		for(var i = 0; i < (map_json.score.sprites).length; i++){
			// create sprite
			score_sprite_map.set(String(i), new Sprite(sprite_sheets[3], map_json.score.sprites[i], map_json.score.width, map_json.score.height));
		}
		
		var big_points = [];
		let game = new Game(context, user, ghosts, 1, "menu", big_points, game_map, sprite_sheets, menu_images, score_sprite_map);
		
		game.load();
		handle_key_press(game);
		//main(context, sprite_sheets, menu_images, game_map);
	});
}

/* Determines how to interpret key presses
 * game - the pacman Game
 */
function handle_key_press(game){
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
				game.state = "ready";
				game.ready();
			}
		}
		else if(game.state == "ready"){
			if(key_map.has(event.which)){
				game.state = "run";
				game.player.int_dir = key_map.get(event.which);
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