var ping = 0;
var socket;
var pID;
var room;
var isServer = false;
var fps = 40;
var display;
var spell = 0;
var mouse = {};

var client;

function joinRoom(id){
	socket.emit("joinRoom", id);
}

$(function(){
	client = new Client();
	socket = io();
	//Ok
	socket.on("login", function(data){
		socket.emit("login", "Joueur"+Math.round(Math.random() * 1000));
	});

	//Ok
	socket.on("playerID", function(data){
		client.pID = data;
	});

	socket.on("initRoom", function(data){
		//initialisation de la room
		/*var players = data.players;
		data.players = [];
		room = new Room(data);
		display.room = room;
		for(var i in players){
			players[i].room = room;
			room.addPlayer(new Player(players[i]));
		}*/
		client.initRoom(data);
	});

	socket.on("addPlayer", function(data){
		//new joueur room
		client.room.addPlayer(new Player(data));
	});

	socket.on("removePlayer", function(data){
		//remove player room
		client.room.removePlayer(data);
	});

	socket.on("snapshot", function(data){
		//chaque tick update room
		/*room.players = [];
		for(var i in data.players){
			data.players[i].room = room;
			var p = new Player(data.players[i]);
			room.players.push(p);
		}
		if(data.ball){
			room.ball = new Ball(data.ball);
		}*/
		client.snapshot(data);
	});

	//Ok
	socket.on("refreshRooms", function(data){
		client.display.refreshRooms(data);
	});

	
	//ping
	setInterval(function(){
		socket.emit("ping", Date.now());
	}, 1000);

	socket.on("pong", function(data){
		client.ping = Date.now() - data;
	});

	//tchat
	socket.on("tchat", function(data){
		$("#messages").append('<li>'+data+'</li>');
	});


	//Event 
	$("#canvas").on("mousedown", function(e){
		if(client.spell != 0){
			//utilisation d'un sort
			socket.emit("spell", {x:e.offsetX, y:e.offsetY,spell:client.spell});
			client.spell = 0;
		}else{
			//déplacement
			socket.emit("move", {x:e.offsetX, y:e.offsetY});
		}
	});

	$("#canvas").on("mousemove", function(e){
		client.mouseCoord = {x:e.offsetX, y:e.offsetY};
	});

	//creation de room
	$("#createRoom").submit(function(e){
		e.preventDefault();
		var d = {
			name:$("#roomName").val(),
			nb:$("#roomNbPlayer").val(),
			time:$("#roomTime").val()
		}
		socket.emit("createRoom", d);
	});

	//envoi message
	$("#tchat").submit(function(e){
		e.preventDefault();
		var bar = $("#tchatBar");
		socket.emit("tchat", bar.val());
		bar.val("");
	});

	setInterval(function(){
		client.update();
	}, 1000/client.fps);

	document.body.addEventListener("keypress", function(e) {
		client.keySpell(e.keyCode);
	});
});
