var Sprite = function(data){
	// data = {img, name, startx, starty, width, height, animation, fps}
	this.img = data.img;
	this.name = data.name;
	this.startX = data.x || 0;
	this.startY = data.y || 0;
	this.width = data.w;
	this.height = data.h;
	this.transitions = data.animation;
	this.fps = data.fps;

	this.index = 0;
	this.lastChangeTransiTime = 0;
}

Sprite.prototype.draw = function(ctx, x, y, retourne, width, height){
	if(Date.now() > this.lastChangeTransiTime + 1000/this.fps){
		//changement de transition
		this.index++;
		if(this.index >= this.transitions.length){
			this.index = 0;
		}
		/*if(this.name == "immo"){
			this.index = this.transitions.length-2;
		}*/
		this.lastChangeTransiTime = Date.now();
	}


	var w = this.width;
	if(width){
		w = width;
	}
	var h = this.height;
	if(height){
		h = height;
	}

	
	ctx.drawImage(this.img, this.startX + this.transitions[this.index] * this.width, this.startY, this.width, this.height, x, y, w, h);

}