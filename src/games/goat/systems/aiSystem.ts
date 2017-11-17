import { EntityMap } from '../entities';
import { Action } from '../utils/inputUtils';
import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class AISystem implements System {
  constructor(__state: MainState) { }

  update(entities: EntityMap) {
    const aiControlledEntities = [];
    const players = [];

    for (const entityId of Object.keys(entities)) {
      const entity = entities[entityId];
      const [player, ai, position] = entity.getComponents(Components.PlayerControllable, Components.AIControllable, Components.Position);

      if (!position) {
        continue;
      }

      if (player) {
        players.push({ entity, player, position });
      } else if (ai) {
        aiControlledEntities.push({ entity, ai, position });
      }
    }

    for (const aiEntity of aiControlledEntities) {
      let nearestPlayer: typeof players[0] | null = null;
      let nearestDistance = 0;

      for (const player of players) {
        const distance = Phaser.Math.distance(aiEntity.position.x, aiEntity.position.y, player.position.x, player.position.y);
        if (!nearestPlayer || distance < nearestDistance) {
          nearestPlayer = player;
          nearestDistance = distance;
        }
      }

      if (nearestPlayer) {
        aiEntity.ai.actions = {};

        if (nearestPlayer.position.x < aiEntity.position.x) {
          aiEntity.ai.actions[Action.MoveLeft] = true;
        } else if (nearestPlayer.position.x > aiEntity.position.x) {
          aiEntity.ai.actions[Action.MoveRight] = true;
        }

        if (nearestPlayer.position.y > aiEntity.position.y) {
          aiEntity.ai.actions[Action.MoveDown] = true;
        } else if (nearestPlayer.position.y < aiEntity.position.y) {
          aiEntity.ai.actions[Action.MoveUp] = true;
        }
      }
    }
  }
}
