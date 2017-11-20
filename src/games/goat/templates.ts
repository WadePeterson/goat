import * as Components from './components';
import * as Utils from './utils';
import { Entity } from './entity';

export function player(x: number, y: number) {
  return new Entity().addComponents([
    Components.Player(),
    Components.Weapon({ damage: 1, attackDelay: 0.5 }),
    Components.Commandable(),
    Components.CollidableBox({ width: 14, height: 13, offsetX: 1, offsetY: 3 }),
    Components.Position({ x, y }),
    Components.Velocity(),
    Components.Health({ max: 100 }),
    Components.Sprite({ key: Utils.Assets.Sprites.MONKEY, animations: [{ name: 'walking', frames: [0, 1, 2, 3], loop: true, frameRate: 10 }] })
  ]);
}

export function pig(x: number, y: number) {
  return new Entity().addComponents([
    Components.Sprite({ key: Utils.Assets.Sprites.PIG, animations: [{ name: 'walking', frames: [0, 1, 2, 3], frameRate: 15, loop: true, autoPlay: true }] }),
    Components.Position({ x, y }),
    Components.CollidableBox({ width: 14, height: 10, offsetX: 1, offsetY: 3 }),
    Components.AI(),
    Components.Commandable(),
    Components.Velocity({ maxSpeed: 40 }),
    Components.DamagesOnCollision({ damage: 1 }),
    Components.Health({ max: 5 })
  ]);
}

export function monkeyBullet(weapon: typeof Components.Weapon._dataType, x: number, y: number, angle: number, vX: number, vY: number) {
  return new Entity().addComponents([
    Components.DamagesOnCollision({ damage: weapon.damage }),
    Components.DestroyedOnCollision(),
    Components.CollidableBox({ width: 4, height: 4, offsetX: 2, offsetY: 2 }),
    Components.Sprite({ key: Utils.Assets.Sprites.BULLET, animations: [{ name: 'walking', frames: [0, 1, 2, 3], frameRate: 15, loop: true, autoPlay: true }] }),
    Components.Position({ x, y, angle }),
    Components.Velocity({ x: vX, y: vY })
  ]);
}
