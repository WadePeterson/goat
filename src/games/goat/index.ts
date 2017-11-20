import { initializeGame, PhaserArcadeGame } from '../../utils/phaserLoader';
import { GameStates, MainState } from './game';
import * as Utils from './utils';

const walkingMonkeyImage = require('./assets/sprites/walking-monkey.png');
const walkingPigImage = require('./assets/sprites/walking-pig.png');
const monkeyBulletImage = require('./assets/sprites/monkey-bullet.png');
const pressStartPng = require('../../../fonts/press-start-2p/press-start-2p.png');
const pressStartFnt = require('../../../fonts/press-start-2p/press-start-2p.fnt');
const jumpSound = require('./assets/audio/jump.wav');
const song1 = require('./assets/audio/song1.wav');
const song2 = require('./assets/audio/song2.wav');
const deathSound = require('./assets/audio/death.wav');
const bananaSound = require('./assets/audio/banana.wav');

export default class GoatGame extends PhaserArcadeGame {
  constructor(container: Element) {
    super(container);
    this.state.add(GameStates.Boot, BootState, true);
    this.state.add(GameStates.Dungeon, MainState, false);
  }
}

export class BootState extends Phaser.State {
  preload() {
    this.load.crossOrigin = 'Anonymous';
    this.load.spritesheet(Utils.Assets.Sprites.MONKEY, walkingMonkeyImage, 16, 16, 4);
    this.load.spritesheet(Utils.Assets.Sprites.BULLET, monkeyBulletImage, 8, 8, 4);
    this.load.spritesheet(Utils.Assets.Sprites.PIG, walkingPigImage, 16, 16, 4),
    this.load.bitmapFont(Utils.Assets.Fonts.PRESS_START, pressStartPng, pressStartFnt);
    this.load.audio(Utils.Assets.SoundFX.JUMP, jumpSound);
    this.load.audio(Utils.Assets.SoundFX.DEATH, deathSound);
    this.load.audio(Utils.Assets.SoundFX.BANANA, bananaSound);
    this.load.audio(Utils.Assets.Music.SONG1, song1);
    this.load.audio(Utils.Assets.Music.SONG2, song2);

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setGameSize(256, 224);

    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  }

  create() {
    this.game.state.start(GameStates.Dungeon, true, false);
  }
}

initializeGame(GoatGame);
