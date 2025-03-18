import { Scene } from 'phaser';

export class Game extends Scene {
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player1Health = 100;
    player1ImmunityFrames = 0;
    player2Health = 100;
    player2ImmunityFrames = 0;
    healthText: any;
    keys: any;
    stars: any;
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

    }

    create() {
        this.player1Health=100
        this.player2Health=100
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.keys = this.input.keyboard!.addKeys("W,A,S,D,N,Q");

        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.healthText = this.add.text(16, 16, 'P1: ' + this.player1Health + " | P2: " + this.player2Health, { fontSize: '32px', color: '#000' });


        this.player1 = this.physics.add.sprite(100, 511, 'dude');
        this.player1.setBounce(0.2);
        this.player1.setCollideWorldBounds(true);
        this.physics.add.collider(this.player1, this.platforms);

        this.player2 = this.physics.add.sprite(700, 511, 'dude');
        this.player2.setTint(0xff0000)
        this.player2.setBounce(0.2);
        this.player2.setCollideWorldBounds(true);
        this.physics.add.collider(this.player2, this.platforms);

        let onPlayersCollide = (_player1: any, _player2: any) => {
            if (this.player1ImmunityFrames <= 0 /* out of immunity */ && this.keys.N.isDown/* player 2 attacking */) {
                this.player1Health -= 10;
                this.player1ImmunityFrames = 35; // make them immune for a bit
            }

            if (this.player2ImmunityFrames <= 0 /* out of immunity */ && this.keys.Q.isDown/* player 1 attacking */) {
                this.player2Health -= 10;
                this.player2ImmunityFrames = 35; // make them immune for a bit
            }
            this.healthText.setText('P1: ' + this.player1Health + " | P2: " + this.player2Health);
        }
        this.physics.add.overlap(this.player1, this.player2, onPlayersCollide, undefined, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        

    }

    update() {
        if (this.player1ImmunityFrames > 0){
            this.player1ImmunityFrames = this.player1ImmunityFrames - 1;
        }
        if (this.player1ImmunityFrames % 4 >= 2){ // every other immunity frame ( 0 1 2 3)
            this.player1.setTint(0x888888);
        } else {
            this.player1.setTint(0xffffff)
        }
        
        if (this.player2ImmunityFrames > 0){
            this.player2ImmunityFrames = this.player2ImmunityFrames - 1;
        }
        if (this.player2ImmunityFrames % 4 >= 2){ // every other immunity frame ( 0 1 2 3)
            this.player2.setTint(0x888888);
        } else {
            this.player2.setTint(0xf00000)
        }

        // Player 1 (WASD)
        if (this.keys.A.isDown) {
            this.player1.setVelocityX(-160);
            this.player1.anims.play('left', true);
        }
        else if (this.keys.D.isDown) {
            this.player1.setVelocityX(160);
            this.player1.anims.play('right', true);
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.anims.play('turn');
        }

        if (this.keys.W.isDown && this.player1.body.y > 485) {
            this.player1.setVelocityY(-330);
        }
        // Player 2 (arrow keys)
        if (this.cursors.left.isDown) {
            this.player2.setVelocityX(-160);
            this.player2.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player2.setVelocityX(160);
            this.player2.anims.play('right', true);
        }
        else {
            this.player2.setVelocityX(0);
            this.player2.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player2.body.y > 485) {
            this.player2.setVelocityY(-330);
        }

        // Did anyone hit 0 health?
        if (this.player1Health<=0){
            this.scene.start("GameOver");
        }
        if (this.player2Health<=0){
            this.scene.start("GameOver");
        }
    }
}
