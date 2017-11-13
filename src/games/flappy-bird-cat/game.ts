import { PhaserArcadeGame } from '../../utils/phaserLoader';
const flappingbirdcat = require('./assets/flappybirdcat.png');
const background = require('./assets/purple_sky.jpg');
const goButton = require('./assets/GoButtonPressed.png');
const pipe = require('./assets/stackOfCash.png');

export const GameStates = {
  BOOT: 'boot',
  GAME: 'game',
  LOSERMENU: 'loserMenu',
  MAINMENU: 'mainMenu',
};

export const SpriteKeys = {
  BACKGROUND: 'background',
  BIRDCAT: 'birdcat',
  GOBUTTON: 'goButton',
  PIPE: 'pipe',
  PIPETOP: 'pipetop',
};

export default class FlappyBirdCatGame extends PhaserArcadeGame {
  highScore: number;
  score: number;

  constructor(container: Element) {
    super(container);

    try {
      this.highScore = JSON.parse(localStorage.getItem('flappyBirdCatHighScore'));
    } catch (e) {}

    this.highScore = this.highScore || 0;

    this.state.add(GameStates.BOOT, BootState, true);
    this.state.add(GameStates.GAME, MainEngineState, false);
    this.state.add(GameStates.MAINMENU, MainMenuState, false);
    this.state.add(GameStates.LOSERMENU, LoserMenuState, false);
  }
}

export class BootState extends Phaser.State {
  preload() {
    this.load.crossOrigin = 'Anonymous';

    // scale the game 4x
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setGameSize(256, 224);

    // enable crisp rendering
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.load.spritesheet(SpriteKeys.BIRDCAT, flappingbirdcat, 16, 16, 3);
    this.load.spritesheet(SpriteKeys.GOBUTTON, goButton, 32, 32);
    this.load.image(SpriteKeys.BACKGROUND, background);
    this.load.spritesheet(SpriteKeys.PIPE, pipe, 32, 32);
  }

  create() {
    this.game.state.start(GameStates.MAINMENU, true, false);
  }
}

export class Player {
  get body() { return this.sprite.body as Phaser.Physics.Arcade.Body; }

  constructor(public sprite: Phaser.Sprite) {
    this.body.setSize(13, 10, 1, 3);
    this.sprite.animations.add('flapping', [0, 1, 2], 7, true);
    this.sprite.animations.play('flapping');
    this.body.setSize(14, 12, 1, 3);
  }

  jump = () => {
    this.body.velocity.y = -250;
  }
}

export class Pipe {
  game: FlappyBirdCatGame;
  sprite: Phaser.Sprite;

  constructor(game: FlappyBirdCatGame, x: number, y: number) {
    this.game = game;
    this.sprite = this.game.add.sprite(x, y, SpriteKeys.PIPE);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = -140;

    // Automatically kill the pipe when it's no longer visible
    this.sprite.checkWorldBounds = true;
    this.sprite.outOfBoundsKill = true;
  }
}

export class MainEngineState extends Phaser.State {
  player: Player;
  background: Phaser.TileSprite;
  pipes: Phaser.Group;
  timer: Phaser.TimerEvent;
  labelScore: Phaser.Text;
  game: FlappyBirdCatGame;

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.enableBody = true;

    this.background = this.game.add.tileSprite(0, 0, 800, 800, SpriteKeys.BACKGROUND);

    this.player = new Player(this.add.sprite(this.world.centerX - 30, this.world.centerY, SpriteKeys.BIRDCAT));
    this.player.body.gravity.y = 900;

    this.game.score = -1;
    this.labelScore = this.game.add.text(20, 20, '0', { fill: '#ffffff', font: '30px Arial' });
    this.makePipes();
    this.game.physics.arcade.enable(this.player);

    this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.player.jump, this);
    this.timer = this.game.time.events.loop(1500, this.makePipes, this);
  }

  makePipes() {
    const gap = Math.floor(Math.random() * 5) + 1;
    this.pipes = this.game.add.group();

    for (let i = 0; i < 9; i++) {
      if (i !== gap && i !== gap + 1) {
        this.pipes.add(new Pipe(this.game, 256, i * 30).sprite);
      }
    }
    this.game.score += 1;
    this.labelScore.text = this.game.score.toString();
  }

  update() {
    if (this.player.body.y >= this.game.world.height || this.player.body.y <= 0) {
      this.restart();
    }
    this.game.physics.arcade.overlap(this.player.sprite, this.pipes, this.restart, null, this);
    this.background.tilePosition.x -= 2;
  }

  restart() {
    if (this.game.score > this.game.highScore) {
      this.game.highScore = this.game.score;
      localStorage.setItem('flappyBirdCatHighScore', JSON.stringify(this.game.highScore));
    }

    this.game.state.start(GameStates.LOSERMENU, true, false);
  }
}

export class MainMenuState extends Phaser.State {
  player: Player;
  button: Phaser.Button;
  labelScore: Phaser.Text;
  game: FlappyBirdCatGame;

  create() {
    this.game.add.tileSprite(0, 0, 1800, 1800, SpriteKeys.BACKGROUND);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.enableBody = true;

    this.player = new Player(this.add.sprite(this.world.centerX, this.world.centerY, SpriteKeys.BIRDCAT));

    this.button = this.game.add.button(this.world.centerX - 8, this.world.centerY + 16, SpriteKeys.GOBUTTON, this.actionOnClick, this, 2, 1, 0);
    this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.actionOnClick, this);
  }

  actionOnClick = () => {
    this.game.state.start(GameStates.GAME, true, false);
  }
}

export class LoserMenuState extends Phaser.State {
  player: Player;
  button: Phaser.Button;
  labelScore: Phaser.Text;
  labelHighScore: Phaser.Text;
  game: FlappyBirdCatGame;

  create() {
    this.game.add.tileSprite(0, 0, 1800, 1800, SpriteKeys.BACKGROUND);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.enableBody = true;

    this.player = new Player(this.add.sprite(this.world.centerX, this.world.centerY, SpriteKeys.BIRDCAT));

    this.labelScore = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 35, this.game.score + '', { fill: '#ffffff', font: '30px Arial' });
    this.labelHighScore = this.game.add.text(20, 10, 'High Score: ' + this.game.highScore, { fill: '#ffffff', font: '20px Arial' });
    this.button = this.game.add.button(this.world.centerX - 8, this.world.centerY + 16, SpriteKeys.GOBUTTON, this.actionOnClick, this, 2, 1, 0);
    this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.actionOnClick, this);
  }

  actionOnClick() {
    this.game.state.start(GameStates.GAME, true, false);
  }
}
