import { IComponent } from './icomponent';
import { Entity } from './entity';
import { World } from './world';
import { GamePhase } from './game_phase';

export interface ISystem {
  getPhase(): GamePhase;
  getOrdinal(): number;

  activated(world: World): void;
  deactivated(world: World): void;

  systemAdded(system: ISystem): void;
  systemRemove(system: ISystem): void;

  entityAdded(entity: Entity): void;
  entityRemoved(entity: Entity): void;

  componentAdded(entity: Entity, component: IComponent): void;
  componentRemoved(entity: Entity, component: IComponent): void;

  start(time: number): void;
  stop(time: number): void;

  beforeUpdate(time: number): Promise<void>;
  update(time: number): Promise<void>;
  afterUpdate(time: number): Promise<void>;
}
