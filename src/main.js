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
                new PlayerBullet(player.x, player.y, 5 * Math.PI / 12);
                new PlayerBullet(player.x, player.y, Math.PI / 2);
                new PlayerBullet(player.x, player.y, 7 * Math.PI / 12);
            }
        });
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, i){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['enemy.png'];
        this.x = x;
        this.y = y;
        this.i = i;
        this.frame = 0;
        this.cnt = 0;
        this.speed = 1;
        this.life = 5;
        game.rootScene.addChild(this);
        enemies[this.i] = this;
    },
    onenterframe: function(){
        this.y += this.speed;
        if(this.life <= 0){
            game.score += 100;
            this.remove();
        }
        if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
        if(this.cnt++ % 2 == 0){
            var enemyBullet = new EnemyBullet(this.x + 4, this.y + 4, Math.random() * Math.PI, enemyBullets.length);
            enemyBullets[enemyBullets.length] = enemyBullet;
        }
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete enemies[this.i];
        delete this;
    }
});

var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, xsize, ysize, speed, angle){
        enchant.Sprite.call(this, xsize, ysize);
        this.x = x; this.y = y; this.frame = 1;
        this.vx = speed * Math.cos(angle);
        this.vy = speed * Math.sin(angle);
        game.rootScene.addChild(this);
    },
    onenterframe:function(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
    }
});

var PlayerBullet = enchant.Class.create(Bullet, {
    initialize: function(x, y, angle){
        Bullet.call(this, x, y, 16, 16, -5, angle);
        this.image = game.assets['playerBullet.png'];
        this.addEventListener('enterframe', function(){
            for(var i in enemyBullets){
                if(enemyBullets[i].intersect(this)){
                    this.remove(); enemyBullets[i].remove();
                }
            }
            for(var i in enemies){
                if(enemies[i].intersect(this)){
                    this.remove(); enemies[i].life--;
                }
            }
        });
    }
});

var EnemyBullet = enchant.Class.create(Bullet, {
    initialize: function(x, y, angle, i){
        Bullet.call(this, x, y, 8, 8, 5, angle);
        this.i = i;
        this.image = game.assets['enemyBullet.png'];
        this.addEventListener('enterframe', function(){
            if(this.intersect(player)){
                //game.pause();
            }
        });
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
        delete enemyBullets[this.i];
    }
});

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 60; game.score = 0; game.touched = false;
    game.preload('player.png');
    game.preload('playerBullet.png');
    game.preload('enemy.png');
    game.preload('enemyBullet.png');
    game.score = 0;
    var scoreLabel = new Label("SCORE : 0");
    scoreLabel.x = 240; scoreLabel.y = 5; scoreLabel.color = "white";
    game.rootScene.addChild(scoreLabel);
    enemies = [];
    enemyBullets = [];
    game.onload = function() {
        player = new Player(160, 300);
        game.rootScene.backgroundColor = 'black';
        game.addEventListener('enterframe', function(){
            scoreLabel.text = "EB : " + enemyBullets.length;
            if(Math.random() < 0.03){
                var x = Math.random() * 320;
                var enemy = new Enemy(x, 0, enemies.length);
            }
        });
    }
    game.start();
}

