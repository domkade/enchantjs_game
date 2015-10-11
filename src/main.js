enchant();

window_size_x = 320;
window_size_y = 480;

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 48, 48);
        this.image = game.assets['./src/player.png'];
        this.x = x; this.y = y; this.frame = 2;
        game.keybind(90, 'shot1');
        game.keybind(88, 'shot2');
        game.rootScene.addEventListener('touchstart', function(e){ player.x = e.x; game.touched = true; });
        game.rootScene.addEventListener('touchend', function(e){ player.x = e.x; game.touched = false; });
        game.rootScene.addEventListener('touchmove', function(e){ player.x = e.x; });
        game.rootScene.addEventListener('enterframe', function() {
            var speed = 3;
            player.flameCount++;
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
                if(player.frame < 4 && game.frame % 5 == 0){
                    player.frame++;
                }
            }else if (game.input.left) {
                player.x -= speed;
                if(player.frame > 0 && game.frame % 5 == 0){
                    player.frame--;
                }
            }else{
                if(game.frame % 5 == 0){
                    if(player.frame < 2)player.frame++;
                    if(player.frame > 2)player.frame--;
                }
            }
            if(game.input.shot1 && game.frame % 5 == 0){
		for(i = -2; i <= 2; i++){
                    new PlayerBullet(player.x + 16, player.y, 90 + i * 10, 0);
		}
            }else if(game.input.shot2 && game.frame % 5 == 0){
		for(i = -2; i <= 2; i++){
                    new PlayerBullet(player.x + 16, player.y, 90 + i * 10, 1);
		}
            }
        });
        game.rootScene.addChild(this);
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, i){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['./src/enemy.png'];
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
        if(this.y > window_size_y || this.x > window_size_x || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
        if(this.cnt++ % 2 == 0){
            var enemyBullet = new EnemyBullet(this.x + 4, this.y + 4, Math.random() * 360,
					      parseInt(Math.random() * 2), enemyBullets.length);
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
	var rad = angle * Math.PI / 180;
        this.vx = speed * Math.cos(rad);
        this.vy = speed * Math.sin(rad);
        game.rootScene.addChild(this);
    },
    onenterframe:function(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.y > window_size_y || this.x > window_size_x || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
    }
});

var PlayerBullet = enchant.Class.create(Bullet, {
    initialize: function(x, y, angle, color){
        Bullet.call(this, x, y, 16, 16, -10, angle);
	this.color = color;
	this.frame = color;
        this.image = game.assets['./src/playerBullet.png'];
	this.rotation = angle - 90;
        this.addEventListener('enterframe', function(){
            for(var i in enemyBullets){
                if(this.color == enemyBullets[i].color && enemyBullets[i].intersect(this)){
		    new Item(this.x, this.y, this.color);
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
    initialize: function(x, y, angle, color, i){
        Bullet.call(this, x, y, 16, 16, 5, angle);
        this.i = i;
	this.color = color;
	this.frame = color;
        this.image = game.assets['./src/enemyBullet.png'];
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

var Item = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, color){
        enchant.Sprite.call(this, 16, 16);
        this.x = x; this.y = y;
	this.color = color;
	this.frame = color;
	this.image = game.assets['./src/item.png'];
	this.speed = 8;
	this.cnt = 0;
        game.rootScene.addChild(this);
    },
    onenterframe:function(){
	if(this.cnt < 30){
	    this.y -= 1;
	}else{
	    var rad = Math.atan2((player.y + 24) - (this.y + 8), (player.x + 24) - (this.x + 8));
            this.x += this.speed * Math.cos(rad);
            this.y += this.speed * Math.sin(rad);
	}
        if(this.y > window_size_y || this.x > window_size_x || this.x < -this.width || this.y < -this.height){
            this.remove();
        }
	if(this.intersect(player)){
            this.remove();
        }
	this.cnt++;
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
    }
});

window.onload = function() {
    game = new Game(320, 480);
    game.fps = 60; game.score = 0; game.touched = false;
    game.preload('./src/player.png');
    game.preload('./src/playerBullet.png');
    game.preload('./src/enemy.png');
    game.preload('./src/enemyBullet.png');
    game.preload('./src/item.png');
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

