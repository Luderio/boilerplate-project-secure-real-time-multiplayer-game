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

//importing .mjs files
const Collectible = async function collectible() {
  const { Collectible } = await import('./public/Collectible.mjs');
}

const gameState = require('./gameState');



//============================================================


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

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

//SOCKET.IO for setting the connection from server/client
io = new socket(server);
io.on('connection', (socket) => {
  console.log('user has connected', socket.id);
  socket.on('newPlayer', () => {
    gameState.players[socket.id] = {x: getRandom(600), y: getRandom(400), score: 0, id: socket.id}
  });

  socket.on('disconnect', () => {
    console.log('user has disconnected', socket.id);
    delete gameState.players[socket.id];
  });

  setInterval(() => {
    io.sockets.emit('state', gameState);
  }, 1000 / 60);

});






module.exports = app; // For testing
