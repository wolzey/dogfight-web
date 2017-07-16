Game = function(game) {}

Game.prototype = {
    preload: function() {
        //load assets
      this.game.load.image('jet','assets/jet2.png');
    	this.game.load.image('background', 'assets/tile.png');
    },
    create: function() {
        let width = this.game.width;
        let height = this.game.height;

        this.game.world.setBounds(-width, -height, width*4, height*4);
    	  this.game.stage.backgroundColor = '#444';

        //add tilesprite background
        var background = this.game.add.tileSprite(-width, -height,
            this.game.world.width, this.game.world.height, 'background');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.game.snakes = [];

        //create player
        var jet = new PlayerJet(this.game, 'jet', 0, 0);
        this.game.camera.follow(jet.jet);
    },
    /**
     * Main update loop
     */
    update: function() {
        //update game components
        for (var i = this.game.jets.length - 1 ; i >= 0 ; i--) {
            this.game.jets[i].update();
        }
    }
};
