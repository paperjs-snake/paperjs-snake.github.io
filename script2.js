// Only executed our code once the DOM is ready.
window.onload = function() {
	// Get a reference to the canvas object
	var canvas = document.getElementById('snakeCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);

	// affiche aléatoirement
  function dropFood() {
  var newCenter = [Math.round(Math.random()*paper.view.bounds.right), Math.round(Math.random()*paper.view.bounds.height)];
  food.position = newCenter;
  }

	// arrete le snake
  function stopSnake() {
  	clearInterval(timer);
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
			dropFood();
			var mPoint = new paper.Point( (segments[4].point.x), segments[4].point.y );
		  path.add(mPoint);
			size++;
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
		} else if(path.bounds.right > 800){
			return true;
		}
    return false;
  }

	// boucle toutes les 500
  function onTick() {
		// collision avec bouffe ?
		collision_food();
		// collision avec le reste ?
    if ( collision_all() ) {
      document.getElementById("perdu").style.visibility = "visible";
    }
		 else {
      direction = newDirection;
      moveSnake();
    }
      paper.view.draw();
  }
	// initialise le timer avec 500
	var timer = setInterval(onTick, 500);

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
        if (direction[1] != 10) { // not down
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

    // Agrandissement du canvas
    var wid = paper.view.size.width;
    var heig= paper.view.size.height;
    paper.view.setViewSize(wid*2.6, heig*2.5);


      var path = new paper.Path();
      path.style = {
        strokeColor: 'blue',
        strokeWidth: 12,
        strokeCap: 'square'
      };

      var size = 5;
      var segments = path.segments;

      var startVec = [10, 1];
      var start = [];
      start[0] = paper.view.center.x;
      start[1] = paper.view.center.y;

      var point = start;
      var direction = [0, 10];
      var newDirection = direction;

      // start
      var pos = [10, 0];
      for (var i = 0; i < size; i++) {
        /*pos += start;*/
        var mPoint = new paper.Point( start[0]+(i * pos[0]), start[1]+pos[1] );
        path.add(mPoint);
      }
      var food = new paper.Path.Circle(new paper.Point(0, 0), 4);
      food.style = {
        fillColor: 'red'
      };
			// affiche la premiere bouffe
      dropFood();
}
