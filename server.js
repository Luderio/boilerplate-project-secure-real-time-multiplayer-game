require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const noCache = require('nocache')
const http = require('http');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

//--------------SECURITY-------------

//mounted the helmet.hidePoweredBy() middleware to hide the "X-Powered-By: Express" header.
app.use(helmet.hidePoweredBy({setTo: 'PHP 7.4.3'}));

// mounted helmet.noSniff() to Avoid Inferring the Response MIME Type.
app.use(helmet.noSniff({}));

// mounted helmet.xssFilter() to prevent basic XSS attacks.
app.use(helmet.xssFilter({}));

// mounted helmet.noCache() to Disable Client-Side Caching.
app.use(noCache());


//----------END OF SECURITY----------


app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

//importing .mjs files
const Player = require('./public/Player');
const Collectible = require('./public/Collectible');
const {dimension} = require('./public/dimension');
//============================================================

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomPosition = () => {
  let x = random(dimension.minX+50, dimension.maxX-50);
  let y = random(dimension.minY+50, dimension.maxY-50);
  x = Math.floor(x/10) * 10;
  y = Math.floor(y/10) * 10;

  return [x,y];
}

let playersList = [];
let [coinX,coinY] = getRandomPosition();
let coin = new Collectible({x:coinX,y:coinY,value:1, id:Date.now()})
let connections = [];

//SOCKET.IO for setting the connection from server/client
io = socket(server);
io.on('connection', (socket) => {
  console.log('user has connected', socket.id);
  connections.push(socket);
  console.log('Connected: %s sockets connected.',connections.length);

  let [positionX,positionY] = getRandomPosition();
  let player = new Player({x:positionX,y:positionY,score:0,id:socket.id});

  playersList.push(player);

  socket.emit('init', {id: socket.id, players: playersList, coin: coin});

  socket.on('update', (updatedUser) => {
    playersList.forEach(user => {
        if(user.id === socket.id){
            user.x = updatedUser.x;
            user.y = updatedUser.y;
            user.score = updatedUser.score;
        }
    });
    io.emit('update', {players: playersList, coin: coin, player: null});
});

  

socket.on('disconnect', () => {
  console.log(`deconnection ${socket.id}`);
  socket.broadcast.emit('remove-player', socket.id);
  connections.splice(connections.indexOf(socket), 1);
  playersList = playersList.filter(player => player.id !== socket.id);
  console.log('Disconnected: %s sockets connected.', connections.length);
});

});

setInterval(tick, 1000/60); 
function tick() {
    let playerUpdate = null;

    playersList.forEach(player => {
  
      let p = new Player(player);
      if (p.collision(coin)) {
        player.score += 1;
        let [coinX,coinY] = getRandomPosition();
        coin = new Collectible({x:coinX,y:coinY,value:1, id:Date.now()})
        playerUpdate = player;
      }
    });
    
    io.emit('update', {
      players: playersList,
      coin: coin,
      player: playerUpdate
    });
  }












module.exports = app; // For testing
