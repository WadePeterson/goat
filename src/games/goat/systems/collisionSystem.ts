import { Entity, EntityMap } from '../entity';
// import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class CollisionSystem implements System {
  private collisionGroup: Phaser.Group;

  constructor(private state: MainState) {
    this.collisionGroup = state.game.add.group();
    state.onEntityAdded.add(this.onEntityAdded, this);
  }

  onEntityAdded = (entity: Entity) => {
    const sprite = this.state.sprites[entity.id];
    if (sprite) {
      this.collisionGroup.add(sprite);
    }
  }

  onCollision = (sprite1: Phaser.Sprite, sprite2: Phaser.Sprite) => {
    this.state.syncPhysicsForEntity(sprite1.data.entityId, true);
    this.state.syncPhysicsForEntity(sprite2.data.entityId, true);
  }

  update(__entities: EntityMap) {
    // TODO: This is called for all sprites, including walls trying to collide with other walls
    this.state.game.physics.arcade.collide(this.collisionGroup, undefined, this.onCollision);

    // for (const entityId of Object.keys(entities)) {
    //   const entity = entities[entityId];
    //   const collision = entity.getComponent(Components.CollidableBox);
    //   this.game.physics.arcade.collide(this.player.sprite, this.walls);
    //   this.game.physics.arcade.overlap(this.player.sprite, this.bananas, this.eatBanana, undefined, this);
    //   this.game.physics.arcade.overlap(this.player.sprite, this.enemies, this.restart, undefined, this);
    // }
  }
}
