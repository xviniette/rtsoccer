var Room = function(json){
	this.game;
	this.id;
	this.nom;
	this.nbPlayer;
	this.started = false;
	this.totalTime;
	this.currentTime = 0;
	this.startTime = 0;
	this.score = {"1":0,"2":0};

	this.admin;

	this.players = [];
	this.ball;

	this.init(json);
}

Room.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Room.prototype.update = function(){
	this.currentTime = Date.now();
	for(var i in this.players){
		this.players[i].update();
	}
	if(this.ball){
		this.ball.update();
	}else{
		this.ball = new Ball({room:this});
	}
	if(isServer){
		this.updateNetwork();
	}
}

Room.prototype.updateNetwork = function(){
	for(var i in this.players){
		io.sockets.connected[this.players[i].socket].emit("snapshot", this.getSnapshot());
	}
}

Room.prototype.getPlayers = function(){
	return this.players;
}

Room.prototype.getPlayer = function(id){
	for(var i in this.players){
		if(this.players[i].id == id){
			return this.players[i];
		}
	}
	return null
}

Room.prototype.getPlayersTeam = function(team){
	var teamPlayers = [];
	var players = this.getPlayers();
	for(var i in players){
		if(this.team == team){
			teamPlayers.push(players[i]);
		}
	}
	return teamPlayers;
}

Room.prototype.goal = function(team){
	this.score[team]++;
	if(isServer){
		//Si server, on averti tout le monde
		for(var i in this.players){
			io.sockets.connected[this.players[i].socket].emit("goal", team);
		}
	}
}

Room.prototype.addPlayer = function(player){
	this.players.push(player);
}

Room.prototype.removePlayer = function(playerID){
	for(var i in this.players){
		if(this.players[i].id == playerID){
			this.players.splice(i, 1);
			break;
		}
	}
}

Room.prototype.getRefreshInfo = function(){
	return {
		id:this.id,
		nom:this.nom,
		nbPlayer:this.nbPlayer,
		totalTime:this.totalTime,
		nb:this.getPlayers().length
	}
}

Room.prototype.getSnapshot = function(){
	var d = {};
	d.players = this.getPlayersSnapshot();
	if(this.ball != null){
		d.ball = this.ball.getInfos();
	}
	return d;
}

Room.prototype.getInitInfo = function(){
	return {
		id:this.id,
		nom:this.nom,
		nbPlayer:this.nbPlayer,
		started:this.started,
		totalTime:this.totalTime,
		currentTime:this.currentTime,
		startTime:this.startTime,
		score:this.score,
		players:this.getPlayersInfos()
	}
}

Room.prototype.getPlayersSnapshot = function(){
	var ps = [];
	for(var i in this.players){
		ps.push(this.players[i].getSnapshotPlayer());
	}
	return ps;
}

Room.prototype.getPlayersInfos = function(){
	var ps = [];
	for(var i in this.players){
		ps.push(this.players[i].getInitPlayer());
	}
	return ps;
}