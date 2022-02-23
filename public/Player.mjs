class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  playerAvatar() {
    const AVATAR_COLOR = '#c2c2c2';
    let canvas = document.getElementById('game-window');
    let context = canvas.getContext('2d');

    context.fillStyle = AVATAR_COLOR;
    context.fillRect(this.x,this.y, 40,40)

  }

  movePlayer(dir, speed) {

  }

  collision(item) {

  }

  calculateRank(arr) {

  }
}

export default Player;
