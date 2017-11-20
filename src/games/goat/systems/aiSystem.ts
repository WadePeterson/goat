import { EntityMap } from '../entity';
import * as Commands from '../commands';
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
      const position = entity.getComponent(Components.Position);

      if (!position) {
        continue;
      }

      if (entity.getComponent(Components.Player)) {
        players.push({ entity, position });
      } else if (entity.getComponent(Components.AI)) {
        aiControlledEntities.push({ entity, position });
      }
    }

    for (const aiEntity of aiControlledEntities) {
      let nearestPlayer: typeof players[0] | null = null;
      let nearestDistance = 150;

      const commandable = aiEntity.entity.getComponent(Components.Commandable);
      if (!commandable) {
        continue;
      }

      commandable.commands = {};

      for (const player of players) {
        const distance = Phaser.Math.distance(aiEntity.position.x, aiEntity.position.y, player.position.x, player.position.y);
        if (distance < nearestDistance) {
          nearestPlayer = player;
          nearestDistance = distance;
        }
      }

      if (nearestPlayer) {
        Commands.addCommand(commandable.commands, Commands.MoveToPoint({ x: nearestPlayer.position.x, y: nearestPlayer.position.y }));
      }
    }
  }
}
