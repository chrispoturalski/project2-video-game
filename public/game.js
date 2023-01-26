// http://phaser.io/tutorials/making-your-first-phaser-3-game/part10
let game;
let orcGroup = [];
let pigGroup = [];
const DUDE_KEY = 'dude';

window.addEventListener('load', () => {
  let config = {
    type: Phaser.AUTO,
    width: 3500,
    height: 1400,
    backgroundColor: 0x9900e3,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: {
          y: 220
        }
      }
    },
    scale: {
      parent: 'thegame',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixleArt: true,
    scene: [GameScene]
  };

  game = new Phaser.Game(config);
});

class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');
    this.player = undefined;
    this.cursors = undefined;
    this.starLayer = undefined;
    this.inventory = undefined;
    this.orcs = undefined;
    this.pigs = undefined;
    this.sword = undefined;
    this.flipFlop = true;
  }

  preload() {
    // use to set link prefix to use phaser assets
    // this.load.setBaseURL('http://labs.phaser.io');
    this.load.spritesheet('orc', 'assets/orc.png', {
      frameWidth: 20,
      frameHeight: 20
    });
    this.load.spritesheet('pig', 'assets/pig.png', {
      frameWidth: 20,
      frameHeight: 20
    });

    this.cameras.main.setBackgroundColor(0x9900e3);

    this.load.image('tiles', 'assets/Tilemap/tiles_spritesheet.png');
    this.load.image('star-image', 'assets/star.png');
    this.load.image('Background', 'assets/night.png');
    this.load.image('sword', 'assets/sword.png');
    this.load.tilemapTiledJSON('tileset', 'map-2.json');
    this.load.spritesheet(DUDE_KEY, 'assets/redhood-spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  createAnimations() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'idle2',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 8, end: 9 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 16, end: 19 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 24, end: 31 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'crouching',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 32, end: 35 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'crouched',
      frames: [{ key: DUDE_KEY, frame: 35 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'jumping',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 40, end: 47 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'banished',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 48, end: 53 }),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: 'defeated',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 56, end: 63 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 64, end: 71 }),
      frameRate: 15,
      repeat: 0
    });
  }

  create() {
    this.createPlayer();
    console.log('inventory 2', this.inventory);

    console.log('anims', this.anims);

    this.cursors = this.input.keyboard.addKeys('W,S,A,D, SPACE, P, ESC');
    console.log('logging cursors', this.cursors);
  }

  createPlayer() {
    this.orcs = this.physics.add.group();
    this.pigs = this.physics.add.group();
    const map = this.make.tilemap({ key: 'tileset' });

    let tileset = map.addTilesetImage('Main-Tileset', 'tiles');
    let background = map.addTilesetImage('night-bg', 'Background');

    console.log(Phaser.Input.Keyboard.KeyCodes);

    const bgLayer = map.createLayer('Background', background, 0, 0);
    const worldLayer = map.createLayer('World Layer', tileset, 0, 0);
    worldLayer.setCollisionByProperty({ Collides: true });
    this.starLayer = map.getObjectLayer('Stars')['objects'];
    const stars = this.physics.add.staticGroup();

    this.starLayer.forEach((object) => {
      let obj = stars.create(object.x + 35, object.y - 20, 'star-image');
      // obj.setScale(object.width / 16, object.height / 16);
      obj.setOrigin(0.5);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    this.player = this.physics.add.sprite(1500, 1000, DUDE_KEY).setScale(2);
    this.sword = this.physics.add
      .sprite(1500, 1000, 'sword')
      .setScale(1.5);
    this.sword.body.setSize(50, 30, 0, 0);
    this.sword.rotation = 1.5;

    this.sword.body.setAllowGravity(false);
    // this.sword.disableBody(true, false);

    this.player.setCollideWorldBounds(true);

    this.createAnimations();


    this.inventory = {
      starsCollected: 0,
      isSprinting: false,
      enemiesDefeated: 0,
      // sword: false,
      lives: 3,
      health: 3,
      stage: 1,
      difficulty: 1,
      hit: false,
      gameOver: false
    };

    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.overlap(this.player, stars, collectStar, null, this);
    function collectStar(player, star) {
      star.disableBody(true, true);
      this.inventory.starsCollected += 1;
      score += 10;
      scoreText.setText('Score: ' + score);
      if (score % 50 === 0) {
        this.orcSpawn();
        this.pigSpawn();
      }
    }

    var score = 0;
    var scoreText;
    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    this.physics.add.collider(this.orcs, worldLayer);
    this.physics.add.collider(this.orcs, this.pigs);

    this.physics.add.collider(this.player, this.orcs, this.hitByEnemy, null, this);
    this.physics.add.collider(this.player, this.pigs, this.hitByEnemy, null, this);

    this.physics.add.overlap(this.sword, this.orcs, this.hitEnemy, null, this);
    this.physics.add.overlap(this.sword, this.pigs, this.hitEnemy, null, this);

    this.physics.add.collider(this.pigs, this.pigs);
    this.physics.add.collider(this.orcs, this.orcs);
  }

  hitEnemy(sword, enemy) {
      enemy.disableBody(true, true);
      // this.inventory.enemiesDefeated++;
  }

  hitByEnemy(player, enemy) {
    // this.player.setTint(0xff0000);
    if (!this.inventory.hit) {
      this.inventory.hit = true;
      this.inventory.health--;
      console.log(this.inventory.health + ' health')
      setTimeout(() => {
        this.inventory.hit = false;
      }, 500);
    } else {
      return
    }

    if (this.inventory.health === 0) {
      this.inventory.lives--;
      this.player.enableBody(true, true);
      this.inventory.health = 3;
      console.log(this.inventory.lives + ' lives')
    }

    if (this.inventory.lives === 0) {
      this.inventory.gameOver = true;
      console.log('Game Over :(')
    }

    // this.inventory.hit = true;

    // this.inventory.lives--;


    // this.player.disableBody(false, false);

    // if (this.inventory.lives === 0){
    //   this.inventory.gameOver = true;
    // }

    // setTimeout(() => {
    //   
    //   console.log(this.inventory.lives)
    //   this.inventory.hit = false;
    // }, 1000);
    
  }

  orcSpawn() {
    let x =
      this.player.x < 1750
        ? Phaser.Math.Between(1750, 3500)
        : Phaser.Math.Between(0, 1750);
    let orc = this.orcs.create(x, 10, 'orc').setScale(3);
    orc.setBounce(0);
    orc.setCollideWorldBounds(true);
    orc.setVelocity(Phaser.Math.Between(-200, 200), 20);
    orcGroup.push(orc);
  }

  pigSpawn() {
    let x =
      this.player.x < 1750
        ? Phaser.Math.Between(1750, 3500)
        : Phaser.Math.Between(0, 1750);
    let pig = this.pigs.create(x, 10, 'pig').setScale(3);
    pig.setBounce(0);
    pig.setCollideWorldBounds(true);
    pig.setVelocity(Phaser.Math.Between(-200, 200), 20);
    pigGroup.push(pig);
  }

  entityBoost(entity) {
    if (entity.length === 0) {
      return
    }

    for (let i = 0; i < entity.length; i++){
      if (entity[i].body.blocked.left) {
        // entity[i].setVelocityX(500);
        entity[i].setVelocityY(Phaser.Math.Between(200, 400))
      }
      if (entity[i].body.blocked.right) {
        entity[i].setVelocityY(Phaser.Math.Between(-200, -400))
      }
      if ((entity[i].body.velocity.y === 0) && entity[i].body.blocked.down) {
        entity[i].setVelocityY(Phaser.Math.Between(-200, -800));
        entity[i].setVelocityX(Phaser.Math.Between(-300, 300));
      }
    }
    // else return
  }
  update() {
    // console.log('inventory 3', this.inventory);
    // if (keyP.isDown) this.isPause = !this.isPause;

    // if (this.isPause) return;
    // depreciated cursor.left.isDown, etc since wasd is mapped
    // cursors = this.input.keyboard.createCursorKeys();

    // pauses everything on screen when keyP is down
    // player.on('animationstop', keyP.isDown)

    // also pauses everything
    // if (keyP.isDown) {
    //     this.scene.pause();
    // }
    if (this.player.flipX === false) {
      this.sword.setX(this.player.body.center.x + 30)
      this.sword.setY(this.player.body.center.y + 5)
      this.sword.rotation = 1.5;
    } else {
      this.sword.setX(this.player.body.center.x - 30)
      this.sword.setY(this.player.body.center.y + 5)
      this.sword.rotation = -1.5;
      this.sword.body.setSize(50, 30, -20, 0);
    }
    // this.scene.resume();
    //this.inventoryy.starsCollected
    if (this.cursors.A.isDown) {
      if (true) {
        this.player.setVelocityX(-300);
        this.player.anims.play('running', true);
        this.player.flipX = true;
      } else {
        this.player.setVelocityX(-160);
        this.player.anims.play('walking', true);
        this.player.flipX = true;
      }
      //this.inventoryy.starsCollected
    } else if (this.cursors.D.isDown) {
      if (true) {
        this.player.setVelocityX(300);
        this.player.anims.play('running', true);
        this.player.flipX = false;
      } else {
        this.player.setVelocityX(160);
        this.player.anims.play('walking', true);
        this.player.flipX = false;
      }
    } else if (this.cursors.S.isDown) {
      // this.player.anims.play('crouching', true);
      this.player.anims.play('crouched', true);
    } else if (this.cursors.W.isDown) {
      // this.player.anims.play('attack', true);
      this.sword.setX(this.player.body.center.x)
      this.sword.setY(this.player.body.center.y - 50)
      this.sword.rotation = 0;

      // this.sword.enableBody(true, true);
      // console.log(this.player.body.center)
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }

    if(this.player.body.blocked.down) {
      this.inventory.jumps = 2;
    }

    if (this.cursors.SPACE.isDown && this.inventory.jumps > 0) {
      if (this.flipFlop) {
        this.flipFlop = false;
        this.player.setVelocityY(-330);
        this.player.anims.play('jumping', true);
        this.inventory.jumps--;
        console.log('flip true, setting to false')
      }
    }
    if (this.cursors.SPACE.isUp && !this.flipFlop) {
      this.flipFlop = true;
      console.log('flop false, setting to true')
    }

    if (this.cursors.S.isDown && !this.player.body.blocked.down) {
      this.player.setVelocityY(330);
    }



    // if (this.inventory.hit === true){
    //   console.log(this.inventory.hit);
    //   this.player.anims.play('banished', true)
    // }

    this.entityBoost(orcGroup);
    this.entityBoost(pigGroup);
    //   if (Phaser.Input.Keyboard.JustDown(this.cursors.P) && isPaused === false) {
    //     this.physics.pause();
    //     isPaused = true;
    //     console.log('pausing', isPaused);
    //   } else if (Phaser.Input.Keyboard.JustDown(keyP) && isPaused === true) {
    //     this.physics.resume();
    //     isPaused = false;
    //     console.log('resuming', isPaused);
    //   }
    // }
  }
}
