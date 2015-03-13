var Maths = {
	distance:function(x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	},
	getDirection:function(x1, y1, x2, y2){
		var distx = Math.abs(x2 - x1);
		var disty = Math.abs(y2 - y1);
		var px = distx/(distx + disty);
		var py = 1 - px;
		var signex = 1;
		if(x2 < x1){
			signex = -1;
		}
		signey = 1;
		if(y2 < y1){
			signey = -1;
		}
		return {"x":px*signex,"y":py*signey};
	}
}