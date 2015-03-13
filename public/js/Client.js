var Client = function(){
	this.pID;
	this.ping = 0;
	this.fps = 40;
	this.display = new Display({client:this});
	this.spell = 0;
	this.mouseCoord = {};

	this.room;
}

Client.prototype.initRoom = function(data){
	this.room = new Room(data);
	this.room.players = [];
	for(var i in data.players){
		data.players[i].room = this.room;
		this.room.players.push(new Player(data.players[i]));
	}
}


Client.prototype.snapshot = function(data){
	for(var i in data.players){
		for(var j in this.room.players){
			if(data.players[i].id == this.room.players[j].id){
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
	}
}

Client.prototype.update = function(){
	if(this.room != null){
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
}