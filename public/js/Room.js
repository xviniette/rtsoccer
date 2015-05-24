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

	this.map = new Map();
	this.admin;

	this.players = [];
	this.ball;

	this.delta = 1/FPS;
	this.lastFrame = Date.now();
	this.deltaNetwork = 1/FPSNETWORK;
	this.lastFrameNetwork = Date.now();

	this.init(json);
}

Room.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Room.prototype.haveToStart = function(){
	var _this = this;
	if(Object.keys(this.players).length == this.nbPlayer){
		for(var i in this.players){
			Utils.messageTo(this.players[i].socket, "information", "La partie est prête et va démarrer dans 5 secondes");
		}
		setTimeout(function(){
			_this.start();
		}, 5000);
	}
}

Room.prototype.start = function(){
	var _this = this;
	this.started = true;
	this.startTime = Date.now();
	this.newBall(this.map.ballSpawn[0].x, this.map.ballSpawn[0].y);
	for(var i in _this.players){
		Utils.messageTo(_this.players[i].socket, "startGame", {startTime:this.startTime});
		_this.players[i].x = _this.map.playerSpawn[_this.players[i].team].x;
		_this.players[i].y = _this.map.playerSpawn[_this.players[i].team].y;
		_this.players[i].direction = null;
	}
}

Room.prototype.update = function(){	
	var now = Date.now();

	this.currentTime = now;

	var d = this.delta * 1000;
	while(now - this.lastFrame >= d){
		this.physic();
		this.lastFrame += d;
	}

	if(isServer){
		var dn = this.deltaNetwork * 1000;
		while(now - this.lastFrameNetwork >= dn){
			this.updateNetwork();
			this.lastFrameNetwork += dn;
		}
	}
}

Room.prototype.physic = function(){
	for(var i in this.players){
		this.players[i].update();
	}
	if(this.ball){
		this.ball.update();
		if(this.started && Date.now() > this.startTime + this.totalTime){
			for(var i in this.players){
				Utils.messageTo(this.players[i].socket, "information", "Fin du match ! Score final "+this.score["1"]+" - "+this.score["2"]+".")
			}
			this.ball = null;
		}
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
		if(this.players[i].team == team){
			teamPlayers.push(players[i]);
		}
	}
	return teamPlayers;
}

Room.prototype.goal = function(team){
	this.score[team]++;
	if(isServer){
		this.ball = null;
		//Si server, on averti tout le monde
		for(var i in this.players){
			Utils.messageTo(this.players[i].socket, "goal", {team:team, score:this.score[team]});
		}

		var _this = this;
		setTimeout(function(){
			for(var i in _this.players){
				_this.players[i].x = _this.map.playerSpawn[_this.players[i].team].x;
				_this.players[i].y = _this.map.playerSpawn[_this.players[i].team].y;
				_this.players[i].direction = null;
			}
			var otherTeam = 1;
			if(team == 1){
				otherTeam = 2;
			}

			_this.newBall(_this.map.ballSpawn[otherTeam].x, _this.map.ballSpawn[otherTeam].y);
		}, 3000);
	}
}

Room.prototype.newBall = function(x, y){
	this.ball = new Ball({x:x, y:y, room:this});
}

Room.prototype.addPlayer = function(player){
	this.players.push(player);
	player.x = this.map.playerSpawn[player.team].x;
	player.y = this.map.playerSpawn[player.team].y;
	if(isServer && !this.started){
		this.haveToStart();
	}
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
		nb:this.getPlayers().length,
		started:this.started
	}
}

Room.prototype.getSnapshot = function(){
	var d = {};
	d.players = this.getPlayersSnapshot();
	if(this.ball != null){
		d.ball = this.ball.getInfos();
	}
	d.currentTime = this.currentTime;
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