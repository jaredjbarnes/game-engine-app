import { IComponent } from './icomponent';

export interface EntityDelegate {
  componentAdded(entity: Entity, component: IComponent): void;
  componentRemoved(entity: Entity, component: IComponent): void;
}

export class Entity {
  private static _totalEntityCount = 0;
  private static _availablePool: Entity[];

  readonly id: number;
  readonly components: IComponent[];

  private _type: string;
  private _delegate: EntityDelegate | null;
  private _componentTypes: Record<string, number>;

  get type() {
    return this._type;
  }

  // We make this private so that we can control the id's of the entities.
  // The ids will be used with the gpus and other systems to track entity data.
  private constructor(id: number, type: string) {
    this.id = id;
    this._type = type;
    this.components = [];
    this._componentTypes = {};
    this._delegate = null;
  }

  setDelegate(delegate: EntityDelegate | null) {
    this._delegate = delegate;
  }

  addComponent(component: IComponent) {
    const hasType = this._componentTypes[component.type] != null;

    if (hasType) {
      this._componentTypes[component.type] += 1;
    } else {
      this._componentTypes[component.type] = 0;
    }

    this.components.push(component);

    this._delegate && this._delegate.componentAdded(this, component);
  }

  removeComponent(component: IComponent) {
    const index = this.components.indexOf(component);
    const hasComponent = index > -1;

    if (!hasComponent) {
      throw new Error("Entity doesn't contain component.");
    }

    this._componentTypes[component.type] -= 1;

    this.components.splice(index, 1);
    this._delegate && this._delegate.componentRemoved(this, component);
  }

  getComponentsByType<T>(type: string) {
    return this.components.filter(c => c.type === type) as T[];
  }

  getComponentByType<T>(type: string) {
    return this.getComponentsByType(type)[0] as T;
  }

  hasComponent(type: string) {
    return this.hasComponents([type]);
  }

  hasComponents(types: string[]) {
    const amount = types.length;
    let count = 0;

    for (let i = 0; i < amount; i++) {
      count += this._componentTypes[types[i]] || 0;
    }

    return count >= amount;
  }

  removeAllComponents() {
    this.components.length = 0;
    this._componentTypes = {};
  }

  static createInstance(type: string) {
    if (Entity._availablePool.length > 0) {
      const entity = Entity._availablePool.pop();
      entity._type = type;
      return entity;
    }

    const entity = new Entity(Entity._totalEntityCount++, type);
    return entity;
  }

  static destroyInstance(entity: Entity) {
    entity.removeAllComponents();
    entity._delegate = null;

    this._availablePool.push(entity);
  }
}
