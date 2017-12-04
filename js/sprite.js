/* Representation of a Sprite
 * sprite_sheet: Image - image file for the sprite
 * coord: [int, int] - [x,y] top left corner of sprite on spritesheet
 * width: int - the width of the sprite
 * height: int - the height of the sprite
 */
class Sprite {
	constructor(sprite_sheet, coord, width, height){
		this.sprite_sheet = sprite_sheet;
		this.coord = coord;
		this.width = width;
		this.height = height;
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
	get width(){
		return this._width;
	}
	set width(new_width){
		this._width = new_width;
	}
	get height(){
		return this._height;
	}
	set height(new_height){
		this._height = new_height;
	}

	draw(context, pos){
		context.drawImage(this._sprite_sheet, this._coord[0], this._coord[1], this._width, this._height, pos[0], pos[1], this._width, this._height);
	}
}