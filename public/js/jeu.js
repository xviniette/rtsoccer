var client;

function joinRoom(id){
	socket.emit("joinRoom", id);
}

$(function(){

	var imgs = {
		tiles:"public/img/tiles.png"
	}

	client = new Client();
	client.loadImages(imgs);
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
		client.snapshot(data);
	});

	//Ok
	socket.on("refreshRooms", function(data){
		client.display.refreshRooms(data);
	});

	//Ok
	socket.on("nbPlayers", function(data){
		$("#nbPlayers").text(data);
	});


	socket.on("spell", function(data){
		client.spellUsed(data);
	});

	socket.on("goal", function(data){
		$("#score"+data.team).text(data.score);
	});

	socket.on("switchTeam", function(data){
		if(client.room){
			for(var i in client.room.players){
				if(client.room.players[i].id == data.id){
					console.log("lol");
					client.room.players[i].team = data.team;
					break;
				}
			}
		}
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
		$("#messages").animate({scrollTop:$("#messages").prop('scrollHeight')}, 30);
	});


	//Event 
	$("#canvas").on("mousedown", function(e){
		client.mouseClick(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
	});

	$("#canvas").on("mousemove", function(e){
		client.mouseMove(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
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
		if(bar.val().length > 0){
			socket.emit("tchat", bar.val());
		}
		bar.val("");
	});

	$("#leave").on("click", function(){
		socket.emit("leaveRoom", "");
		client.display.showRooms();
	});

	$("#switch").on("click", function(){
		socket.emit("changeTeam", "");
	});

	setInterval(function(){
		//Boucle du jeu
		client.update();
	}, 1000/client.fps);

	document.body.addEventListener("keypress", function(e) {
		//Gestion des touches
		client.keySpell(e.charCode);
	});
});
