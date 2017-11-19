import { EntityMap } from '../entity';

export interface System {
  update(entities: EntityMap): void;
}
