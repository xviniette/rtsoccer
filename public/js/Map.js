var Map = function(){
	this.startX;
	this.startY;
	this.width = 600;
	this.height;

	this.goalHeight = 

	this.ballSpawn = {
		0:{x:this.width/2+this.startX,y:this.height/2+this.startY},
		1:{x:this.width/3+this.startX,y:this.height/2+this.startY},
		2:{x:2*(this.width/3)+this.startX,y:this.height/2+this.startY}
	}

	this.playerSpawn = {
		1:{x:this.width/4+this.startX,y:this.height/2+this.startY},
		2:{x:3*(this.width/4)+this.startX,y:this.height/2+this.startY}
	}
}