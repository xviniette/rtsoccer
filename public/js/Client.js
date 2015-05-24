var Client = function(){
	this.pID;
	this.ping = 0;
	this.fps = 40;
	this.interp = 50;
	this.display;
	this.spell = 0;
	this.mouseCoord = {};
	this.scale = 1;

	this.images;

	this.room;
}

Client.prototype.initRoom = function(data){
	this.room = new Room(data);
	this.room.players = [];
	for(var i in data.players){
		data.players[i].room = this.room;
		this.room.players.push(new Player(data.players[i]));
	}
	this.display.hideRooms();
	this.display.initSpell();
}


Client.prototype.snapshot = function(data){
	for(var i in data.players){
		for(var j in this.room.players){
			if(data.players[i].id == this.room.players[j].id){
				data.players[i].t = Date.now();
				//this.room.players[j].positions.push(data.players[i]);
				this.room.players[j].preX = this.room.players[j].x;
				this.room.players[j].preY = this.room.players[j].y;
				this.room.players[j].init(data.players[i]);
			}
		}
	}
	//ballon
	if(data.ball){
		if(this.room.ball){
			this.room.ball.player = null;
			this.room.ball.init(data.ball);
		}else{
			this.room.ball = new Ball(data.ball);
		}
	}else{
		this.room.ball = null;
	}

	this.room.currentTime = data.currentTime;
	this.display.timer(this.room.startTime, this.room.totalTime, data.currentTime);
}

Client.prototype.update = function(){
	if(this.room != null){
		/*for(var i in this.room.players){
			this.room.players[i].interpolation();
		}*/
		this.display.draw();
	}
}

Client.prototype.keySpell = function(keyCode){
	switch(keyCode) {
		case 97:
		(this.spell == 1)? this.spell = 0 : this.spell = 1;
		break;
		case 122:
		(this.spell == 2)? this.spell = 0 : this.spell = 2;
		break;
		case 101:
		(this.spell == 3)? this.spell = 0 : this.spell = 3;
		break;
	}

	//On lance direct le sort si sort sans visée
	if(!this.room){
		return;
	}
	var p = this.room.getPlayer(this.pID);
	if(!p){
		return;
	}
	var s = p.getSpell(this.spell);
	if(s && s.range == 0){
		socket.emit("spell", {x:0, y:0,spell:this.spell});
		this.spell = 0;
	}
}

Client.prototype.mouseClick = function(x, y){
	x = parseInt(x/this.scale);
	y = parseInt(y/this.scale);
	if(this.spell != 0){
		socket.emit("spell", {x:x, y:y,spell:this.spell});
		this.spell = 0;
	}else{
		socket.emit("move", {x:x, y:y});
	}
}

Client.prototype.mouseMove = function(x, y){
	x = parseInt(x/this.scale);
	y = parseInt(y/this.scale);
	this.mouseCoord = {x:x, y:y};
}

Client.prototype.spellUsed = function(data){
	if(data.pID == this.pID){
		var p = this.room.getPlayer(this.pID);
		for(var i in p.spells){
			for(var j in p.spells[i]){
				if(p.spells[i][j].id == data.spellId){
					p.spells[i][j].lastUse = Date.now();
				}
			}
		}
	}
}

Client.prototype.loadImages = function(sources){
	var _this = this;
	this.images = {};
	var loadedImages = 0;
	var numImages = 0;
	for(var src in sources) {
		numImages++;
	}
	for(var src in sources) {
		this.images[src] = new Image();
		this.images[src].onload = function() {
			if(++loadedImages >= numImages) {
				_this.display = new Display({client:_this});
			}
		};
		this.images[src].src = sources[src];
	}
}