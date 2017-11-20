import * as Commands from '../commands';
import * as Components from '../components';
import * as Templates from '../templates';
import { EntityMap } from '../entity';
import { MainState } from '../game';
import { System } from './systemUtils';

interface Attack {
  timeElapsed: number;
  weapon: typeof Components.Weapon._dataType;
}

export default class AttackSystem implements System {
  private attacks: { [key: string]: Attack } = {};
  constructor(private state: MainState) { }

  update(entities: EntityMap) {
    for (const entityId of Object.keys(entities)) {
      const entity = entities[entityId];

      const latestAttack = this.attacks[entityId];

      if (latestAttack) {
        latestAttack.timeElapsed += this.state.game.time.physicsElapsed;

        if (latestAttack.timeElapsed < latestAttack.weapon.attackDelay) {
          continue;
        } else {
          delete this.attacks[entityId];
        }
      }

      const weapon = entity.getComponent(Components.Weapon);
      if (!weapon) {
        continue;
      }

      const commandable = entity.getComponent(Components.Commandable);
      const commands = commandable && commandable.commands;
      const attackCommand = commands && Commands.getCommand(commands, Commands.Attack);

      if (!attackCommand) {
        continue;
      }

      const position = entity.getComponent(Components.Position);
      if (!position) {
        continue;
      }

      this.attacks[entityId] = { timeElapsed: 0, weapon };

      const attackAngle = position.angle;
      const attackSpeed = 150;
      const dX = Math.cos(attackAngle);
      const dY = Math.sin(attackAngle);
      const vX = dX * attackSpeed;
      const vY = dY * attackSpeed;

      const sprite = this.state.sprites[entityId] as Phaser.Sprite;
      const body = sprite.body as Phaser.Physics.Arcade.Body;
      const startX = body.center.x + dX * (body.halfHeight + 6);
      const startY = body.center.y + dY * (body.halfHeight + 6);

      this.state.addEntity(Templates.monkeyBullet(weapon, startX, startY, attackAngle, vX, vY));
    }
  }
}
