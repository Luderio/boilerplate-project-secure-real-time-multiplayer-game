import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { dimension } from './dimension.mjs';

const BACKGROUND_COLOR = '#231f20';

//stablishes the connection between client and server.
const socket = io();

let tick;
let playersList = [];
let coinEntity;
let playerEntity;


const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

function init() {

    // create user
  socket.on('init', ({ id, players, coin }) => {
    console.log(id, players,coin);
    coinEntity = new Collectible(coin);
    playerEntity = players.filter(x => x.id === id)[0];
    playerEntity = new Player(playerEntity);
  
    playersList = players

    //document.addEventListener('keydown', e);

    document.onkeydown = e => {
        console.log(e.code)
      let  dir = null
      switch(e.code) {
        case 'ArrowUp':
        case 'keyW':
           dir = 'up';
           break;
        case 'ArrowDown':
        case 'keyS':
           dir = 'down';
           break;
        case 'ArrowLeft':
        case 'KeyA':
           dir = 'left';
           break;
        case 'ArrowRight':
        case 'KeyD':
           dir = 'right';
           break;   
      }
      if (dir) {
        playerEntity.movePlayer(dir, 10);
        socket.emit('update', playerEntity);
      }
    }
  
    // update
    socket.on('update', ({players:players,coin:coin,player:player}) => {
      playersList = players;
      coinEntity = new Collectible(coin)
      if (player) {
        if (player.id === playerEntity.id) {
          playerEntity= new Player(player);
        }
      }
      
    });
  
  });
  
  window.requestAnimationFrame(gameArea); 

}

function gameArea() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    //background color of the canvas
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create border for play field
    context.strokeStyle = '#45b6fe';
    context.strokeRect(dimension.minX, dimension.minY, dimension.arenaSizeX, dimension.arenaSizeY);

    // Controls text
    context.fillStyle = '#45b6fe';
    context.font = `15px 'Press Start 2P'`;
    context.textAlign = 'center';
    context.fillText('Controls', 80, 20);
    context.textAlign = 'center';
    context.fillText('WASD', 80, 50);

    // Game title
    context.font = `50px 'Barriecito'`;
    context.fillText('Coin Race', 300, 45);

    //creates an avatar and coin.
    if (playerEntity) {
        playerEntity.playerAvatar();
        context.font = `26px 'Barriecito'`;
        context.fillText(playerEntity.calculateRank(playersList), 560, 40);
        playersList.forEach((player)=> {
           if (player.id !== playerEntity.id) {
             let p = new Player(player);
             p.playerAvatar();
           }
        });
        if (coinEntity) {
          coinEntity.collectibleCoins();
        }
      }
    
     
      tick = requestAnimationFrame(gameArea);

}

init();







