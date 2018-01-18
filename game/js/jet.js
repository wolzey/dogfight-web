Jet = function(game, spriteKey, x, y, name) {
  this.game = game;
  this.debug = false;
  this.spriteKey = spriteKey;
  var style = { font: "15px Arial", fill: "#000", align: "center" };

  this.text = this.game.add.text(0, 0, name, style);
  this.text.anchor.set(0.5);

  // Quantities that can be changed
  this.scale = 0.6;
  this.fastSpeed = 300;
  this.slowSpeed = 180;
  this.speed = this.slowSpeed;
  this.rotationSpeed = 40;

  this.jet = this.game.add.sprite(x, y, this.spriteKey);
  this.jet.tint = Math.random() * 0xffffff;

  this.game.physics.p2.enable(this.jet, this.debug)
  this.game.physics.p2.setImpactEvents(true)
  this.jet.body.kinematic = true

  this.jet.scale.setTo(this.scale)

  this.weapon = this.game.add.weapon(2, 'missile');
  this.weapon.tint = 0xffffff
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.bulletSpeed = 400;
  this.weapon.fireRate = 60;
  this.weapon.trackSprite(this.jet, 0, 0)

  this.jet.body.setCollisionGroup(jetGroup);
  this.jet.body.collides(bulletGroup, playerHit, this);

  // Initialize collision group
  this.collisionGroup = this.game.physics.p2.createCollisionGroup();

  this.edgeOffset = 4;
  this.edge = this.game.add.sprite(x, y - this.edgeOffset, this.spriteKey);
  this.edge.name = "edge";
  this.edge.alpha = 0;
  this.game.physics.p2.enable(this.edge, this.debug);
  this.edge.body.setCircle(this.edgeOffset);
  // this.edge.body.onBeginContact.add(this.edgeContact, this);

  this.onDestroyedCallbacks = [];
  this.onDestroyedContexts  = [];

  function playerHit(body1, body2) {
    body1.kill()
    body2.kill()
  }
}

Jet.prototype = {
  update: function() {
    let speed   = this.speed;
    this.text.x = this.jet.body.x;
    this.text.y = this.jet.body.y + 40;
    this.jet.body.moveForward(speed);
  },

  edgeContact: function(phaserBody) {
    this.destroy();
  },

  addDestroyedCallback: function(callback, context) {
    this.onDestroyedCallbacks.push(callback);
    this.onDestroyedContexts.push(context);
  }
}
