$(document).ready(function() {
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //Cell width
    var cw = 10;
    var d;
    var food;
    var score;

    var snake_array; // Array de celdas que representa la serpiente
    var keyPressed = false; // Estado para evitar múltiples direcciones simultáneas
	var nextKey;

    $("#volumenButton").click(function() {
        $("#canvas").show();
        d = "right"; // Dirección inicial
        create_snake();
        create_food(); // Crear la comida
        score = 0;

        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 120);
    });

    function create_snake() {
        var length = 5; // Longitud inicial de la serpiente
        snake_array = [];
        for (var i = length - 1; i >= 0; i--) {
            snake_array.push({ x: i, y: 0 });
        }
    }

    function create_food() {
        food = {
            x: Math.round(Math.random() * (w - cw) / cw),
            y: Math.round(Math.random() * (h - cw) / cw),
        };
    }

    function paint() {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        var nx = snake_array[0].x;
        var ny = snake_array[0].y;

        // Mover según la dirección actual
        if (d == "right") nx++;
        else if (d == "left") nx--;
        else if (d == "up") ny--;
        else if (d == "down") ny++;

        // Comprobar colisiones
        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
            $("#canvas").hide();
            clearInterval(game_loop);
            return;
        }

        // Comprobar si la serpiente ha comido la comida
        var tail;
        if (nx == food.x && ny == food.y) {
            tail = { x: nx, y: ny };
            score++;
            create_food();
        } else {
            tail = snake_array.pop();
            tail.x = nx; 
            tail.y = ny;
        }

        snake_array.unshift(tail); // Añadir la nueva cabeza al inicio

        // Dibujar la serpiente
        for (var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }

        // Dibujar la comida
        paint_cell(food.x, food.y);

        // Actualizar el puntaje
        document.getElementById('volume-label').innerHTML = "Volumen: " + score + "%";

        // Permitir una nueva pulsación de tecla
        keyPressed = false;
    }

    function paint_cell(x, y) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    function check_collision(x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    $(document).keydown(function(e) {
        var key = e.which;

        // Cambiar de dirección si no hay pulsación previa activa
        if (!keyPressed) {
            if (key == "37" && d != "right") d = "left";
            else if (key == "38" && d != "down") d = "up";
            else if (key == "39" && d != "left") d = "right";
            else if (key == "40" && d != "up") d = "down";

            keyPressed = true; // Establecer la pulsación como activa
        }
    });
});
