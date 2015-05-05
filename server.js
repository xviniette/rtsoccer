var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var fs = require('fs');

//Inclde files
eval(fs.readFileSync('./public/js/Game.js')+'');
eval(fs.readFileSync('./public/js/Map.js')+'');
eval(fs.readFileSync('./public/js/Player.js')+'');
eval(fs.readFileSync('./public/js/Ball.js')+'');
eval(fs.readFileSync('./public/js/Room.js')+'');
eval(fs.readFileSync('./public/js/serverUtils.js')+'');
eval(fs.readFileSync('./public/js/Maths.js')+'');
eval(fs.readFileSync('./public/js/Spell.js')+'');
eval(fs.readFileSync('./public/js/Sprite.js')+'');

server.listen(80);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get( '/*' , function( req, res, next ) {
	var file = req.params[0];
	res.sendFile( __dirname + '/' + file );
});

var isServer = true;
var fps = 40;
//Ces deux variable servent à générer les valeurs pour id user/room
var nbClients = 0;
var nbRooms = 0;
var game = new Game();

//physic game
setInterval(function(){
	for(var i in game.rooms){
		game.rooms[i].update();
	}
}, 1000/fps);


io.on('connection', function(socket){
	//On demande le pseudo au joueur
	socket.emit("login", true);
	//Reponse du pseudo
	socket.on("login", function(data){
		Utils.onLogin(data, socket);
	});

	//ok
	socket.on("tchat", function(data){
		Utils.onTchat(data, socket);
	});

	//OK
	socket.on("move", function(data){
		Utils.onMove(data, socket);
	});

	socket.on("spell", function(data){
		Utils.onSpell(data, socket);
	});

	//ok
	socket.on("joinRoom", function(data){
		Utils.onJoinRoom(data, socket);
	});

	//ok
	socket.on("leaveRoom", function(data){
		Utils.onLeaveRoom(data, socket);
	});

	//ok
	socket.on("createRoom", function(data){
		Utils.onCreateRoom(data, socket);
	});

	//ok
	socket.on("changeTeam", function(data){
		Utils.onChangeTeam(data, socket);
	});

	socket.on("refreshRooms", function(data){
		socket.emit("refreshRooms", game.getRefreshRooms());
	});

	//ok
	socket.on("disconnect", function(){
		Utils.onDisconnect(socket);
	});

	//ok
	socket.on("ping", function(data){
		socket.emit("pong", data);
	});
});