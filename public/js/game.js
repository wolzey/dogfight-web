Game = function(game) {}

Game.init = function(){
    game.stage.disableVisibilityChange = true;
}


Game.prototype = {
    preload: function() {
        //load assets
      this.game.load.image('jet','assets/jet2.png');
    	this.game.load.image('background', 'assets/tile.png');
    },
    create: function() {
        this.game.playerMap = {};
        let self = this;
        let width = this.game.width;
        let height = this.game.height;

        function addNewJet(id, x, y) {
          self.game.playerMap[id] = new EnemyJet(self.game, 'jet', x, y)
        }

        this.game.world.setBounds(-width, -height, width*4, height*4);
    	  this.game.stage.backgroundColor = '#444';

        //add tilesprite background
        var background = this.game.add.tileSprite(-width, -height,
            this.game.world.width, this.game.world.height, 'background');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.gameState = new GameState(this.game, {})
        this.game.socket = new Client(this.game).socket
        //create player
        this.game.socket.on('spawn', function (data) {
          console.log('SPAWN')
          self.game.id = data.id
          var jet = new PlayerJet(self.game, 'jet', 0, 0);
          self.game.playerMap[data.id] = jet;
          self.game.camera.follow(jet.jet);
          self.game.socket.emit('newplayer', {id: self.game.id})
        })

        this.game.socket.on('newplayer', function(data){
          addNewJet(data.id, data.x, data.y)
        })

        this.game.socket.on('enemyMoved', function(data) {
          console.log('ENEMY', data);
          console.log(self.game.playerMap)
          if (data.id === self.game.id) return
            self.game.playerMap[data.id].updateAngle(data.x, data.y, data.r)
        })

        this.game.socket.on('allplayers', function(data) {
          for(var i = 0; i < data.length; i++) {
            if (data[i].id !== self.game.id) {
              addNewJet(data[i].id,data[i].x,data[i].y)
            }
          }
        })
    },
    /**
     * Main update loop
     */
    update: function() {
        //update game components
      for (var jet in this.playerMap) {
        this.playerMap[jet].update()
      }

      for (var player in this.game.jets) {
        this.game.jets[player].update()
      }
    }
}
