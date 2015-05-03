var Display = function(json){
	this.client;
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.background = "black";
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
	//liste spells
	var spells = p.spells.withBall;
	if(!p.hasBall()){
		spells = p.spells.withoutBall;
	}
	var htmlSpell = "";
	for(var i in spells){
		htmlSpell += spells[i].nom+" ";
		if(spells[i].lastUse + spells[i].cd > Date.now()){
			htmlSpell += "("+ Math.round(((spells[i].lastUse + spells[i].cd) - Date.now())/100)/10 +") ";
		}
	}
	$("#spells").html(htmlSpell);

	//Zone spell
	if(this.client.spell != 0){
		var s = p.getSpell(this.client.spell);
		if(s != null){
			this.ctx.fillStyle = "rgba(86, 182, 255, 0.2)";
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

	//PERSO
	for(var i in players){
		/*if(players[i].team == 1){
			this.ctx.fillStyle = "red";
		}else{
			this.ctx.fillStyle = "blue";
		}
		this.ctx.beginPath();
		this.ctx.arc(players[i].x,players[i].y,players[i].radius,0,2*Math.PI);
		this.ctx.fill();*/
		players[i].sprites.draw(this.ctx,players[i].x,players[i].y,players[i].preX,players[i].preY);
		this.ctx.fillStyle = "white";
		if(players[i].id == client.pID){
			this.ctx.fillStyle = "yellow";
		}
		this.ctx.font = "10px Arial";
		this.ctx.fillText(players[i].pseudo, players[i].x - players[i].radius, players[i].y - players[i].radius-25);
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
		html += '<li>'+data[i].nom+' ('+data[i].nb+'/'+data[i].nbPlayer+') <button onclick=\'joinRoom("'+data[i].id+'")\'>Rejoindre</button></li>';
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