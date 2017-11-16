import { getTileConfig } from './tiles';
import { Player } from './Player';
import { Fonts, GameStates, Sprites, SoundFX } from './constants';
import { Actions, KeyMap } from './keyboard';
import levels, { LevelConfig } from './levels';

interface MenuItem {
  action: () => void;
  text: string;
  item: Phaser.BitmapText;
}

export class PauseMenu {
  game: Phaser.Game;
  isOpen: boolean;
  menuGroup?: Phaser.Group;
  levelState: LevelState;
  menuItems: MenuItem[];
  activeItemIndex: number;

  constructor(game: Phaser.Game, levelState: LevelState) {
    this.game = game;
    this.levelState = levelState;
    this.isOpen = false;
  }

  createMenu() {
    this.menuGroup = this.game.add.group();

    const graphics = this.game.add.graphics(0, 0, this.menuGroup);
    graphics.beginFill(0x000000, 0.7);
    graphics.drawRect(0, 0, this.game.width, this.game.height);
    graphics.fixedToCamera = true;

    this.menuItems = this.createMenuItems();
    this.setActiveItem(0);
  }

  createMenuItems(): MenuItem[] {
    const menuItemConfigs = [
      { action: this.close, text: 'Resume Game' },
      { action: this.restartLevel, text: 'Restart Level' },
    ];

    const menuItemHeight = 12;
    const menuHeight = menuItemConfigs.length * menuItemHeight;
    const menuTop = (this.game.height - menuHeight) / 2;

    return menuItemConfigs.map((config, index) => {
      const y = menuTop + index * menuItemHeight;
      return Object.assign({}, config, { item: this.addMenuItem(config.text, y) });
    });
  }

  setActiveItem(activeItemIndex: number) {
    this.activeItemIndex = activeItemIndex;
    this.menuItems.forEach((menuItem, index) => {
      if (index === activeItemIndex) {
        menuItem.item.alpha = 1;
      } else {
        menuItem.item.alpha = 0.6;
      }
    });
  }

  restartLevel() {
    this.levelState.restart();
  }

  addMenuItem(text: string, y: number) {
    return addFixedLabel(this.game, y, text, 8, 'center', 0, this.menuGroup);
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  open() {
    this.setOpen(true);
  }

  close() {
    this.setOpen(false);
  }

  private setOpen(open: boolean) {
    this.isOpen = open;
    this.levelState.pauseLevel(this.isOpen);

    this.levelState.keys.reset(Actions.MenuDown);
    this.levelState.keys.reset(Actions.MenuUp);
    this.levelState.keys.reset(Actions.MenuSelect);

    if (this.isOpen) {
      this.createMenu();
    } else if (this.menuGroup) {
      this.menuGroup.destroy(true);
      this.menuGroup = undefined;
    }
  }

  update() {
    if (this.levelState.keys.justDown(Actions.MenuUp) && this.activeItemIndex > 0) {
      this.setActiveItem(this.activeItemIndex - 1);
    } else if (this.levelState.keys.justDown(Actions.MenuDown) && this.activeItemIndex < this.menuItems.length - 1) {
      this.setActiveItem(this.activeItemIndex + 1);
    } else if (this.levelState.keys.justDown(Actions.MenuSelect)) {
      this.menuItems[this.activeItemIndex].action.call(this);
    }
  }
}

export class LevelState extends Phaser.State {
  game: Phaser.Game;
  config: LevelConfig;
  walls: Phaser.Group;
  bananas: Phaser.Group;
  enemies: Phaser.Group;
  player: Player;
  header: GameHeaderText;
  levelIndex = 0;
  stats: LevelStats;
  keys: KeyMap;
  success: boolean;
  isPaused: boolean;
  pauseMenu: PauseMenu;
  backgroundMusic: Phaser.Sound;
  bananaSound: Phaser.Sound;
  deathSound: Phaser.Sound;

  preload() {
    this.config = levels[this.levelIndex];
    this.walls = this.add.group();
    this.bananas = this.add.group();
    this.enemies = this.add.group();
    this.loadTiles();
  }

  private loadTiles() {
    const loadedTiles: { [key: string]: boolean } = {};

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileChar = this.config.tileData[row][col];
        const tileConfig = getTileConfig(tileChar);

        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;
        if (!loadedTiles[tileKey]) {
          this.game.load.image(tileKey, tileConfig.imgPath);
          loadedTiles[tileKey] = true;
        }
      }
    }
  }

  create() {
    this.game.stage.backgroundColor = this.config.backgroundColor;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.down = false;
    this.game.physics.arcade.checkCollision.up = false;

    this.game.world.setBounds(0, 0, this.config.tileData[0].length * 16, this.config.tileData.length * 16);
    this.game.world.enableBody = true;
    this.game.stage.smoothed = false;
    this.bananaSound = this.game.add.audio(SoundFX.BANANA);
    this.deathSound = this.game.add.audio(SoundFX.DEATH);

    this.keys = new KeyMap(this.game);
    this.pauseMenu = new PauseMenu(this.game, this);

    this.player = new Player(this.game, this.keys);
    this.player.sprite.position.x = this.config.startX * 16;
    this.player.sprite.position.y = this.config.startY * 16;
    this.header = new GameHeaderText(this.game);

    this.createMap();
    this.pauseLevel(false);

    if (this.backgroundMusic) {
      this.backgroundMusic.destroy();
    }

    this.backgroundMusic = this.game.add.audio(this.config.song);
    this.backgroundMusic.play();

    fadeText(this.game, 0, 100, `Level ${this.levelIndex + 1}`, 16, 'center');
    fadeText(this.game, 400, 120, this.config.name, 8, 'center');
  }

  private createMap() {
    this.success = false;
    this.stats = Object.assign({ score: 0 }, this.stats, { bananasCollected: 0, bananasTotal: 0 });

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileChar = this.config.tileData[row][col];
        const tileConfig = getTileConfig(tileChar);

        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;

        if (tileKey === Sprites.BANANA) {
          this.stats.bananasTotal++;
        }

        const x = col * 16;
        const y = row * 16;
        const sprite = this.game.add.sprite(x, y, tileKey);
        tileConfig.addToLevel(this, sprite);
      }
    }
  }

  isLevelComplete() {
    return this.stats.bananasCollected === this.stats.bananasTotal;
  }

  pauseLevel(paused: boolean) {
    if (this.backgroundMusic) {
      if (paused) {
        this.backgroundMusic.pause();
      } else {
        this.backgroundMusic.resume();
      }
    }

    this.game.physics.arcade.isPaused = paused;
    this.isPaused = paused;
    this.player.sprite.animations.paused = paused;
  }

  showPauseMenu() {
    this.pauseLevel(true);
    const graphics = this.game.add.graphics(0, 0);
    graphics.beginFill(0x000000, 0.3);
    graphics.drawRect(0, 0, this.game.width, this.game.height);
  }

  hidePauseMenu() {
    this.pauseLevel(false);
  }

  levelSuccess() {
    this.success = true;
    const successTextChoices = [
      'Woohoo!',
      'Great Success!',
      'Go, Monkey, Go!',
    ];
    this.pauseLevel(true);
    const text = successTextChoices[this.game.rnd.integerInRange(0, successTextChoices.length - 1)];
    fadeText(this.game, 0, 104, text, 16, 'center').then(() => {
      this.goToLevel(this.levelIndex + 1);
    });
  }

  die() {
    this.backgroundMusic.stop();
    this.deathSound.play();
    const failureTextChoices = [
      'Oh poop',
      'You made baby monkey sad :(',
      'Nooooooooooooooo!!!',
    ];
    this.pauseLevel(true);
    const text = failureTextChoices[this.game.rnd.integerInRange(0, failureTextChoices.length - 1)];
    fadeText(this.game, 0, 104, text, 8, 'center').then(() => {
      setTimeout(() => {
        this.restart();
      }, 500);
    });
  }

  update() {
    if (this.keys.justDown(Actions.OpenPauseMenu)) {
      this.pauseMenu.toggle();
    }

    if (this.pauseMenu.isOpen) {
      this.pauseMenu.update();
    }

    if (this.isPaused) {
      return;
    }

    this.game.physics.arcade.collide(this.player.sprite, this.walls);
    this.game.physics.arcade.overlap(this.player.sprite, this.bananas, this.eatBanana, undefined, this);
    this.game.physics.arcade.overlap(this.player.sprite, this.enemies, this.restart, undefined, this);

    this.player.update();

    if (this.player.body.position.y > this.world.height) {
      this.die();
    }

    if (!this.success && this.isLevelComplete()) {
      this.levelSuccess();
    }

    if (this.keys.justDown(Actions.NextLevel)) {
      this.goToLevel(this.levelIndex + 1);
    } else if (this.keys.justDown(Actions.PrevLevel)) {
      this.goToLevel(this.levelIndex - 1);
    }

    this.header.update(this.stats);
  }

  goToLevel(index: number) {
    this.levelIndex = index % levels.length;
    this.game.state.start(GameStates.GAME_LEVEL);
  }

  private eatBanana(__player: Phaser.Sprite, banana: Phaser.Sprite) {
    banana.kill();
    this.bananaSound.play();
    this.stats.bananasCollected++;
    this.stats.score += 10;
  }

  restart() {
    this.goToLevel(this.levelIndex);
  }

  paused() {
    if (!this.isPaused) {
      this.pauseMenu.open();
    }
  }
}

type TextAlign = 'left' | 'center' | 'right';

function addFixedLabel(game: Phaser.Game, y: number, text: string, size: number, align: TextAlign, marginX = 0, group?: Phaser.Group) {
  const label = game.add.bitmapText(0, y, Fonts.PRESS_START, text, size, group);

  if (align === 'left') {
    label.x = marginX;
  } else if (align === 'right') {
    label.x = game.width - label.width - marginX;
  } else {
    label.x = (game.width - label.width) / 2;
  }

  label.x = Math.round(label.x);
  label.fixedToCamera = true;

  return label;
}

function fadeText(game: Phaser.Game, initialDelay: number, y: number, text: string, size: number, align: TextAlign, marginX = 0) {
  const label = addFixedLabel(game, y, text, size, align, marginX);
  label.alpha = 0;
  const textDuration = 1000;
  const fadeInDuration = 1000;
  const fadeOutDuration = 500;

  return new Promise(resolve => {
    game.add.tween(label)
      .to({ alpha: 1 }, fadeInDuration, Phaser.Easing.Linear.None, true, initialDelay, 0)
      .onComplete.addOnce(() => {
        game.add.tween(label)
          .to({ alpha: 0 }, fadeOutDuration, Phaser.Easing.Linear.None, true, textDuration, 0)
          .onComplete.add(() => {
            label.destroy();
            resolve();
          });
      });
  });
}

interface LevelStats {
  bananasCollected: number;
  bananasTotal: number;
  score: number;
}

function leftPad(num: number) {
  return num < 10 ? ' ' + num : '' + num;
}

export class GameHeaderText {
  private scoreLabel: Phaser.BitmapText;
  private bananaLabel: Phaser.BitmapText;

  constructor(game: Phaser.Game) {
    this.scoreLabel = addFixedLabel(game, 2, 'Score:', 8, 'left', 2);
    this.bananaLabel = addFixedLabel(game, 2, '00/00', 8, 'right', 2);
  }

  update(stats: LevelStats) {
    this.scoreLabel.text = 'Score:' + stats.score;
    this.bananaLabel.text = `${leftPad(stats.bananasCollected)}/${leftPad(stats.bananasTotal)}`;
  }
}
