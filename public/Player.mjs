import { dimension } from './dimension.mjs';
class Player {
  constructor({x, y, score, id, radius = 30}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;

    this.radius = radius;
  }

  playerAvatar() {
    const AVATAR_COLOR = '#c2c2c2';
    let canvas = document.getElementById('game-window');
    let context = canvas.getContext('2d');

    context.fillStyle = AVATAR_COLOR;
    context.fillRect(this.x,this.y, 40,40)

  }

  movePlayer(dir, speed) {
    switch(dir) {
      case 'up':
        this.y  = Math.max(dimension.minY+this.radius, this.y - speed);
        break;
      case 'down':
        this.y  = Math.min(dimension.maxY-this.radius, this.y + speed);
        break;
      case 'left':
        this.x  = Math.max(dimension.minX+this.radius, this.x - speed);
        break;
      case 'right':
        this.x  = Math.min(dimension.maxX-this.radius, this.x + speed);
        break;
    }
  }

  collision(item) {
    var dx = this.x - item.x;
    var dy = this.y - item.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + item.radius) {
      return true;
    }
    return false;
  }

  calculateRank(arr) {
    const sort = arr.sort((a, b) => b.score - a.score);
    let position = 0
    sort.forEach((player, index) => {
      if(this.id === player.id) position = index+1;
    });

    return `Rank: ${position} / ${arr.length}`;
  }

}

try {
  module.exports = Player;
} catch(e) {}

export default Player;
