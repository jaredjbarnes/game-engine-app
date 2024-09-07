import { Clock } from './clock';
import { WorldBoundaries } from './components/world_boundaries';
import { Entity, EntityDelegate } from './entity';
import { IComponent } from './icomponent';
import { ISystem } from './isystem';

function sortSystems(systemA: ISystem, systemB: ISystem) {
  const aIndex = systemA.getOrdinal();
  const bIndex = systemB.getOrdinal();

  if (aIndex === 0 && bIndex === 0) {
    return 0; // both have no preference, keep original order
  }
  if (aIndex === 0) {
    return 1; // a has no preference, so it comes after b
  }
  if (bIndex === 0) {
    return -1; // b has no preference, so it comes after a
  }
  return aIndex - bIndex;
}

export class World {
  private _entityDelegate: EntityDelegate;
  private _worldEntity: Entity;
  readonly clock: Clock;
  readonly systems: ISystem[];
  readonly entites: Entity[];

  constructor(top?: number, right?: number, bottom?: number, left?: number) {
    
    this.clock = new Clock(time => {
      this.update(time);
    });

    this.systems = [];
    this.entites = [];

    this._entityDelegate = {
      componentAdded: function (entity: Entity, component: IComponent) {
        const amount = this.systems.length;
        const systems = this.systems;

        for (let i = 0; i < amount; i++) {
          systems[i].componentAdded(entity, component);
        }
      },
      componentRemoved: function (entity: Entity, component: IComponent) {
        const amount = this.systems.length;
        const systems = this.systems;

        for (let i = 0; i < amount; i++) {
          systems[i].componentRemoved(entity, component);
        }
      },
    };

    this._worldEntity = Entity.createInstance('world');
    this._worldEntity.addComponent(new WorldBoundaries(top, right, bottom, left));
    this.addEntity(this._worldEntity);
  }

  start() {
    const time = this.clock.start();

    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].start(time);
    }
  }

  stop() {
    const time = this.clock.stop();

    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].stop(time);
    }
  }

  addSystem(system: ISystem) {
    const index = this.systems.indexOf(system);
    const alreadyHasSystem = index > -1;

    if (alreadyHasSystem) {
      throw new Error('System has already been added.');
    }

    this.systems.push(system);
    system.activated(this);

    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].systemAdded(system);
    }

    this.systems.sort(sortSystems);
  }

  removeSystem(system: ISystem) {
    const index = this.systems.indexOf(system);
    const doesNotHaveSystem = index === -1;

    if (doesNotHaveSystem) {
      throw new Error('Cannot find system to remove.');
    }

    this.systems.splice(index, 1);
    system.deactivated(this);

    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].systemRemove(system);
    }
  }

  addEntity(entity: Entity) {
    // In order to keep this fast we do not check if the entity added is already added.
    this.entites.push(entity);
    entity.setDelegate(this._entityDelegate);

    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].entityAdded(entity);
    }
  }

  removeEntity(entity: Entity) {
    const index = this.entites.indexOf(entity);
    const doesNotHaveEntity = index === -1;

    if (doesNotHaveEntity) {
      throw new Error('Does not have entity.');
    }

    this.entites.splice(index, 1);
    entity.setDelegate(null);
  }

  update(time: number) {
    const amount = this.systems.length;
    const systems = this.systems;

    for (let i = 0; i < amount; i++) {
      systems[i].beforeUpdate(time);
    }

    for (let i = 0; i < amount; i++) {
      systems[i].update(time);
    }

    for (let i = 0; i < amount; i++) {
      systems[i].afterUpdate(time);
    }
  }
}
