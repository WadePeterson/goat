import { Entity } from './entityUtils';
import * as Components from '../components';
import * as Utils from '../utils';

export function createPlayer(x: number, y: number): Entity {
  return new Entity()
    .addComponent(Components.Position({ x, y }))
    .addComponent(Components.Velocity({ x: 0, y: 0 }))
    .addComponent(Components.Health({ max: 100 }))
    .addComponent(Components.Sprite({ key: Utils.Assets.Sprites.MONKEY }));
}
