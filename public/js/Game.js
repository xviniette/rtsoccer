var Game = function(){
	this.players = {};
	this.rooms = [];
}

Game.prototype.addPlayer = function(player){
	this.players[player.socket] = player;
}

Game.prototype.deletePlayer = function(socket){
	delete this.players[socket];
}

Game.prototype.addRoom = function(id, name, nbPlayer, time, player){
	var room = new Room({"game":this,"id":id,"nom":name,"nbPlayer":nbPlayer,"totalTime":time,"admin":player});
	this.rooms.push(room);
	return room;
}

Game.prototype.deleteRoom = function(roomId){
	for(var i in this.rooms){
		if(this.rooms[i].id == roomId){
			this.rooms.splice(i, 1);
		}
	}
}

Game.prototype.getPlayerBySocket = function(socket){
	if(this.players[socket]){
		return this.players[socket];
	}
	return null;
}

Game.prototype.getRoom = function(id){
	for(var i in this.rooms){
		if(this.rooms[i].id == id){
			return this.rooms[i];
		}
	}
	return null;
}

Game.prototype.getNoneRoomPlayers = function(){
	var players = [];
	for(var i in this.players){
		if(this.players[i].room == null){
			players.push(this.players[i]);
		}
	}
	return players;
}

Game.prototype.getRefreshRooms = function(){
	var rooms = [];
	for(var i in this.rooms){
		if(!this.rooms[i].started){
			rooms.push(this.rooms[i].getRefreshInfo());
		}
	}
	return rooms;
}

Game.prototype.getNbPlayers = function(){
	return Object.keys(this.players).length;
}