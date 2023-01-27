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
  scene: [GameScene1, GameScene2]
};

game = new Phaser.Game(config);