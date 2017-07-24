EnemyJet = function (game, spriteKey, x, y) {
  Jet.call(this, game, spriteKey, x, y)
}

EnemyJet.prototype = Object.create(Jet.prototype)
EnemyJet.prototype.constructor = EnemyJet

// Need to access method that updates position of jet
EnemyJet.prototype.updatePosition = function(data) {
  let mousePosX = data.mouseX;
  let mousePosY = data.mouseY;
  this.jet.body.x = data.x;
  this.jet.body.y = data.y;
  let angle = (180*Math.atan2(mousePosX-this.jet.body.x,mousePosY-this.jet.body.y)/Math.PI);
  if (angle > 0) {
    angle = 180-angle;
  } else {
    angle = -180-angle;
  }

  let dif = this.jet.body.angle - angle;

  this.jet.body.setZeroRotation()

  if (dif < 0 && dif > -180 || dif > 180) {
    this.jet.body.rotateRight(this.rotationSpeed)
  } else if (dif > 0 && dif < 180 || dif < -180) {
    this.jet.body.rotateLeft(this.rotationSpeed);
  }
}

EnemyJet.prototype.shoot = function (data) {
  this.weapon.bulletAngleOffset = 225;
  this.weapon.fireAngle = data.a;
  this.weapon.fire()
}
