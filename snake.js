/* Author: Jonathan Stanton

*/

var SNAKE = function() {
	
	//private functions
	function randomFromTo(from, to){
       return Math.floor(Math.random() * (to - from + 1) + from);
    }

	return {
		init : function() {
			this.player = {
				direction : "right",
				score     : 0,
				time      : 0,
				speed     : 1
			};
			this.fruit = {
				value : 1,
				countdown: 0,
				// intreval: 40,
				position : {
					x : -1,
					y : -1
				}
			};
			document.all.score.innerText = this.player.score;
			clearTimeout(this.t);
			var canvas = document.getElementById('snake');  
			this.blockSize = canvas.getAttribute('data-size') * 1;
			
			this.player.blocks  = [[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize],[this.blockSize,this.blockSize]];

			this.width = canvas.getAttribute("width");
			this.height = canvas.getAttribute("height");
			this.ctx = canvas.getContext('2d');
			this.fruit.intreval = ((Math.sqrt(SNAKE.width * SNAKE.height) / 4) * 10) / this.blockSize ;
			this.status = "paused";

			this.draw_board();

			this.draw_player();
			this.draw_fruit();
			this.draw_home();

			this.frame();

			document.onkeydown = this.KeyCheck;       
		},
		KeyCheck : function(){
		   var KeyID = event.keyCode;
		   switch(KeyID) {
		      case 32:
		      switch(SNAKE.status){
		      	case "playing":
		      		SNAKE.status = "paused";
		      		SNAKE.draw_pause();
		      	break;
		      	case "paused":
		      		SNAKE.status = "playing";
		      		SNAKE.frame();
		      	break;
		      	case "gameOver":
		      		SNAKE.init();
		      	break;
		      }
		      

		      break;
		      case 37: if(SNAKE.player.direction != "right") SNAKE.player.direction = "left";  break;
		      case 38: if(SNAKE.player.direction != "down") SNAKE.player.direction = "up";    break;
		      case 39: if(SNAKE.player.direction != "left") SNAKE.player.direction = "right"; break;
		      case 40: if(SNAKE.player.direction != "up") SNAKE.player.direction = "down";  break;
		   }
		},
		draw_home  : function(){
		    var x = this.width / 2;
		    var y = this.height / 2;
		 	var font_size = (30 * ((this.width  * 1) / 400));
		    this.ctx.font = font_size + "pt Calibri";
		    this.ctx.textAlign = "center";
		    this.ctx.fillStyle = "blue";
		    this.ctx.fillText("Snake!", x, y);

		},
		draw_game_over : function(){
			var x = this.width / 2;
		    var y = this.height / 2;
		 
		    this.ctx.font = (30 * ((this.width  * 1) / 400)) + "pt Calibri";
		    this.ctx.textAlign = "center";
		    this.ctx.fillStyle = "blue";
		    this.ctx.fillText("Game Over!", x, y);
	
		},
		draw_pause : function(){
			var x = this.width / 2;
		    var y = this.height / 2;
		 
		    this.ctx.font = (30 * ((this.width  * 1) / 400)) + "pt Calibri";
		    this.ctx.textAlign = "center";
		    this.ctx.fillStyle = "blue";
		    this.ctx.fillText("Paused!", x, y);
	
		},
		draw_player : function(){
			for(var i in this.player.blocks){
				var x = this.player.blocks[i][0]
				  , y = this.player.blocks[i][1];
				this.ctx.fillStyle = "rgb(255,0,0)";
				this.ctx.fillRect(x,y,this.blockSize,this.blockSize);
			}
		},
		draw_board : function(){
			this.ctx.fillStyle = "rgb(0,0,0)"; 
	    	this.ctx.fillRect(0,0,this.width,this.height);
	    	this.ctx.clearRect(this.blockSize,this.blockSize,this.width - (this.blockSize * 2),this.height - (this.blockSize * 2));
		},
		draw_fruit : function(){

			if(this.fruit.countdown <= 0){
				var notDone = true;

				// could be slow is snake and board is large
				while(notDone){
					var x = randomFromTo(1,(this.width / this.blockSize - 2)) * this.blockSize;
					var y = randomFromTo(1,(this.height / this.blockSize - 2)) * this.blockSize;
					for(var i in this.player.blocks){
						var x2 = this.player.blocks[i][0]
						  , y2 = this.player.blocks[i][1];
						  if(x != x2 && y != y2) notDone = false;
					}
				}

				this.fruit.position.x = x;
				this.fruit.position.y = y;
				this.fruit.countdown = this.fruit.intreval;

			}else{
				var x = this.fruit.position.x,
				    y = this.fruit.position.y;
			}

			this.fruit.countdown--;
			

			this.ctx.fillStyle = "rgb(34,139,34)"; 
			this.ctx.fillRect(x,y,this.blockSize,this.blockSize);
		},
		frame : function(){

			if(this.status == "playing"){
				this.draw_board();
				this.draw_player();
				this.draw_fruit();
				this.move_player();			
				this.detect_collision();
				var difficulty = (45 / (this.player.score + 1)) + 45;

				this.t = setTimeout("SNAKE.frame()",  difficulty); //next frame
			}
		},
		move_player : function(){
			switch(this.player.direction){
				case "left"  : this.player.blocks.unshift( [this.player.blocks[0][0] - this.blockSize,this.player.blocks[0][1]]); break;
				case "right" : this.player.blocks.unshift( [this.player.blocks[0][0] + this.blockSize,this.player.blocks[0][1]]); break;
				case "up"    : this.player.blocks.unshift( [this.player.blocks[0][0],this.player.blocks[0][1] - this.blockSize]); break;
				case "down"  : this.player.blocks.unshift( [this.player.blocks[0][0],this.player.blocks[0][1] + this.blockSize]); break;
			}
			this.player.blocks.pop();
		},
		detect_collision : function(){
			
			var x = this.player.blocks[0][0];
			var y = this.player.blocks[0][1];

			if(x >= (this.width - this.blockSize) || x < this.blockSize 
			|| y >= (this.height - this.blockSize)|| y < this.blockSize){
				this. collision_player_wall();
			}
				

			if(y == this.fruit.position.y && x == this.fruit.position.x){ this.collision_fruit_player(); }
			
			for(var i in this.player.blocks){
				if(i == 0){ continue; }

				if(this.player.blocks[0][0] === this.player.blocks[i][0]
				&& this.player.blocks[0][1] === this.player.blocks[i][1]){
					this.collision_player_player();
				}
			}
			
		},
		collision_fruit_player : function(){
			this.player.score += this.fruit.value;
			this.fruit.countdown = 0;
			document.all.score.innerText = this.player.score;

			this.player.blocks.push(this.player.blocks[this.player.blocks.length - 1]); 
		},
		collision_player_wall   : function(){ this.status = "gameOver"; this.draw_game_over();  },
		collision_player_player : function(){ this.status = "gameOver";this.draw_game_over();  }
	}
		
}();

SNAKE.init();

