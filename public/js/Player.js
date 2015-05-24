var Player = function(json){
	this.id;
	this.socket;
	this.pseudo;

	this.game;
	this.room = null;

	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.direction = null;

	this.team = 0;
	this.speed = 10;

	this.boostSpeed = 0;
	this.timeStun = 0;

	this.sprite;

	this.preX = this.x;
	this.preY = this.y;

	this.positions = [];

	var flash = new Flash();
	this.spells = {
		withBall:{
			1:new Kick(),
			2:new UltraKick(),
			3:flash,
		},
		withoutBall:{
			1:new Charge(),
			2:new Speed(),
			3:flash
		}
	};

	this.init(json);
}

Player.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Player.prototype.setDirection = function(x, y){
	this.direction = {"x":x, "y":y};
}

Player.prototype.interpolate = function(tps){
	var interptime = tps - INTERPOLATION;
	for(var i = 0; i < this.positions.length - 1; i++){
		if(this.positions[i].t <= interptime && this.positions[i + 1].t >= interptime){
			this.preX = this.x;
			this.preY = this.y;
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

Player.prototype.move = function(){
	if(this.timeStun > Date.now()){
		this.direction = null;
	}
	if(this.direction){
		var totspeed = this.speed + this.boostSpeed * this.room.delta;
		var distance = Maths.distance(this.x, this.y, this.direction.x, this.direction.y); 
		if(distance <= totspeed){
			this.x = this.direction.x;
			this.y = this.direction.y;
		}else{
			pd = Maths.getDirection(this.x, this.y, this.direction.x, this.direction.y);
			this.x += totspeed * pd.x;
			this.y += totspeed * pd.y;
		}
	}
}

Player.prototype.update = function(){
	this.move();

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
}

Player.prototype.hasBall = function(){
	if(this.room && this.room.ball && this.room.ball.player && this.room.ball.player.id == this.id){
		return true;
	}
	return false;
}

Player.prototype.getSpell = function(value){
	var typeSpell = this.spells.withBall;
	if(!this.hasBall()){
		typeSpell = this.spells.withoutBall;
	}
	if(typeSpell[value]){
		return typeSpell[value];
	}
	return null;
}

Player.prototype.getInitPlayer = function(){
	return {
		id:this.id,
		pseudo:this.pseudo,
		x:this.x,
		y:this.y,
		team:this.team
	};
}

Player.prototype.getSnapshotPlayer = function(){
	return {
		id:this.id,
		x:parseInt(this.x),
		y:parseInt(this.y)
	};
}