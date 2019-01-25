/**
 * 
 */
var cWidth = 800, cHeight = 1000;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var dx = 3, // Änderung 3 pixel je frame, also 180 pixel pro sec (speed)
dy = 3, radius = 30;
var arrBalls = []; // array für die Ballsobjekte
var CountBubbles = 0;
var CountBumps = 0;

var slider = document.getElementById("myRange");
slider.oninput = function() {
	radius = Number(this.value);
}

function loadInit() {

	canvas.width = cWidth;
	canvas.height = cHeight;

	canvas.addEventListener('click', onclick, false);

	window.requestAnimationFrame(animate);
}
// Bei jedem click kommt ein neuer Bubble dazu
function onclick(ev) {
	var x = ev.clientX - canvas.offsetLeft;
	var y = ev.clientY - canvas.offsetTop;
	var color = randomColor();
	var found = false; // wurde ein bestehender Bubble angekreuzt

	var b1 = new Bubble(x, y, radius, dx, dy, color);

	// Neuen Bubble nur erzeugen, wenn kein anderer getroffen wurde
	for (var i = 0; i < arrBalls.length; i++) {
		if (collision(b1, arrBalls[i]) == true) {
			found = true;
			break;
		}
	}
	if (found == false) {
		arrBalls.push(b1);
		CountBubbles++;
		document.getElementById("nb_bubbles").innerHTML = CountBubbles;
	}
}

// var b1 = new Bubble(200,200,radius);
//
// window.requestAnimationFrame(animate);

// Constructor function mit Großbuchstaben = Klasse
function Bubble(x, y, radius, dx, dy, color) {
	this.x = x; // Attribut x
	this.y = y;
	this.r = radius;
	this.dx = dx;
	this.dy = dy;

	this.display = function() {
		// x,y = center; Winkelstart = 0; Winkelende = 2PI; false = clockwise
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
	this.move = function(j) {
		var xold = 0, yold = 0;
		if (this.x + this.r > canvas.width || this.x - this.r < 0) {
			this.dx = -this.dx;
		}
		if (this.y + this.r > canvas.height || this.y - this.r < 0) {
			this.dy = -this.dy;
		}
		// 
		for (var i = j + 1; i < arrBalls.length; i++) {
			// Vergleich paarweise nur einmal
			if (collision(this, arrBalls[i]) == true) {
				// Die Kugeln tauschen die Richtung
				xold = this.dx;
				yold = this.dy;
				this.dx = arrBalls[i].dx;
				this.dy = arrBalls[i].dy;
				arrBalls[i].dx = xold;
				arrBalls[i].dy = yold;
				CountBumps++;
				document.getElementById("nb_bumps").innerHTML = CountBumps;
				break;
			}
		}
		this.x += this.dx;
		this.y += this.dy;
		this.display();
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < arrBalls.length; i++) {
		arrBalls[i].move(i);
	}
	window.requestAnimationFrame(animate); // 60 frames pro sec
}

function randomColor() {
	var color = [];
	for (var i = 0; i < 3; i++) {
		color.push(Math.floor(Math.random() * 256));
	}
	return 'rgb(' + color.join(',') + ')';
}

function collision(b1, b2) {
	if (distance(b1, b2) <= b1.r + b2.r) {
		return true;
	} else {
		return false;
	}
}

function distance(b1, b2) {
	return Math.pow(Math.pow((b2.x - b1.x), 2) + Math.pow((b2.y - b1.y), 2),
			0.5);
}

// function animate2(){
//
// var add = 0;
//	
// var id = setInterval(function() {
// if (add >= 500) {
// clearInterval(id);
// } else {
// b1.move();
// }
// }, 1);
// }
