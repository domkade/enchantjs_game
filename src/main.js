enchant();

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['player.png'];
        this.x = x; this.y = y; this.frame = 0;
        game.rootScene.addEventListener('touchstart', function(e){ player.x = e.x; game.touched = true; });
        game.rootScene.addEventListener('touchend', function(e){ player.x = e.x; game.touched = false; });
        game.rootScene.addEventListener('touchmove', function(e){ player.x = e.x; });
        game.rootScene.addChild(this);
    }
});

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 60; game.score = 0; game.touched = false; game.preload('player.png');
    game.onload = function() {
        player = new Player(160, 300);
        game.rootScene.backgroundColor = 'black';
    }
    game.start();
}