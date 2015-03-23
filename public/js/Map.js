var Map = function(){
	this.startX = 20;
	this.startY = 20;
	this.width = 760;
	this.height = 560;

	this.goalHeight = 200;

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