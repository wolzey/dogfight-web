PlayerJet = function (game, spriteKey, x, y) {
  Jet.call(this, game, spriteKey, x, y);
  this.cursors = game.input.keyboard.createCursorKeys();

  // handle space key to go faster!
  let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  let self = this;
  spaceKey.onDown.add(this.spaceKeyDown, this);
  spaceKey.onUp.add(this.spaceKeyUp, this);
  this.addDestroyedCallback(function() {
    spaceKey.onDown.remove(this.spaceKeyDown, this);
    spaceKey.onUp.remove(this.spaceKeyUp, this);
  }, this);
}

PlayerJet.prototype = Object.create(Jet.prototype);
PlayerJet.prototype.constructor = PlayerJet;

PlayerJet.prototype.spaceKeyDown = function () {
  this.speed = this.fastSpeed;
}

PlayerJet.prototype.spaceKeyUp = function () {
  this.speed = this.slowSpeed;
}

PlayerJet.prototype.tempUpdate = PlayerJet.prototype.update;
PlayerJet.prototype.update = function() {
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
  let dif = this.jet.body.angle - angle;
  this.jet.body.setZeroRotation();
  // Allow arrow keys to be used

  if (this.cursors.left.isDown) {
    this.jet.body.rotateLeft(this.rotationSpeed);
  } else if (this.cursors.right.isDown) {
    this.jet.body.rotateRight(this.rotationSpeed);
  } else if (dif < 0 && dif > -180 || dif > 180) {
    this.jet.body.rotateRight(this.rotationSpeed)
  } else if (dif > 0 && dif < 180 || dif < -180) {
    this.jet.body.rotateLeft(this.rotationSpeed);
  }

  this.tempUpdate();
}
