import { Clock } from './clock';
import { Entity, EntityDelegate } from './entity';
import { Component } from './component';
import { ISystem } from './isystem';
import { ReusableFactory } from './reusable_factory';
import { ComponentFactory } from './component_factory';

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
  private _entityFactory: ReusableFactory<Entity>;
  private _systems: ISystem[];
  private _entites: Entity[];
  private _componentFactory = new ComponentFactory();

  readonly clock: Clock;

  constructor() {
    this._entityFactory = new ReusableFactory((id: number) => {
      return new Entity(id, this._componentFactory);
    });

    this.clock = new Clock(time => {
      this.update(time);
    });

    this._systems = [];
    this._entites = [];

    this._entityDelegate = {
      componentAdded: function (entity: Entity, component: Component) {
        const amount = this.systems.length;
        const systems = this.systems;

        for (let i = 0; i < amount; i++) {
          systems[i].componentAdded(entity, component);
        }
      },
      componentRemoved: function (entity: Entity, component: Component) {
        const amount = this.systems.length;
        const systems = this.systems;

        for (let i = 0; i < amount; i++) {
          systems[i].componentRemoved(entity, component);
        }
      },
    };
  }

  start() {
    const time = this.clock.start();

    const amount = this._systems.length;
    const systems = this._systems;

    for (let i = 0; i < amount; i++) {
      systems[i].start(time);
    }
  }

  stop() {
    const time = this.clock.stop();

    const amount = this._systems.length;
    const systems = this._systems;

    for (let i = 0; i < amount; i++) {
      systems[i].stop(time);
    }
  }

  addSystem(system: ISystem) {
    const index = this._systems.indexOf(system);
    const alreadyHasSystem = index > -1;

    if (alreadyHasSystem) {
      throw new Error('System has already been added.');
    }

    this._systems.push(system);
    system.activated(this);

    const amount = this._systems.length;
    const systems = this._systems;

    for (let i = 0; i < amount; i++) {
      systems[i].systemAdded(system);
    }

    this._systems.sort(sortSystems);
  }

  removeSystem(system: ISystem) {
    const index = this._systems.indexOf(system);
    const doesNotHaveSystem = index === -1;

    if (doesNotHaveSystem) {
      throw new Error('Cannot find system to remove.');
    }

    this._systems.splice(index, 1);
    system.deactivated(this);

    const amount = this._systems.length;
    const systems = this._systems;

    for (let i = 0; i < amount; i++) {
      systems[i].systemRemove(system);
    }
  }

  spawnEntity(type: string) {
    const entity = this._entityFactory.create();
    entity.type = type;

    this._entites.push(entity);
    entity.setDelegate(this._entityDelegate);

    const amount = this._systems.length;
    const systems = this._systems;

    for (let i = 0; i < amount; i++) {
      systems[i].entityAdded(entity);
    }

    return entity;
  }

  destroyEntity(entity: Entity) {
    const index = this._entites.indexOf(entity);
    const doesNotHaveEntity = index === -1;

    if (doesNotHaveEntity) {
      throw new Error('Does not have entity.');
    }

    this._entites.splice(index, 1);
    this._entityFactory.release(entity);
  }

  update(time: number) {
    const amount = this._systems.length;
    const systems = this._systems;

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
