const NUM_SPRITE_SHEETS = 1;
const IMAGE_PATH = "../../images/";
const SPRITE_FILE = ["map_sprites.png"];

$(document).ready(function() { 
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	load_sprites(context);

	
	
});
function load_sprites(context){

	var sprite_sheets = [];
    var num_loaded = 0;
    // 2 = num loading screen images
    for(var i = 0; i < NUM_SPRITE_SHEETS; i++){
        var img = new Image();
        sprite_sheets.push(img);
        img.onload = function () {
            num_loaded++;
            if (num_loaded >= NUM_SPRITE_SHEETS) {
                draw_background(context, sprite_sheets)
            }
        }
        img.src = IMAGE_PATH + SPRITE_FILE[i];
    };
}


function draw_background(context, sprite_sheets){
	
	// tile positions on map
	$.getJSON("./json/map.json", function(map_json){

		// itterate through each map tile in map.json
		$.each(map_json.map, function(key, val){

			$.getJSON("./json/sprite.json", function(sprite_json){
				// itterate through the positions of each map tile, and draw their sprite in their location
				for(var i = 0; i < (val.pos).length; i++){
					context.drawImage(sprite_sheets[0], (sprite_json.tiles.map)[String(key)].pos[0], (sprite_json.tiles.map)[String(key)].pos[1], (sprite_json.tiles.map)[String(key)].size, (sprite_json.tiles.map)[String(key)].size, val.pos[i][0]*val.size, val.pos[i][1]*val.size, val.size, val.size);
				}
			});
		});
	});
}