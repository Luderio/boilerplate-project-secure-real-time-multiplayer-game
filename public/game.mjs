import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const BACKGROUND_COLOR = '#231f20';

//stablishes the connection between client and server.
const socket = io();

let canvas, context;

function gameArea() {
    canvas = document.getElementById('game-window');
    context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480

    //background color of the canvas
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', keydown);
}
gameArea();

let newPlayer


function keydown(event) {
    console.log(event.keyCode)
}

socket.emit('newPlayer');

socket.on('state', (gameState) => {
    for (let player in gameState.players) {
        let newPlayer = new Player(gameState.players[player]);
        newPlayer.playerAvatar();
    }
});


