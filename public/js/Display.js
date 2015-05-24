var Display = function(json){
	this.client;
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.background = "black";

	this.sprites;
	this.particles = [];


	this.init(json);
}

Display.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}

}

Display.prototype.draw = function(){
	
	this.ctx.fillStyle = this.background;
	this.ctx.fillRect(0, 0, this.canvas.width,this.canvas.height);
	if(this.client.room == null){
		return;
	}
	var room = this.client.room;
	var players = room.players;
	var ball = room.ball;
	var map = room.map;
	var img = this.client.images;

	this.sprites = {
		"team1":{img:img.tiles, name:"team1", x:82, y:64, w:82, h:71, animation:[0], fps:1},
		"team2":{img:img.tiles, name:"team2", x:82, y:135, w:82, h:71, animation:[0], fps:1},
		"rrunteam1":{img:img.tiles, name:"rrunteam1", x:0, y:64, w:82, h:71, animation:[0,1,2,3,4,5,6,7,8,9,10,11], fps:30},
		"rrunteam2":{img:img.tiles, name:"rrunteam2", x:0, y:135, w:82, h:71, animation:[0,1,2,3,4,5,6,7,8,9,10,11], fps:30},
		"lrunteam1":{img:img.tiles, name:"lrunteam1", x:0, y:206, w:82, h:71, animation:[0,1,2,3,4,5,6,7,8,9,10,11], fps:30},
		"lrunteam2":{img:img.tiles, name:"lrunteam2", x:0, y:277, w:82, h:71, animation:[0,1,2,3,4,5,6,7,8,9,10,11], fps:30},
	};

	//affichage map

	//AFFICHAGE GAZON
	var gazonLarge = 64;
	for(var i = 0; i < this.canvas.width/gazonLarge; i++){
		for(var j = 0; j < this.canvas.height/gazonLarge; j++){
			this.ctx.drawImage(img.tiles, 0, 0, 64, 64, i*gazonLarge, j*gazonLarge, gazonLarge, gazonLarge);
		}
	}
	//Lignes du terrain
	this.ctx.strokeStyle = "white";
	this.ctx.lineWidth = 5;
	this.ctx.strokeRect(map.startX, map.startY, map.width, map.height);
	this.ctx.beginPath();
	this.ctx.moveTo(map.width/2 + map.startX, map.startY);
	this.ctx.lineTo(map.width/2 + map.startX, map.startY + map.height);
	this.ctx.stroke();

	this.ctx.beginPath();
	this.ctx.arc(map.width/2 + map.startX, map.startY + map.height/2, map.height/5, 0, 2*Math.PI);
	this.ctx.stroke();
	this.ctx.closePath();
	//Cages
	this.ctx.fillStyle = "white";
	this.ctx.fillRect(0, map.startY + map.height/2 - map.goalHeight/2, map.startX, map.goalHeight);
	this.ctx.fillStyle = "white";
	this.ctx.fillRect(map.startX + map.width, map.startY + map.height/2 - map.goalHeight/2, map.startX, map.goalHeight);

	var p = room.getPlayer(this.client.pID);
	

	//Zone spell
	if(this.client.spell != 0){
		var s = p.getSpell(this.client.spell);
		if(s != null){
			this.ctx.fillStyle = "rgba(86, 182, 255, 0.2)";
			if(s.lastUse + s.cd >= Date.now()){
				this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
			}
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, s.range, 0, 2 * Math.PI, false);
			this.ctx.fill();
			if(s.aoe > 0){
				//Aoe du sort
				this.ctx.fillStyle = "green";
				this.ctx.beginPath();
				this.ctx.arc(this.client.mouseCoord.x, this.client.mouseCoord.y, s.aoe, 0, 2 * Math.PI, false);
				this.ctx.fill();
			}
		}
	}

	//CD
	var spells = p.spells.withBall;
	if(!p.hasBall()){
		spells = p.spells.withoutBall;
	}
	$("#spells").children().css("display", "none");
	for(var i in spells){
		var sp = $("#spell-"+spells[i].id);
		sp.css("display", "inline-block");
		if(spells[i].lastUse + spells[i].cd >= Date.now()){
			sp.addClass("cd");
			sp.text(Math.round(((spells[i].lastUse + spells[i].cd) - Date.now())/100)/10);
		}else{
			sp.text("");
			sp.removeClass("cd");
		}
	}


	//PERSO
	for(var i in players){
		var wP = players[i].radius*3;
		var hP = 71 * (wP/82);
		var name = "";
		
		if(players[i].preX != players[i].x || players[i].preY != players[i].y){
			if(players[i].preX > players[i].x){
				name += "l";
			}else{
				name += "r";
			}
			name += "run";
		}
		if(players[i].team == 1){
			name += "team1";
			this.ctx.fillStyle = "rgba(0, 38, 255, 0.4)";
		}else{
			name += "team2";
			this.ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
		}

		this.ctx.beginPath();
		this.ctx.arc(players[i].x,players[i].y,players[i].radius,0,2*Math.PI);
		this.ctx.fill();
		this.ctx.fillStyle = "white";
		if(players[i].id == client.pID){
			this.ctx.fillStyle = "yellow";
		}
		this.ctx.font = "12px Arial";
		this.ctx.fillText(players[i].pseudo, players[i].x - players[i].radius, players[i].y - hP);

		if(players[i].sprite == null || players[i].sprite.name != name){
			players[i].sprite = new Sprite(this.sprites[name]);
		}

		players[i].sprite.draw(this.ctx, players[i].x - (wP/2), players[i].y - hP * 0.9, wP, hP);
	}

	if(ball){
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI);
		this.ctx.fill();
	}

	//PING
	this.ctx.fillStyle = "white";
	this.ctx.font = "10px Arial";
	this.ctx.fillText(this.client.ping, 0, 10);
}

Display.prototype.refreshRooms = function(data){
	var html = "<ul>";
	for(var i in data){
		min = Math.floor(data[i].totalTime/60000);
		html += '<li><b>'+data[i].nom+'</b> ('+data[i].nb+'/'+data[i].nbPlayer+' joueurs) '+min+'" <button onclick=\'joinRoom("'+data[i].id+'")\'>Rejoindre</button></li>';
	}
	html += "</ul>";
	$("#rooms").html(html);
}

Display.prototype.hideRooms = function(){
	$(".rooms").hide();
}

Display.prototype.showRooms = function(){
	$(".rooms").show();
}

Display.prototype.timer = function(startTime, TotalTime, currentTime){
	var min, sec, timeleft;
	if(startTime == 0){
		timeleft = TotalTime;
	}else{
		timeleft = startTime + TotalTime - currentTime;
		if(timeleft<0){
			timeleft = 0;
		}
	}
	min = Math.floor(timeleft/60000);
	sec = Math.floor((timeleft-min*60000)/1000);
	$("#timeleft").text(min+":"+sec);
}

Display.prototype.initSpell = function(){
	//liste spells
	var values = {
		1:97,
		2:122,
		3:101,
		4:97,
		5:122
	};
	var p = this.client.room.getPlayer(this.client.pID);
	var spells = p.spells;
	var htmlSpell = '';
	for(var i in spells){
		for(var j in spells[i]){
			var s = spells[i][j];
			var withBall = '';
			if(i == "withBall"){
				withBall = "withBall";
			}
			if(!(i == "withBall" && j == 3)){
				htmlSpell += '<li id="spell-'+s.id+'" style="background-image: url(public/img/'+s.nom+'.png);width:60px;height:60px" '+withBall+' onclick="client.keySpell('+values[s.id]+');"></li>';
			}
		}
	}
	$("#spells").html(htmlSpell);
}
