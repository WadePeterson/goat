import { Entity, EntityMap } from '../entities';
// import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class CollisionSystem implements System {
  private collisionGroup: Phaser.Group;

  constructor(private state: MainState) {
    this.collisionGroup = state.game.add.group();
    state.onEntityAdded.add(this.onEntityAdded, this);
  }

  onEntityAdded(entity: Entity) {
    const sprite = this.state.sprites[entity.id];
    if (sprite) {
      this.collisionGroup.add(sprite);
    }
  }

  update(__entities: EntityMap) {
    this.state.game.physics.arcade.collide(this.collisionGroup);

    // for (const entityId of Object.keys(entities)) {
    //   const entity = entities[entityId];
    //   const collision = entity.getComponent(Components.CollidableBox);
    //   this.game.physics.arcade.collide(this.player.sprite, this.walls);
    //   this.game.physics.arcade.overlap(this.player.sprite, this.bananas, this.eatBanana, undefined, this);
    //   this.game.physics.arcade.overlap(this.player.sprite, this.enemies, this.restart, undefined, this);
    // }
  }
}
