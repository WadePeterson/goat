import { EntityMap } from '../entities';
import * as Components from '../components';
import { Action } from '../utils/inputUtils';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class InputSystem implements System {
  constructor(private state: MainState) { }

  update(entities: EntityMap) {
    for (const entityId of Object.keys(entities)) {
      const entity = entities[entityId];
      const player = entity.getComponent(Components.PlayerControllable);
      if (!player) {
        continue;
      }

      player.actions = {};

      const keys = this.state.keys;
      const pressingUp = keys.isDown(Action.MoveUp);
      const pressingDown = keys.isDown(Action.MoveDown);
      const pressingRight = keys.isDown(Action.MoveRight);
      const pressingLeft = keys.isDown(Action.MoveLeft);

      if (pressingUp !== pressingDown) {
        player.actions[pressingUp ? Action.MoveUp : Action.MoveDown] = true;
      }
      if (pressingLeft !== pressingRight) {
        player.actions[pressingLeft ? Action.MoveLeft : Action.MoveRight] = true;
      }
      if (keys.isDown(Action.Attack)) {
        player.actions[Action.Attack] = true; // TODO: Probably include more stuff, like just down and duration?
      }
    }
  }
}
