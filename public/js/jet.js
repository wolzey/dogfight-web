Jet = function(game, spriteKey, x, y) {
  this.game = game;

  if (!this.game.jets) {
    this.game.jets = [];
  }
  
  this.game.jets.push(this);
  this.debug = false;
  this.spriteKey = spriteKey;

  // Quantities that can be changed
  this.scale = 0.6;
  this.fastSpeed = 200;
  this.slowSpeed = 130;
  this.speed = this.slowSpeed;
  this.rotationSpeed = 40;

  this.jet = this.game.add.sprite(x, y, this.spriteKey);
  this.game.physics.p2.enable(this.jet, this.debug)
  this.jet.body.collides([]);
  this.jet.body.kinematic = true

  this.jet.scale.setTo(this.scale)

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
}

Jet.prototype = {
  update: function() {
    let speed = this.speed;
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
