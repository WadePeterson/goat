import { Entity, EntityMap } from '../entities';
import * as Components from '../components';
import { MainState } from '../game';
import { System } from './systemUtils';

export default class InputSystem implements System {
  constructor(private state: MainState) {}

  update(entities: EntityMap) {
    const

    // const stuff = Entity.getEntitiesWithComponents(entities, [Components.Position, Components.Sprite]);

    // stuff.forEach(({ entity, components }) => {
    //   const [position, sprite] = components;
    // });
  }
}
