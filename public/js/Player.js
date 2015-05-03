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

	this.preX;
	this.preY;

	this.team = 0;
	this.speed = 10;

	this.boostSpeed = 0;
	this.timeStun = 0;

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


	var sp = {
		imgL: "public/img/run2L"+this.team+".png",
		imgW: "public/img/run2W"+this.team+".png",
		nameL: "run2L"+this.team+".png",
		nameW: "run2W"+this.team+".png",
		x: 0,
		y: 0,
		w: 82,
		h: 70,
		animation: [0,82,164,246,328,410,492,574,652,738,820,902],
		fps:40
	};
	this.sprites = new Sprite(sp);

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

Player.prototype.move = function(){
	console.log("pouet "+this.x);
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

Player.prototype.changeTeam = function(team){
	console.log("pouet"+team);
	sprites.changeImgL("public/img/run2L"+this.team+".png");
	sprites.changeImgW("public/img/run2W"+this.team+".png");
}
