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


	//affichage map
	this.ctx.fillStyle = "#46563C";
	this.ctx.strokeStyle = "white";

	this.ctx.rect(map.startX, map.startY, map.width, map.height);
	this.ctx.stroke();
	this.ctx.fill();

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
		if(players[i].team == 1){
			this.ctx.fillStyle = "red";
		}else{
			this.ctx.fillStyle = "blue";
		}
		this.ctx.beginPath();
		this.ctx.arc(players[i].x,players[i].y,players[i].radius,0,2*Math.PI);
		this.ctx.fill();
	}

	if(ball){
		this.ctx.fillStyle = "yellow";
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