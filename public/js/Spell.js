//Kick simple

var Kick = function(){
	this.id = 1;
	this.nom = "Frappe";
	this.cd = 1000;
	this.range = 300; //0 = sort qui s'utilise direct ; > 0 zone ou on choisit
	this.aoe = "direction"; // int = zone en cercle, "direction" = fleche, "target" = cible	
	this.lastUse = 0;
	this.description = "Un sort de frappe basique.";

	this.maxSpeedBall = 40;
	this.minSpellBall = 10;
}

Kick.prototype.use = function(player, x, y){
	if(Date.now() < this.lastUse + this.cd){
		//probleme cd
		return false;
	}
	var distance = Maths.distance(player.x, player.y, x, y);
	if(distance > this.range){
		//probleme range
		return false;
	}

	var pourcentage = distance/this.range;
	var direction = Maths.getDirection(player.x, player.y, x, y);
	if(pourcentage > 1){ pourcentage = 1; }

	var ball = player.room.ball;
	ball.kick(direction.x, direction.y, parseInt((this.maxSpeedBall - this.minSpellBall) * pourcentage + this.minSpellBall));
	this.lastUse = Date.now();
	return true;
}

//Ultra kick

var UltraKick = function(){
	this.id = 2;
	this.nom = "UltraFrappe";
	this.cd = 20000;
	this.range = 150; //0 = sort qui s'utilise direct ; > 0 zone ou on choisit
	this.aoe = "direction"; // int = zone en cercle, "direction" = fleche, "target" = cible	
	this.lastUse = 0;
	this.description = "Un sort de frappe puissant.";

	this.maxSpeedBall = 100;
	this.minSpellBall = 50;
}

UltraKick.prototype.use = function(player, x, y){
	if(Date.now() < this.lastUse + this.cd){
		//probleme cd
		return false;
	}
	var distance = Maths.distance(player.x, player.y, x, y);
	if(distance > this.range){
		//probleme range
		return false;
	}

	var pourcentage = distance/this.range;
	var direction = Maths.getDirection(player.x, player.y, x, y);
	if(pourcentage > 1){ pourcentage = 1; }

	var ball = player.room.ball;
	ball.kick(direction.x, direction.y, parseInt((this.maxSpeedBall - this.minSpellBall) * pourcentage + this.minSpellBall));
	this.lastUse = Date.now();
	return true;
}

//Flash

var Flash = function(){
	this.id = 3;
	this.nom = "Flash";
	this.cd = 30000;
	this.range = 200; //0 = sort qui s'utilise direct ; > 0 zone ou on choisit
	this.aoe = "target"; // int = zone en cercle, "direction" = fleche, "target" = cible	
	this.lastUse = 0;
	this.description = "Un sort de teleportation.";
}

Flash.prototype.use = function(player, x, y){
	if(Date.now() < this.lastUse + this.cd){
		//probleme cd
		return false;
	}
	var distance = Maths.distance(player.x, player.y, x, y);
	if(distance > this.range){
		//probleme range
		return false;
	}

	player.x = x;
	player.y = y;
	player.direction = {x:x,y:y};
	this.lastUse = Date.now();
	return true;
}

//Charge

var Charge = function(){
	this.id = 4;
	this.nom = "Charge";
	this.cd = 5000;
	this.range = 100; //0 = sort qui s'utilise direct ; > 0 zone ou on choisit
	this.aoe = 50; // int = zone en cercle, "direction" = fleche, "target" = cible	
	this.lastUse = 0;
	this.description = "Permet d'assommer un adversaire, et lui faire perdre la balle.";

	this.stun = 3000;
}

Charge.prototype.use = function(player, x, y){
	if(Date.now() < this.lastUse + this.cd){
		//probleme cd
		return false;
	}
	var distance = Maths.distance(player.x, player.y, x, y);
	if(distance > this.range){
		//probleme range
		return false;
	}

	for(var i in player.room.players){
		var p = player.room.players[i];
		if(p.id != player.id && Maths.distance(p.x, p.y, x, y) <= this.aoe){
			//On stun le mec
			p.timeStun = Date.now() + this.stun;
			//Si ball, on lui fait perdre
			if(p.hasBall()){
				var d = {};
				d.x = Math.round(Math.random()*100)/100;
				d.y = 1 - d.x;

				for(var k in d){
					var signe = 1;
					if(Math.random() < 0.5){
						signe = -1;
					}
					d[k] *= signe;
				}
				player.room.ball.kick(d.x, d.y, 10);
			}
		}
	}
	this.lastUse = Date.now();
	return true;
}

//Speed

var Speed = function(){
	this.id = 5;
	this.nom = "Vitesse";
	this.cd = 20000;
	this.range = 0; //0 = sort qui s'utilise direct ; > 0 zone ou on choisit
	this.aoe = 0; // int = zone en cercle, "direction" = fleche, "target" = cible	
	this.lastUse = 0;
	this.description = "Augmente la vitesse durant un laps de temps.";
}

Speed.prototype.use = function(player, x, y){
	if(Date.now() < this.lastUse + this.cd){
		//probleme cd
		return false;
	}

	player.boostSpeed = player.speed * 0.5;

	setTimeout(function(){
		player.boostSpeed = 0;
	}, 5 * 1000);
	
	this.lastUse = Date.now();
	return true;
}
