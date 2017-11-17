import { EntityMap } from '../entities';

export interface System {
  update(entities: EntityMap): void;
}
