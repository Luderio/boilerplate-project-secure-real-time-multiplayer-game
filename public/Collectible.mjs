class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.radius = 20
  }

collectibleCoins() {
  const COIN_COLOR = '#FFFFFF'
  let canvas = document.getElementById('game-window');
  let context = canvas.getContext('2d');

  context.fillStyle = COIN_COLOR;
  context.fillRect(this.x-this.radius, this.y-this.radius, 10,10)
}

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
