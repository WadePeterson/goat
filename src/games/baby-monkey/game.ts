import { PhaserArcadeGame } from '../../utils/phaserLoader';
import { LevelState } from './LevelState';
import { Fonts, GameStates, Sprites, SoundFX, Music } from './constants';

const walkingMonkeyImage = require('./assets/sprites/walking-monkey.png');
const pressStartPng = require('../../../fonts/press-start-2p/press-start-2p.png');
const pressStartFnt = require('../../../fonts/press-start-2p/press-start-2p.fnt');
const jumpSound = require('./assets/audio/jump.wav');
const song1 = require('./assets/audio/song1.wav');
const song2 = require('./assets/audio/song2.wav');
const deathSound = require('./assets/audio/death.wav');
const bananaSound = require('./assets/audio/banana.wav');

export default class BabyMonkeyGame extends PhaserArcadeGame {
  constructor(container: Element) {
    super(container);
    this.state.add(GameStates.BOOT, BootState, true);
    this.state.add(GameStates.GAME_LEVEL, LevelState, false);
  }
}

export class BootState extends Phaser.State {
  preload() {
    this.load.crossOrigin = 'Anonymous';
    this.load.spritesheet(Sprites.MONKEY, walkingMonkeyImage, 16, 16, 4);
    this.load.bitmapFont(Fonts.PRESS_START, pressStartPng, pressStartFnt);
    this.load.audio(SoundFX.JUMP, jumpSound);
    this.load.audio(SoundFX.DEATH, deathSound);
    this.load.audio(SoundFX.BANANA, bananaSound);
    this.load.audio(Music.SONG1, song1);
    this.load.audio(Music.SONG2, song2);

    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setGameSize(256, 224);

    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  }

  create() {
    this.game.state.start(GameStates.GAME_LEVEL, true, false);
  }
}
