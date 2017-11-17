import { Entity, EntityMap } from '../entities';
import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class RenderSystem implements System {
  constructor(private game: Phaser.Game, private state: MainState) {
    state.onEntityAdded.add(this.onEntityAdded, this);
  }

  onEntityAdded(entity: Entity) {
    const [spriteComp, player, position, velocity] = entity.getComponents(Components.Sprite, Components.PlayerControllable, Components.Position, Components.Velocity);

    if (spriteComp) {
      const sprite = this.game.add.sprite(position ? position.x : 0, position ? position.y : 0, spriteComp.key);
      const body: Phaser.Physics.Arcade.Body = sprite.body;

      this.state.sprites[entity.id] = sprite;

      if (!velocity) {
        body.immovable = true;
      }

      if (player) {
        body.collideWorldBounds = true;
        body.setSize(14, 13, 1, 3);

        sprite.checkWorldBounds = true;
        sprite.animations.add('walking', [0, 1, 2, 3], 10, true);
        sprite.anchor.x = 1;
        sprite.anchor.y = 0;

        this.game.camera.follow(sprite);
      }
    }
  }

  update(__entities: EntityMap) {
    // const stuff = Entity.getEntitiesWithComponents(entities, [Components.Position, Components.Sprite]);

    // stuff.forEach(({ entity, components }) => {
    //   const [position, sprite] = components;
    // });
  }
}
