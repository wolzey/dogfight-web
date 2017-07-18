GameState = function (game, initial) {
  this.game = game
  this.map = initial;
  this.addNewJet = function (id, x, y) {
    this.map[id] = new EnemyJet(this.game, 'jet', x, y)
  }
}
