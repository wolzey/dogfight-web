PlayerJet = function (game, spriteKey, x, y, name) {
  Jet.call(this, game, spriteKey, x, y, name);
  this.cursors = game.input.keyboard.createCursorKeys();

  // handle space key to go faster!

  let fKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
  let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  let self = this;

  spaceKey.onDown.add(this.spaceKeyDown, this);
  spaceKey.onUp.add(this.spaceKeyUp, this);
  fKey.onDown.add(this.fKeyDown, this);

  this.addDestroyedCallback(function() {
    spaceKey.onDown.remove(this.spaceKeyDown, this);
    spaceKey.onUp.remove(this.spaceKeyUp, this);
    FKEY.onDown.remove(this.fKeyDown, this);
  }, this);
}

PlayerJet.prototype = Object.create(Jet.prototype);
PlayerJet.prototype.constructor = PlayerJet;

PlayerJet.prototype.fKeyDown = function () {
  let mx = this.game.input.activePointer.worldX;
  let my = this.game.input.activePointer.worldY;
  let bx = this.jet.body.x;
  let by = this.jet.body.y;
  this.weapon.bulletAngleOffset = 225;
  this.weapon.fireAngle = angleOfMovement(mx, my, bx, by) - 90;

  Client.socket.emit('playerShoot', {
    x: this.jet.body.x,
    y: this.jet.body.y,
    a: angleOfMovement(mx, my, bx, by) - 90
  })

  this.weapon.fire();
}

PlayerJet.prototype.spaceKeyDown = function () {
  this.speed = this.fastSpeed;
}

PlayerJet.prototype.spaceKeyUp = function () {
  this.speed = this.slowSpeed;
}

PlayerJet.prototype.tempUpdate = PlayerJet.prototype.update;
PlayerJet.prototype.update = function(x,y,a) {
  // find angle that the head needs to rotate
  // through in order to face the mouse

  let mousePosX = this.game.input.activePointer.worldX;
  let mousePosY = this.game.input.activePointer.worldY;
  let headX = this.jet.body.x;
  let headY = this.jet.body.y;
  let angle = (180*Math.atan2(mousePosX-headX,mousePosY-headY)/Math.PI);
  if (angle > 0) {
    angle = 180-angle;
  } else {
    angle = -180-angle;
  }

  Client.socket.emit('playerMove', {
    x: headX,
    y: headY,
    mouseX: mousePosX,
    mouseY: mousePosY,
    angle: angle
  })

  let dif = this.jet.body.angle - angle;
  this.jet.body.setZeroRotation();
  // Allow arrow keys to be used

  // if (this.cursors.left.isDown) {
  //   this.jet.body.rotateLeft(this.rotationSpeed);
  // } else if (this.cursors.right.isDown) {
  //   this.jet.body.rotateRight(this.rotationSpeed);
  // } else
  if (dif < 0 && dif > -180 || dif > 180) {
    this.jet.body.rotateRight(this.rotationSpeed)
  } else if (dif > 0 && dif < 180 || dif < -180) {
    this.jet.body.rotateLeft(this.rotationSpeed);
  }

  this.tempUpdate();
}

function angleOfMovement(mouseX, mouseY, bodyX, bodyY) {
  let angle = (180*Math.atan2(mouseX-bodyX, mouseY-bodyY)/Math.PI)
  if (angle > 0) {
    angle = 180-angle
  } else {
    angle = -180-angle
  }

  return angle;
}
