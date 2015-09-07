enchant();

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['player.png'];
        this.x = x; this.y = y; this.frame = 0;
	game.keybind(90, 'shot');
        game.rootScene.addEventListener('touchstart', function(e){ player.x = e.x; game.touched = true; });
        game.rootScene.addEventListener('touchend', function(e){ player.x = e.x; game.touched = false; });
        game.rootScene.addEventListener('touchmove', function(e){ player.x = e.x; });
        game.rootScene.addChild(this);
        game.rootScene.addEventListener('enterframe', function() {
            var speed = 3;
            if ((game.input.up || game.input.down) && (game.input.right || game.input.left)){
               speed *= 0.71;
            }
            if (game.input.up) {
                player.y -= speed;
            }
            if (game.input.down) {
                player.y += speed;
            }
            if (game.input.right) {
                player.x += speed;
            }
            if (game.input.left) {
                player.x -= speed;
            }
            if(game.input.shot && game.frame % 5 == 0){
                new PlayerBullet(player.x, player.y);
            }
        });
    }
});

var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, speed){
        enchant.Sprite.call(this, 16, 16);
        this.x = x; this.y = y; this.frame = 1;
        this.speed = speed;
        game.rootScene.addChild(this);
    },
    onenterframe:function(){
        this.y += this.speed;
        if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
    },
    remove: function(){ game.rootScene.removeChild(this); delete this; }
});

var PlayerBullet = enchant.Class.create(Bullet, {
    initialize: function(x, y){
        Bullet.call(this, x, y, -10);
        this.image = game.assets['playerBullet.png'];
    }
});

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 60; game.score = 0; game.touched = false;
    game.preload('player.png');
    game.preload('playerBullet.png');
    game.onload = function() {
        player = new Player(160, 300);
        game.rootScene.backgroundColor = 'black';
    }
    game.start();
}

