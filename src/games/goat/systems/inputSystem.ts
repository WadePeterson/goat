import * as Commands from '../commands';
import * as Components from '../components';
import { EntityMap } from '../entity';
import { Action } from '../utils/inputUtils';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class InputSystem implements System {
  constructor(private state: MainState) { }

  update(entities: EntityMap) {
    for (const entityId of Object.keys(entities)) {
      const entity = entities[entityId];
      const player = entity.getComponent(Components.Player);
      const commandable = entity.getComponent(Components.Commandable);
      const position = entity.getComponent(Components.Position);

      if (!player || !commandable) {
        continue;
      }

      const keys = this.state.keys;
      const pressingUp = keys.isDown(Action.MoveUp);
      const pressingDown = keys.isDown(Action.MoveDown);
      const pressingRight = keys.isDown(Action.MoveRight);
      const pressingLeft = keys.isDown(Action.MoveLeft);

      commandable.commands = {};

      if (keys.justDown(Action.MoveRight)) {
        Commands.addCommand(commandable.commands, Commands.Turn({ angle: 0 }));
      } else if (keys.justDown(Action.MoveLeft)) {
        Commands.addCommand(commandable.commands, Commands.Turn({ angle: Math.PI }));
      } else if (keys.justDown(Action.MoveUp)) {
        Commands.addCommand(commandable.commands, Commands.Turn({ angle: Phaser.Math.PI2 - Phaser.Math.HALF_PI }));
      } else if (keys.justDown(Action.MoveDown)) {
        Commands.addCommand(commandable.commands, Commands.Turn({ angle: Phaser.Math.HALF_PI }));
      }

      if (pressingUp !== pressingDown) {
        Commands.addCommand(commandable.commands, pressingUp ? Commands.MoveUp() : Commands.MoveDown());
      }
      if (pressingLeft !== pressingRight) {
        Commands.addCommand(commandable.commands, pressingLeft ? Commands.MoveLeft() : Commands.MoveRight());
      }

      if (keys.isDown(Action.Attack)) {
        Commands.addCommand(commandable.commands, Commands.Attack({ angle: position ? position.angle : 0 }));
      }
    }
  }
}
