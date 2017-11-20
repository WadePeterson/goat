import { Entity, EntityMap } from '../entity';
import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class CollisionSystem implements System {
  private collisionGroup: Phaser.Group;

  constructor(private state: MainState) {
    this.collisionGroup = state.game.add.group();
    state.onEntityAdded.add(this.onEntityAdded, this);
    state.onEntityRemoved.add(this.onEntityRemoved, this);
  }

  onEntityAdded = (entity: Entity) => {
    const sprite = this.state.sprites[entity.id];
    if (sprite) {
      this.collisionGroup.add(sprite);
    }
  }

  onEntityRemoved = (__entity: Entity, sprite: Phaser.Sprite) => {
    this.collisionGroup.remove(sprite);
  }

  onCollision = (sprite1: Phaser.Sprite, sprite2: Phaser.Sprite) => {
    const entity1 = this.state.syncPhysicsForEntity(sprite1.data.entityId, true);
    const entity2 = this.state.syncPhysicsForEntity(sprite2.data.entityId, true);

    const entity1Dead = this.dealDamage(entity2, entity1) || !!entity1.getComponent(Components.Projectile);
    const entity2Dead = this.dealDamage(entity1, entity2) || !!entity2.getComponent(Components.Projectile);

    if (entity1Dead) {
      this.state.killEntity(entity1.id);
    }
    if (entity2Dead) {
      this.state.killEntity(entity2.id);
    }
  }

  dealDamage(source: Entity, target: Entity) {
    const damager = source.getComponent(Components.Projectile);
    const health = target.getComponent(Components.Health);

    if (damager && health) {
      health.current = Math.max(0, health.current - damager.damage);
      return health.current <= 0;
    }

    return false;
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
