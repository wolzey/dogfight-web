Game = function(game) {}

Game.playerMap = {}
Game.enemyMap  = {}

Game.prototype = {
    init: function() {
      this.game.stage.disableVisibilityChange = true
    },
    preload: function() {
        //load assets
      this.game.load.image('jet','assets/jet2.png');
    	this.game.load.image('background', 'assets/tile.png');
      this.game.load.image('missile', 'assets/missile.png');
    },
    create: function() {
        let width = this.game.width;
        let height = this.game.height;
        let self = this;

        this.game.world.setBounds(-width, -height, width*4, height*4);
    	  this.game.stage.backgroundColor = '#444';

        //add tilesprite background
        var background = this.game.add.tileSprite(-width, -height,
            this.game.world.width, this.game.world.height, 'background');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        // create player
        Client.askNewPlayer()

        Client.socket.on('spawn', function(data){
          addNewPlayer(data.id, data.x, data.y)
        })

        Client.socket.on('newplayer', function(data){
          console.log('NEW PLAYER', data);
          addNewEnemy(data.id, data.x, data.y)
        })

        Client.socket.on('enemyShoot', function (data){
          if(Game.enemyMap[data.id]) {
            Game.enemyMap[data.id].shoot(data)
          }
        })

        Client.socket.on('enemyMove', function(data) {
          if (Game.enemyMap[data.id]) {
            Game.enemyMap[data.id].updatePosition(data)
          }
        })

        Client.socket.on('allplayers', function(data){
          console.log('NEW PLAYERS ALL', Game.playerMap)
          for (var i = 0; i < data.length; i++) {
            if (!Game.playerMap[data[i].id]) {
              addNewEnemy(data[i].id, data[i].x, data[i].y)
            }
          }
        })

        jetGroup = this.game.physics.p2.createCollisionGroup();
        bulletGroup = this.game.physics.p2.createCollisionGroup();

        Client.socket.on('remove', removePlayer);

        function removePlayer(id) {
          console.log('DELETING PLAYER!')
          if (Game.enemyMap[id]) {
            Game.enemyMap[id].jet.destroy()
            delete Game.enemyMap[id]
          } else if (Game.playerMap[id]) {
            Game.playerMap[id].jet.destroy()
            delete Game.playerMap[id]
          }
        }

        function addNewEnemy(id, x, y) {
          console.log("Adding enemy")
          Game.enemyMap[id] = new EnemyJet(self.game, 'jet', x, y)
        }

        function addNewPlayer(id, x, y) {
          let jet = new PlayerJet(self.game, 'jet', x, y)
          Game.selfId = id
          Game.playerMap[id] = jet
          self.game.camera.follow(jet.jet)
        }
    },
    /**
     * Main update loop
     */
    update: function() {
        //update game components
        for (let jet in Game.enemyMap) {
          Game.enemyMap[jet].update()
        }

        for (let jet in Game.playerMap) {
          Game.playerMap[jet].update()
        }
    }
}
