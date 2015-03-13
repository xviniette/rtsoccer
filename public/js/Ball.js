var Ball = function(json){
	this.room;

	this.player = null;
	this.lastPlayer = null;

	this.x = 100;
	this.y = 100;
	this.dx = 0;
	this.dy = 0;
	this.radius = 10;
	this.friction = 0.9;
	this.bounce = 0.5;

	this.lastCaptured = Date.now() - this.capturableCd;

	this.init(json);
}

Ball.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Ball.prototype.hasPlayerCollision = function(player){
	var distance = Maths.distance(this.x, this.y, player.x, player.y);
	if(distance <= this.radius + player.radius){
		return true;
	}
	return false;
}

Ball.prototype.isCapturable = function(player){
	if(Date.now() > this.lastCaptured + 1000 || this.lastPlayer == null || player.id != this.lastPlayer.id){
		return true;
	}
	return false;
}	

Ball.prototype.setDirection = function(dx, dy, speed){
	this.dx = dx * speed;
	this.dy = dy * speed;
}

Ball.prototype.kick = function(dx, dy, speed){
	this.lastPlayer = this.player;
	this.player = null;
	this.lastCaptured = Date.now();
	this.setDirection(dx, dy, speed);
}

Ball.prototype.update = function(){
	if(this.player == null){
		//physic de la ball
		this.x += this.dx;
		this.y += this.dy;
		this.dx *= this.friction;
		this.dy *= this.friction;

		//On regarde si un joueur à le ballon
		for(var i in this.room.players){
			//on check si un joueur passe dessus
			if(this.hasPlayerCollision(this.room.players[i]) && this.isCapturable(this.room.players[i])){
				//on lui attribu
				this.player = this.room.players[i];
				break;
			}
		}
	}else{
		//le ballon appartient à un joueur
		this.x = this.player.x;
		this.y = this.player.y;
		this.dx = 0;
		this.dy = 0;
	}
}

Ball.prototype.getInfos = function(){
	var d = {
		x:parseInt(this.x),
		y:parseInt(this.y)
	};
	if(this.player){
		d.player = {id:this.player.id};
	}
	return d;
}