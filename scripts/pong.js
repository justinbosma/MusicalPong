var canvas;
var context;
var dx


function Paddle(width, height, color, x, y) {
	this.width = width;;
	this.height = height;
	this.x = x;
	this.y = y;
	this.color = color;

}

Paddle.protype.render = function() {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height)
}

Paddle.prototype.move = function() {

}

function Ball(x, y, r, color, x_velocity, y_velocity) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.color = color;
	this.x_velocity = x_velocity;
	this.y_velocity = y_velocity
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI*2, true);
	context.fillStyle = color;
	context.fill();
}

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.r, Math.PI*2, false);
	context.fillStyle = this.color;
	context.fill();
}
//Needs to take in paddles as arguments
Ball.prototype.update = function() {
	this.x = this.x + this.x_velocity;
	this.y = this.y + this.y_velocity;

	if((this.x - 5) < 0) { //Hits left wall
		this.x = 5;
		this.x_velocity = -this.x_velocity;
	}
	else if((this.x + 5) > 300) { //Hits right wall
		this.x = 295;
		this.x_velocity = -this.x_velocity;
	}
	else if((this.y - 5) < 0) { //Hits top wall
		this.y = 5;
		this.y_velocity = -this.y_velocity;
	}
	else if((this.y + 5) > 300) { //hits bottom wall
		this.y = 295;
		this.y_velocity = -this.y_velocity;
	}
}

var hitPaddle = function(ball, paddle) {
	if(ball.x + 5 > paddle.x)
}

function initialize() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	return setInterval(draw, 10);

}

var update = function() {
	ball.update;
	//need to update each paddle
}

// need setInterval method to refresh image
//initialize screen
//onKey
//set tone to paddle
//set tone to wall