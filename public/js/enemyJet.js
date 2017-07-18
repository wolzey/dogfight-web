EnemyJet = function (game, spriteKey, x, y) {
  Jet.call(this, game, spriteKey, x, y);
}

EnemyJet.prototype = Object.create(Jet.prototype)
EnemyJet.prototype.constructor = EnemyJet;

EnemyJet.prototype.updateAngle = function (x, y, r) {
  let mousePosX = x;
  let mousePosY = y;
  let headX = this.jet.body.x;
  let headY = this.jet.body.y;
  let angle = (180*Math.atan2(mousePosX-headX,mousePosY-headY)/Math.PI);
  if (angle > 0) {
    angle = 180-angle;
  } else {
    angle = -180-angle;
  }
  let dif = this.jet.body.angle - angle;
  this.jet.body.setZeroRotation();

  if (dif < 0 && dif > -180 || dif > 180) {
    this.jet.body.rotateRight(this.rotationSpeed)
  } else if (dif > 0 && dif < 180 || dif < -180) {
    this.jet.body.rotateLeft(this.rotationSpeed);
  }
}
