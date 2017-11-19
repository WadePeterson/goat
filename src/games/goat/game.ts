import * as Components from './components';
import { Entity, EntityMap } from './entity';
import * as Systems from './systems';
import * as Utils from './utils';
import { PauseMenu } from './PauseMenu';
import levels, { LevelConfig } from './levels';
import { Component } from './components';

export enum GameStates {
  Boot = 'boot',
  Dungeon = 'dungeon'
}

export class MainState extends Phaser.State {
  game: Phaser.Game;
  config: LevelConfig;
  header: GameHeaderText;
  levelIndex = 0;
  success: boolean;
  isPaused: boolean;
  pauseMenu: PauseMenu;

  playerId: string;
  keys: Utils.Input.KeyMap;
  entities: EntityMap;
  sprites: { [key: string]: Phaser.Sprite | undefined };
  systems: Systems.System[];

  onEntityAdded: Phaser.Signal;

  preload() {
    this.config = levels[this.levelIndex];
    const loadedTiles: { [key: string]: boolean } = {};

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileConfig = Utils.Assets.getTileConfig(this.config.tileData[row][col]);
        if (tileConfig && !loadedTiles[tileConfig.key]) {
          this.game.load.image(tileConfig.key, tileConfig.imgPath);
          loadedTiles[tileConfig.key] = true;
        }
      }
    }
  }

  create() {
    this.game.stage.backgroundColor = this.config.backgroundColor;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.world.setBounds(0, 0, this.config.tileData[0].length * 16, this.config.tileData.length * 16);
    this.game.world.enableBody = true;
    this.game.stage.smoothed = false;

    this.keys = new Utils.Input.KeyMap(this.game);
    this.pauseMenu = new PauseMenu(this.game, this);

    this.onEntityAdded = new Phaser.Signal();

    this.sprites = {};
    this.entities = {};

    this.systems = [
      new Systems.Input(this),
      new Systems.AI(this),
      new Systems.Movement(this),
      new Systems.Collision(this)
    ];

    const player = new Entity().addComponents([
      Components.Player(),
      Components.Commandable(),
      Components.CollidableBox({ width: 14, height: 13, offsetX: 1, offsetY: 3 }),
      Components.Position({ x: this.config.startX * 16, y: this.config.startY * 16 }),
      Components.Velocity(),
      Components.Health({ max: 100 }),
      Components.Sprite({ key: Utils.Assets.Sprites.MONKEY })
    ]);

    this.playerId = player.id;

    this.addEntity(player);

    this.header = new GameHeaderText(this.game);

    this.createMap();
    this.pauseLevel(false);
  }

  private addEntity(entity: Entity) {
    this.entities[entity.id] = entity;

    const spriteComp = entity.getComponent(Components.Sprite);
    if (spriteComp) {
      const position = entity.getComponent(Components.Position);
      const sprite = this.game.add.sprite(position ? position.x : 0, position ? position.y : 0, spriteComp.key);
      sprite.data.entityId = entity.id;
      const body: Phaser.Physics.Arcade.Body = sprite.body;
      this.sprites[entity.id] = sprite;

      sprite.anchor.x = 1;
      sprite.anchor.y = 0;

      const collidable = entity.getComponent(Components.CollidableBox);
      if (collidable) {
        collidable.width = collidable.width || sprite.width;
        collidable.height = collidable.height || sprite.height;

        body.collideWorldBounds = true;
        body.setSize(collidable.width, collidable.height, collidable.offsetX, collidable.offsetY);
      }

      if (!entity.getComponent(Components.Velocity)) {
        body.immovable = true;
      }

      if (entity.getComponent(Components.Player)) {
        sprite.checkWorldBounds = true;
        sprite.animations.add('walking', [0, 1, 2, 3], 10, true);
        this.game.camera.follow(sprite);
      }
    }

    this.onEntityAdded.dispatch(entity);
  }

  private createMap() {
    this.success = false;

    for (let row = 0; row < this.config.tileData.length; row++) {
      for (let col = 0; col < this.config.tileData[row].length; col++) {
        const tileConfig = Utils.Assets.getTileConfig(this.config.tileData[row][col]);
        if (!tileConfig) {
          continue;
        }

        const tileKey = tileConfig.key;
        const components: Component<any>[] = [];

        components.push(
          Components.Sprite({ key: tileKey }),
          Components.Position({ x: col * 16, y: row * 16 }),
          Components.CollidableBox()
        );

        if (tileKey === Utils.Assets.Sprites.BANANA) {
          components.push(
            Components.AI(),
            Components.Commandable(),
            Components.Velocity({ maxSpeed: 80 }),
            Components.Health({ max: 100 })
          );
        }

        this.addEntity(new Entity().addComponents(components));
      }
    }
  }

  isLevelComplete() {
    return false;
  }

  pauseLevel(paused: boolean) {
    this.game.physics.arcade.isPaused = paused;
    this.isPaused = paused;
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
    Utils.Label.fadeText(this.game, 0, 104, text, 16, Utils.Label.TextAlign.Center).then(() => {
      this.goToLevel(this.levelIndex + 1);
    });
  }

  die() {
    const failureTextChoices = [
      'Oh poop',
      'You made baby monkey sad :(',
      'Nooooooooooooooo!!!',
    ];
    this.pauseLevel(true);
    const text = failureTextChoices[this.game.rnd.integerInRange(0, failureTextChoices.length - 1)];
    Utils.Label.fadeText(this.game, 0, 104, text, 8, Utils.Label.TextAlign.Center).then(() => {
      setTimeout(() => {
        this.restart();
      }, 500);
    });
  }

  update() {
    if (this.keys.justDown(Utils.Input.Action.OpenPauseMenu)) {
      this.pauseMenu.toggle();
    }

    if (this.pauseMenu.isOpen) {
      this.pauseMenu.update();
    }

    if (this.isPaused) {
      return;
    }

    this.syncPhysics(true);

    for (const system of this.systems) {
      system.update(this.entities);
    }

    this.syncPhysics(false);

    this.header.update(this);
  }

  syncPhysics(fromPhysics: boolean) {
    for (const entityId of Object.keys(this.sprites)) {
      this.syncPhysicsForEntity(entityId, fromPhysics);
    }
  }

  syncPhysicsForEntity(entityId: string, fromPhysics: boolean) {
    const sprite = this.sprites[entityId] as Phaser.Sprite;
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    const entity = this.entities[entityId];
    this.copyValues(body.position, entity.getComponent(Components.Position), fromPhysics);
    this.copyValues(body.velocity, entity.getComponent(Components.Velocity), fromPhysics);
  }

  copyValues(physicsValue: { x: number; y: number }, compValue: { x: number; y: number } | null, fromPhysics: boolean) {
    if (compValue) {
      const src = fromPhysics ? physicsValue : compValue;
      const dest = fromPhysics ? compValue : physicsValue;
      dest.x = src.x;
      dest.y = src.y;
    }
  }

  goToLevel(index: number) {
    this.levelIndex = index % levels.length;
    this.game.state.start(GameStates.Dungeon);
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

export class GameHeaderText {
  private healthLabel: Phaser.BitmapText;

  constructor(game: Phaser.Game) {
    this.healthLabel = Utils.Label.addFixedLabel(game, 2, 'Health:', 8, Utils.Label.TextAlign.Left, 2);
  }

  update(state: MainState) {
    const player = state.entities[state.playerId];
    const health = player && player.getComponent(Components.Health);

    if (health) {
      this.healthLabel.text = 'Health:' + `${Utils.Label.leftPad(health.current)}/${Utils.Label.leftPad(health.max)}`;
    }
  }
}
