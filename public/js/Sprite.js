var Sprite = function(data){
	// data = {imgL,imgW, nameL,nameW,team, startx, starty, width, height, animation, fps}
	if(data.team == 0){
		data.team ="";
	}
	this.team = data.team;
	this.imgL = new Image();
	this.imgL.src =  data.imgL+data.team+".png";
	this.imgW = new Image();
	this.imgW.src = data.imgW+data.team+".png";
	this.direc;
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

Sprite.prototype.draw = function(ctx, x, y,precX,precY,team, width, height){
	//console.log(this.team + " " + team);
	if(team != this.team){
		this.changeTeam(team);
	}
		if(Date.now() > this.lastChangeTransiTime + 1000/this.fps){
			//changement de transition
			this.index++;
			if(this.index >= this.transitions.length){
				this.index = 0;
			}
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
		//console.log(x +" "+ precX);
		if(x==precX && y == precY){// Immobile
			if(this.direc == "L"){
				ctx.drawImage(this.imgL, this.startX + this.transitions[10] /* this.width*/, this.startY, this.width, this.height, x-w/2, y-h/2, w, h);
			}else{
				ctx.drawImage(this.imgW, this.startX + this.transitions[1] /* this.width*/, this.startY, this.width, this.height, x-w/2, y-h/2, w, h);
			}
			
		}else{// en mouvement
			if(this.direc == "L"){
				ctx.drawImage(this.imgL, this.startX + this.transitions[this.index] /* this.width*/, this.startY, this.width, this.height, x-w/2, y-h/2, w, h);
			}else{
				ctx.drawImage(this.imgW, this.startX + this.transitions[this.index] /* this.width*/, this.startY, this.width, this.height, x-w/2, y-h/2, w, h);
			}
			if(precX>=x){
				this.direc="L";
			}else{
				this.direc="W";
			}
		}
		

}

Sprite.prototype.changeTeam = function(team){
	this.imgL.src = this.imgL.src.replace(".png",team+".png");
	this.imgW.src = this.imgW.src.replace(".png",team+".png");
	this.team = team;
	if(this.team == 2){
		this.direc = "L";
	}
}