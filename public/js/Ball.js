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

	this.positions = [];

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

Ball.prototype.interpolate = function(tps){
	var interptime = tps - INTERPOLATION;
	for(var i = 0; i < this.positions.length - 1; i++){
		if(this.positions[i].t <= interptime && this.positions[i + 1].t >= interptime){
			var ratio = (interptime - this.positions[i].t)/(this.positions[i + 1].t - this.positions[i].t);
			var x = Math.round(this.positions[i].x + ratio * (this.positions[i + 1].x - this.positions[i].x));
			var y = Math.round(this.positions[i].y + ratio * (this.positions[i + 1].y - this.positions[i].y));
			this.x = x;
			this.y = y;
			break;
			this.positions.splice(0, i - 1);
		}
	}
}

Ball.prototype.kick = function(dx, dy, speed){
	this.lastPlayer = this.player;
	this.player = null;
	this.lastCaptured = Date.now();
	this.setDirection(dx, dy, speed);
}

Ball.prototype.hasGoalCollision = function(){
	var goalYmin = this.room.map.startY + (this.room.map.height/2 - this.room.map.goalHeight/2);
	var goalYmax = goalYmin + this.room.map.goalHeight;
	if(this.y >= goalYmin && this.y <= goalYmax && (this.x <= this.room.map.startX || this.x >= this.room.map.startX + this.room.map.width)){
		if(this.x <= this.room.map.startX){
			return 2;
		}else{
			return 1;
		}
	}
	return false;
}

Ball.prototype.update = function(){
	if(this.player == null){
		//Le ballon n'est pas controlé, on gère sa physique
		this.x += this.dx;
		this.y += this.dy;
		this.dx *= this.friction;
		this.dy *= this.friction;

		var goal = this.hasGoalCollision();
		if(goal){
			this.room.goal(goal);
		}
		
		if(this.x < this.room.map.startX){
			this.dx *= -1;
			this.x = this.room.map.startX;
		}else if(this.x > this.room.map.startX + this.room.map.width){
			this.dx *= -1;
			this.x = this.room.map.startX + this.room.map.width;
		}

		if(this.y < this.room.map.startY){
			this.dy *= -1;
			this.y = this.room.map.startY;
		}else if(this.y > this.room.map.startY + this.room.map.height){
			this.dy *= -1;
			this.y = this.room.map.startY + this.room.map.height;
		}

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