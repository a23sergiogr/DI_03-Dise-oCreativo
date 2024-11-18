document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("downloadButton").addEventListener('click', () => {
        document.getElementById("downloadButton").style.display = "none";
        changeZIndex();
    });
});

function changeZIndex() {
    const pacmanSpeed = 8;
    const pacmanOpen = document.querySelector('.pacman-open');
    const pacmanClose = document.querySelector('.pacman-close');
    const background = document.querySelector('#background');

    const fruits = [
        document.getElementById("sF1"),
        document.getElementById("sF2"),
        document.getElementById("sF3"),
        document.getElementById("sF4"),
        document.getElementById("sF5"),
        document.getElementById("fruit"),
    ];

    if (!background.style.left) background.style.left = '0px';
    if (!pacmanOpen.style.left) pacmanOpen.style.left = '0px';
    if (!pacmanClose.style.left) pacmanClose.style.left = '0px';

    let gameInterval; // Guardar referencia del intervalo para detenerlo después

    function getElementRect(element) {
        return element.getBoundingClientRect();
    }

    // Función para comprobar colisiones entre Pacman y las frutas
    function checkCollision() {
        const pacmanRect = getElementRect(pacmanOpen); // Posición de Pacman

        fruits.forEach((fruit, index) => {
            if (fruit.style.display !== 'none') {
                const fruitRect = getElementRect(fruit);
                if (checkOverlap(pacmanRect, fruitRect)) {
                    console.log(`Pacman se comió la fruta ${index + 1}`);
                    fruit.style.display = 'none'; // Desaparece la fruta
                }
            }
        });

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Verificar si todas las frutas han sido comidas
        const allFruitsEaten = fruits.every(fruit => fruit.style.display === 'none');
        if (allFruitsEaten) {
            console.log("Pacman se comió todas las frutas. Deteniendo el juego.");
            clearInterval(gameInterval); 
            sleep(1000).then(() => {
                document.getElementById("downloadCompleteButton").style.display = "block"; // Mostrar el botón de descarga completada
            });
        }
    }


    // Comprobar si los rectángulos de Pacman y la fruta se solapan
    function checkOverlap(pacmanRect, fruitRect) {
        return (
            pacmanRect.x + pacmanSpeed <= fruitRect.right &&
            pacmanRect.x + pacmanSpeed >= fruitRect.left
        );
    }

    if (pacmanOpen && pacmanClose && background) {
        gameInterval = setInterval(() => {
            if (pacmanOpen.style.zIndex == 3) {
                background.style.left = '' + (parseInt(background.style.left) + pacmanSpeed) + 'px';
                pacmanOpen.style.left = '' + (parseInt(pacmanOpen.style.left) + pacmanSpeed) + 'px';
                pacmanClose.style.left = '' + (parseInt(pacmanClose.style.left) + pacmanSpeed) + 'px';

                pacmanOpen.style.zIndex = 0;
                pacmanClose.style.zIndex = 3;

                checkCollision(); // Llamada a la detección de colisiones
            } else {
                pacmanOpen.style.zIndex = 3;
                pacmanClose.style.zIndex = 0;
            }
        }, 200);
    }
}
