import { Entity } from '../entities';
import * as Components from '../components';

export default class RenderSystem {
  renderedEntities: { [entityId: string]: Entity } = {};

  constructor(private game: Phaser.Game) {}

  update(entities: Entity[]) {
    const stuff = Entity.getEntitiesWithComponents(entities, [Components.Position, Components.Sprite]);
    stuff.forEach(({ entity, components }) => {
      const [position, sprite] = components;
      if (!this.renderedEntities[entity.id]) {
        this.renderedEntities[entity.id] = entity;
        this.game.add.sprite(position.x, position.y, sprite.key);
      }
    });
  }
}
