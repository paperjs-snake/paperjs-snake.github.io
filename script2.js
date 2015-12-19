// Only executed our code once the DOM is ready.
window.onload = function() {
	// Get a reference to the canvas object
	var canvas = document.getElementById('snakeCanvas');

	// Create an empty project and a view for the canvas:
	paper.setup(canvas);

  // Agrandissement du canvas
  var wid = paper.view.size.width;
  var heig= paper.view.size.height;
  paper.view.setViewSize(wid*2.6, heig*2.5);

	// Un seul click possible par session
	var GameOn = false;
	var restart= false;
	var food;
	var newDirection = [];
	var segments = [];
	var size = 0;
	var path;
	var direction = newDirection;
	var timer;
	var score = 0;

	// affiche aléatoirement la bouffe
	function dropFood() {
		var newCenter = [Math.round(Math.random()*paper.view.bounds.right), Math.round(Math.random()*paper.view.bounds.height)];
		food.position = newCenter;
	}

	// initialise le snake
	function initialize() {
		// creation de la tete
	  path = new paper.Path();
	  path.style = {
	    strokeColor: 'blue',
	    strokeWidth: 12,
	    strokeCap: 'square'
	  };
		// nombre d'elements du snake au depart
	  size = 5;
		// segments composant le snake
	  segments = path.segments;
	  var start = [];
	  start[0] = paper.view.center.x;
	  start[1] = paper.view.center.y;
		// direction aleatoire
		var dX = 0;
		var dY = dX;
		while(dX === dY) {
			var dX = Math.floor(Math.random() * 11) - 10;
			if(dX < -4) {
				dX = -10;
			} else if(dX < 0) {
				dX = 0;
			} else if(dX > 4) {
				dX = 10;
			}
			var dY = Math.floor(Math.random() * 11) - 10;
			if(dY < -4) {
				dY = -10;
			} else if(dY < 0) {
				dY = 0;
			} else if(dY > 4) {
				dY = 10;
			}
	  }
	  direction = [0, -10];
	  newDirection = [dX, dY];
	  // creation et position du snake de size elements
	  var pos = [-10, 0];
	  for (var i = 0; i < size; i++) {
	    var mPoint = new paper.Point(start[0] + (i * pos[0]), start[1] + pos[1]);
	    path.add(mPoint);
	  }
		// creation de la bouffe
	  food = new paper.Path.Circle(new paper.Point(0, 0), 4);
	  food.style = {
	    fillColor: 'red'
	  };
		// affiche la premiere bouffe
	  dropFood();
		// Empeche le restart avec le bouton
		GameOn = true;
	}

	// deplace snake
	function moveSnake() {
		var previousPoint = new paper.Point(segments[0].point);
		segments[0].point.x += direction[0];
		segments[0].point.y += direction[1];
		for (var i = 1; i < size; i++) {
			var tempPoint = new paper.Point(segments[i].point);
			segments[i].point = new paper.Point(previousPoint.x, previousPoint.y);
			previousPoint = tempPoint;
		}
	}

	// detecte les collisions avec la bouffe
	function collision_food() {
		if(path.hitTest(food.position) !== null) {
			// nouvelle bouffe aléatoire
			dropFood();
			// rajoute un morceau au snake
			var mPoint = new paper.Point( (segments[4].point.x), segments[4].point.y );
			path.add(mPoint);
			size++;
			// score
			score += 10;
			var sco = document.getElementById("myScore");
			console.log(sco);
			sco.value = score;
		}
	}

	// autres collisions
	function collision_all() {
		var nextPoint = segments[0].point + direction;
		for (var i = 0; i < size-1; i++) {
			if (nextPoint == segments[i].point) {
				return true;
			}
		}
		// test les bords
		if(path.bounds.top < 0){
			return true;
		} else if(path.bounds.bottom > 420){
			return true;
		} else if(path.bounds.left < 0){
			return true;
		} else if(path.bounds.right > 820){
			return true;
		}
		return false;
	}

	// boucle toutes les 100ms
	function onTick() {
		// collision avec bouffe ?
		collision_food();
		// collision avec le reste ?
		if ( collision_all() ) {
			// affiche le texte
			document.getElementById("perdu").style.visibility = "visible";
			// accepte le restart
			GameOn = false;
			restart = true;
		}
		else {
			direction = newDirection;
			moveSnake();
		}
		paper.view.draw();
	}

	// start avec le bouton
	document.getElementById("start").onclick = function() { startGame() };
	function startGame() {
		// empeche le restart avant la fin
		if(!GameOn) {
			// efface tout pour le restart
			if(restart) {
				paper.project.activeLayer.removeChildren();
				restart = false;
				clearInterval(timer);
				document.getElementById("perdu").style.visibility = "hidden";
			}
			// re init apres restart
			if(!restart)
				initialize();

			// defini un tool
			var tool = new paper.Tool();
			// empeche le scrolling de la page
			tool.onKeyDown = function (event) {
				switch(event.key) {
				case 'up':
					event.preventDefault();
				break;
				case 'down':
					event.preventDefault();
				break;
				case 'left':
					event.preventDefault();
				break;
				case 'right':
					event.preventDefault();
				break;
				}
			}
			// deplace le snake suivant les touches de direction
			tool.onKeyUp = function (event) {
			  switch(event.key) {
			    case 'up':
			      if (direction[1] != 10) {
			        newDirection = [0, -10];
			      }
			    break;
			    case 'down':
			      if (direction[1] != -10) {
			        newDirection = [0, 10];
			      }
			    break;
			    case 'left':
			      if (direction[0] != 10) {
			        newDirection = [-10, 0];
			      }
			    break;
			    case 'right':
			      if (direction[0] != -10) {
			        newDirection = [10, 0];
			      }
			    break;
			  }
			}
			// initialise le timer avec 100
			timer = setInterval(onTick, 100);
		}
	}
}
