//Gets the correct requestAnimationFrame
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
var canvas = document.createElement('canvas');
var width = 1000;
var height = 1000;
canvas.width = width;
canvas.height = height;
var canvasContext = canvas.getContext('2d');
var audioContext = new AudioContext();
//booleans for when to turn wall sound on or off 
//couldn't find clean way to find if audioNode is started
var left = false;
var right = false;
var up = false;
var down = false;

//Keeps track of which paddle is active
var active = [true, false, false, false, false];
var activeIndex = 0;

var osc;
var gain = audioContext.createGain();
var reverb;
var delay;
var distortion = audioContext.createWaveShaper();
var bandPassFilter = audioContext.createBiquadFilter
var pan =  audioContext.createPanner();

var volume = audioContext.createGain();
volume.gain.value = 0.1;



var paddle1 = new Paddle(100, 175, 10, 100, active[0], 0, 220);
var paddle2 = new Paddle(300, 175, 10, 100, active[1], 1, 420);
var paddle3 = new Paddle(500, 175, 10, 100, active[2], 2, 220);
var paddle4 = new Paddle(700, 175, 10, 100, active[3], 3, 420);
var paddle5 = new Paddle(900, 175, 10, 100, active[4], 4, 220);
var ball = new Ball(200, 200, 10, "#0000FF", 1, 5);
//holds set of keys pressed
var keysDown = {};
//flag for key down
var isKeyDown = false;
//adds listener for keydown event
//adds key to list
window.addEventListener("keydown", function(event) {
	if(Number(event.keyCode) == 38 || Number(event.keyCode) == 40 ) {
		keysDown[event.keyCode] = true;
	}
	else if(isKeyDown == false) {
		keysDown[event.keyCode] = true;
		isKeyDown = true;
		if(activeIndex < 5 && Number(event.keyCode == 39)) {
			active[activeIndex] = false;
			activeIndex = activeIndex + 1;
			active[activeIndex] = true;	
		}
		else if(activeIndex > 0 && Number(event.keyCode == 37)) {
			active[activeIndex] = false;
			activeIndex = activeIndex - 1;
			active[activeIndex] = true;
		}
	}
	else {}
});
//adds listener for key up event
//deleteskey from list
window.addEventListener("keyup", function(event) {
  
  if(isKeyDown == true || Number(event.keyCode) == 38 || Number(event.keyCode) == 40) {
  	delete keysDown[event.keyCode];
  	isKeyDown = false;
  }
});

window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};

var step = function() {
	//Calls update function
	update();
	//renders images
	render();
	//calls step again
	animate(step);
};

var update = function() {
	ball.update(); 
	ball.hitPaddle(paddle1);
	ball.hitPaddle(paddle2);
	ball.hitPaddle(paddle3);
	ball.hitPaddle(paddle4);
	ball.hitPaddle(paddle5);
	paddle1.update();
	paddle2.update();
	paddle3.update();
	paddle4.update();
	paddle5.update();

	//need to update each paddle
};
var render = function() {
	//render images
  canvasContext.fillStyle = "#FF00FF";
  canvasContext.fillRect(0, 0, width, height);
  paddle1.render();
  paddle2.render();
  paddle3.render();
  paddle4.render();
  paddle5.render();  
  ball.render();
};

//active: boolean -> if true, paddle is controlled by up/down
function Paddle(x, y, width, height, active, paddleNumber, frequency) {
	this.width = width;;
	this.height = height;
	this.x = x;
	this.y = y;
	this.active = active;
	this.paddleNumber= paddleNumber;
	this.frequency = frequency;

	//this.color = color;

}

Paddle.prototype.render = function() {
	canvasContext.fillStyle = "#0000FF";
	canvasContext.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.update = function() {
	this.active = active[this.paddleNumber]

	for(var key in keysDown) {
		var value = Number(key);

		if(value == 38 && this.active == true) {//Up Key
			this.move(0, -5);
		}
		else if(value == 40 && this.active == true) {//Down Key
			this.move(0, 5);
		}
	}
};

Paddle.prototype.move = function(x, y) {
	this.x = this.x + x;
	this.y = this.y + y;
	this.x_velocity = x;
	this.y_velocity = y;
	if(this.y < 0) {
		this.y = 0;
		this.y_velocity = 0;
	}
	else if(this.y + this.height > height) {
		this.y = height - this.height;
		this.y_velocity = 0;
	}
};

function Ball(x, y, r, color, x_velocity, y_velocity) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.color = color;
	this.x_velocity = x_velocity;
	this.y_velocity = y_velocity;
	canvasContext.beginPath();
	canvasContext.arc(x, y, r, 0, Math.PI*2, true);
	canvasContext.fillStyle = color;
	canvasContext.fill();
}

Ball.prototype.render = function() {
	canvasContext.beginPath();
	canvasContext.arc(this.x, this.y, this.r, Math.PI*2, false);
	canvasContext.fillStyle = this.color;
	canvasContext.fill();
};
//Needs to take in paddles as arguments
Ball.prototype.update = function() {
	this.x = this.x + this.x_velocity;
	this.y = this.y + this.y_velocity;

	if((this.x - 5) < 0) { //Hits left wall
		this.x = 5;
		this.x_velocity = -this.x_velocity;
		if(left == true) {

			left = false;
		}
		else {

			left = true;	
		}
		
	}
	else if((this.x + 5) > width) { //Hits right wall
		this.x = width - 5;
		this.x_velocity = -this.x_velocity;
		if(right == true) {
	
			right = false;
		}
		else {

			right = true;	
		}
	}
	else if((this.y - 5) < 0) { //Hits top wall
		this.y = 5;
		this.y_velocity = -this.y_velocity;
		if(up == true) {
			up = false;
		}
		else {

			up = true;	
		}
	}
	else if((this.y + 5) > height) { //hits bottom wall
		this.y = height - 5;
		this.y_velocity = -this.y_velocity;
		if(down == true) {

			down = false;
		}
		else {

			down = true;	
		}
	}
};

Ball.prototype.hitPaddle = function(paddle) {
	var hit = false;
	//Left side of paddle
	if(((this.x + 5) > paddle.x) && (this.x < (paddle.x + paddle.width)) && ((this.y + 5) > paddle.y) && (this.y + 5 < (paddle.y + paddle.height))) {
		this.x = paddle.x - 5;
		this.x_velocity = -this.x_velocity;
		hit = true;
	}
	//right side of paddle
	else if((this.x < (paddle.x + paddle.width - 5)) && (this.x > paddle.x) && ((this.y + 5) > paddle.y) && (this.y + 5 < (paddle.y + paddle.height))) {
		this.x = paddle.x + paddle.width + 5;
		this.x_velocity = -this.x_velocity;
		hit = true;
	}
	else if((this.x > paddle.x - 5) && (this.x < paddle.x + paddle.width + 5) && (this.y > paddle.y) && (this.y < paddle.y + 5)) {
		this.y = paddle.y - 5;
		this.y_velocity = -this.y_velocity;
		hit = true;

	}
	else if((this.x > paddle.x - 5) && (this.x < paddle.x + paddle.width + 5) && (this.y > paddle.y + paddle.height) && (this.y < paddle.y + paddle.height + 5)) {
		this.y = paddle.y + paddle.height + 5;
		this.y_velocity = -this.y_velocity;
		hit = true;
	}

	if(hit == true) {

	}


};

// need setInterval method to refresh image
//initialize screen
//onKey
//set tone to paddle
//set tone to wall