import { Entity } from '../entity';
import { GamePhase } from '../game_phase';
import { IComponent } from '../icomponent';
import { ISystem } from '../isystem';
import { World } from '../world';

const resolvedPromise = Promise.resolve();

export abstract class System implements ISystem {
  getPhase(): GamePhase {
    return GamePhase.LOGIC_SEQUENTIAL;
  }

  getOrdinal(): number {
    return 0;
  }

  activated(_world: World): void {
    // Do Nothing
  }

  deactivated(_world: World): void {
    // Do Nothing
  }

  systemAdded(_system: ISystem): void {
    // Do Nothing
  }

  systemRemove(_system: ISystem): void {
    // Do Nothing
  }

  entityAdded(_entity: Entity): void {
    // Do Nothing
  }

  entityRemoved(_entity: Entity): void {
    // Do Nothing
  }

  componentAdded(_entity: Entity, _component: IComponent): void {
    // Do Nothing
  }

  componentRemoved(_entity: Entity, _component: IComponent): void {
    // Do Nothing
  }

  start(time: number): void {
    // Do Nothing
  }

  stop(time: number): void {
    // Do Nothing
  }

  beforeUpdate(time: number): Promise<void> {
    return resolvedPromise;
  }

  update(time: number): Promise<void> {
    return resolvedPromise;
  }

  afterUpdate(time: number): Promise<void> {
    return resolvedPromise;
  }
}
