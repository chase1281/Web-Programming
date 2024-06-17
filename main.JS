const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bombs;
let poisons;
let score = 0;
let scoreText;
let gameOver = false;
let music;
const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'img/background.jpg');
    this.load.image('player', 'img/cat.png');
    this.load.image('bomb', 'img/bomb.png');
    this.load.image('poison', 'img/poison.png');
    this.load.audio('backgroundMusic', 'vivaldi-winter.mp3');
}

function create() {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    player = this.physics.add.sprite(400, 500, 'player').setCollideWorldBounds(true);
    player.setScale(0.5);

    bombs = this.physics.add.group();
    poisons = this.physics.add.group(); 

    this.time.addEvent({
        delay: 2000,
        loop: true,
        callback: function () {
            if (!gameOver) {
                score += 10;
                scoreText.setText('Score: ' + score);

                if (score > 150) {
                    const rock = poisons.create(Phaser.Math.Between(50, 750), 0, 'poison');
                    rock.setGravityY(100);
                    rock.setSize(30, 30); 
                }
            }
        }
    });

    this.time.addEvent({
        delay: 500,
        loop: true,
        callback: function () {
            if (!gameOver) {
                const bomb = bombs.create(Phaser.Math.Between(50, 750), 0, 'bomb');
                bomb.setGravityY(100);
                bomb.setSize(30, 30); 
            }
        }
    });

    this.physics.add.overlap(player, bombs, hitBomb, null, this);
    this.physics.add.overlap(player, poisons, hitBomb, null, this); 

    cursors = this.input.keyboard.createCursorKeys();

    music = this.sound.add('backgroundMusic');
    music.play({
        loop: true
    });
}

function update() {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }
}

function hitBomb(player, bomb) {
    gameOver = true;
    this.physics.pause();
    player.setTint(0xff0000);
    music.stop();
}
