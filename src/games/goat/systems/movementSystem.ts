import { EntityMap } from '../entities';
import * as Components from '../components';
import { Action } from '../utils/inputUtils';
import { sinPiOver4 } from '../utils/mathUtils';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class MovementSystem implements System {
  constructor(private state: MainState) { }

  update(entities: EntityMap) {
    for (const entityId of Object.keys(entities)) {
      const entity = entities[entityId];
      const [player, ai, velocity, position] = entity.getComponents(Components.PlayerControllable, Components.AIControllable, Components.Velocity, Components.Position);

      if (!velocity || !position) {
        continue;
      }

      const sprite = this.state.sprites[entity.id];
      const body = sprite && sprite.body as Phaser.Physics.Arcade.Body;
      const actions = (player && player.actions) || (ai && ai.actions) || {};

      if (body) {
        velocity.x = body.velocity.x;
        velocity.y = body.velocity.y;
        position.x = body.position.x;
        position.y = body.position.y;
      }

      if (actions) {
        let directionX = 0;
        let directionY = 0;

        if (actions[Action.MoveLeft]) {
          directionX = -1;
        } else if (actions[Action.MoveRight]) {
          directionX = 1;
        }

        if (actions[Action.MoveUp]) {
          directionY = -1;
        } else if (actions[Action.MoveDown]) {
          directionY = 1;
        }

        if (directionX && directionY) {
          directionX = directionX * sinPiOver4;
          directionY = directionY * sinPiOver4;
        }

        velocity.x = velocity.maxSpeed * directionX;
        velocity.y = velocity.maxSpeed * directionY;

        if (body) {
          body.velocity.x = velocity.x;
          body.velocity.y = velocity.y;
        }
      }
    }
  }
}
