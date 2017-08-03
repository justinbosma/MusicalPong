//Gets the correct requestAnimationFrame
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
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

var wallOsc1;
var wallOsc2 = audioContext.createOscillator();
var wallOsc3 = audioContext.createOscillator();
var wallOsc4 = audioContext.createOscillator();
var paddleOsc = audioContext.createOscillator();

var volume = audioContext.createGain();
volume.gain.value = 0.1;


wallOsc2.connect(volume);
wallOsc3.connect(volume);
wallOsc4.connect(volume);
paddleOsc.connect(volume);
volume.connect(audioContext.destination);

var paddle1 = new Paddle(285, 175, 10, 100);
var ball = new Ball(200, 200, 10, "#0000FF", 1, 5);
//holds set of keys pressed
var keysDown = {};
//adds listener for keydown event
//adds key to list
window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});
//adds listener for key up event
//deleteskey from list
window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
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
	paddle1.update();

	//need to update each paddle
};
var render = function() {
	//render images
  canvasContext.fillStyle = "#FF00FF";
  canvasContext.fillRect(0, 0, width, height);
  paddle1.render();
  ball.render();
};


function Paddle(x, y, width, height) {
	this.width = width;;
	this.height = height;
	this.x = x;
	this.y = y;
	//this.color = color;

}

Paddle.prototype.render = function() {
	canvasContext.fillStyle = "#0000FF";
	canvasContext.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.update = function() {
	for(var key in keysDown) {
		var value = Number(key);
		if(value == 38) {//Up Key
			this.move(0, -5);
		}
		else if(value == 40) {//Down Key
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
			wallOsc1.stop();	
			left = false;
		}
		else {
			wallOsc1 = audioContext.createOscillator();
			wallOsc1.type = "square";
			wallOsc1.frequency.value = 220;
			wallOsc1.connect(volume);
			wallOsc1.start();
			left = true;	
		}
		
	}
	else if((this.x + 5) > width) { //Hits right wall
		this.x = width - 5;
		this.x_velocity = -this.x_velocity;
		if(right == true) {
			wallOsc2.stop();	
			right = false;
		}
		else {
			wallOsc2 = audioContext.createOscillator();
			wallOsc2.type = "square";
			wallOsc2.frequency.value = 300;
			wallOsc2.connect(volume);
			wallOsc2.start();
			right = true;	
		}
	}
	else if((this.y - 5) < 0) { //Hits top wall
		this.y = 5;
		this.y_velocity = -this.y_velocity;
		if(up == true) {
			wallOsc3.stop();	
			up = false;
		}
		else {
			wallOsc3 = audioContext.createOscillator();
			wallOsc3.type = "square";
			wallOsc3.frequency.value = 100;
			wallOsc3.connect(volume);
			wallOsc3.start();
			up = true;	
		}
	}
	else if((this.y + 5) > height) { //hits bottom wall
		this.y = height - 5;
		this.y_velocity = -this.y_velocity;
		if(down == true) {
			wallOsc4.stop();	
			down = false;
		}
		else {
			wallOsc4 = audioContext.createOscillator();
			wallOsc4.type = "square";
			wallOsc4.frequency.value = 420;
			wallOsc4.connect(volume);
			wallOsc4.start();
			down = true;	
		}
	}
};

Ball.prototype.hitPaddle = function(paddle) {
	//Left side of paddle
	if(((this.x + 5) > paddle.x) && (this.x < (paddle.x + paddle.width)) && ((this.y + 5) > paddle.y) && (this.y + 5 < (paddle.y + paddle.height))) {
		this.x = paddle.x - 5;
		this.x_velocity = -this.x_velocity;
	}
	//right side of paddle
	else if((this.x < (paddle.x + paddle.width - 5)) && (this.x > paddle.x) && ((this.y + 5) > paddle.y) && (this.y + 5 < (paddle.y + paddle.height))) {
		this.x = paddle.x + paddle.width + 5;
		this.x_velocity = -this.x_velocity;
	}
	else if((this.x > paddle.x - 5) && (this.x < paddle.x + paddle.width + 5) && (this.y > paddle.y) && (this.y < paddle.y + 5)) {
		this.y = paddle.y - 5;
		this.y_velocity = -this.y_velocity;

	}
	else if((this.x > paddle.x - 5) && (this.x < paddle.x + paddle.width + 5) && (this.y > paddle.y + paddle.height) && (this.y < paddle.y + paddle.height + 5)) {
		this.y = paddle.y + paddle.height + 5;
		this.y_velocity = -this.y_velocity;
	}
};

// need setInterval method to refresh image
//initialize screen
//onKey
//set tone to paddle
//set tone to wall