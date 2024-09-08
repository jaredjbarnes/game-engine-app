import { Component } from './component';
import { ComponentFactory } from './component_factory';
import { IReusableIdentity } from './ireusable_identity';
import { ReusableFactory } from './reusable_factory';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractComponentType<T extends ReusableFactory<any>> = T extends ReusableFactory<
  infer U
>
  ? U
  : never;

export interface EntityDelegate {
  componentAdded(entity: Entity, component: Component): void;
  componentRemoved(entity: Entity, component: Component): void;
}

export class Entity implements IReusableIdentity {
  private _delegate: EntityDelegate | null;
  private _componentTypes: Record<string, number>;
  private _componentFactory: ComponentFactory;

  readonly id: number;
  readonly components: Component[];

  type: string;

  constructor(id: number, componentFactory: ComponentFactory, type = '') {
    this.id = id;
    this.type = type;
    this.components = [];
    this._componentTypes = {};
    this._delegate = null;
    this._componentFactory = componentFactory;
  }

  setDelegate(delegate: EntityDelegate | null) {
    this._delegate = delegate;
  }

  spawnComponent<K extends keyof ComponentFactory>(
    type: K
  ): ExtractComponentType<ComponentFactory[K]> {
    const factory = this._componentFactory[type];

    if (factory == null) {
      throw new Error('Cannot find factory.');
    }

    const component = factory.create();
    const hasType = this._componentTypes[component.type] != null;

    if (hasType) {
      this._componentTypes[component.type] += 1;
    } else {
      this._componentTypes[component.type] = 0;
    }

    this.components.push(component);

    this._delegate && this._delegate.componentAdded(this, component);

    return component as ExtractComponentType<ComponentFactory[K]>;
  }

  destroyComponent(component: Component) {
    const index = this.components.indexOf(component);
    const hasComponent = index > -1;

    if (!hasComponent) {
      throw new Error("Entity doesn't contain component.");
    }

    this._componentTypes[component.type] -= 1;
    this.components.splice(index, 1);
    this._delegate && this._delegate.componentRemoved(this, component);
  }

  getComponentsByType<K extends keyof ComponentFactory>(
    type: K
  ): ExtractComponentType<ComponentFactory[K]>[] {
    return this.components.filter(c => c.type === type) as ExtractComponentType<
      ComponentFactory[K]
    >[];
  }

  getComponentByType<K extends keyof ComponentFactory>(
    type: K
  ): ExtractComponentType<ComponentFactory[K]> {
    return this.getComponentsByType(type)[0] as ExtractComponentType<ComponentFactory[K]>;
  }

  hasComponent<K extends keyof ComponentFactory>(type: K) {
    return this.hasComponents([type]);
  }

  hasComponents<K extends keyof ComponentFactory>(types: K[]) {
    const amount = types.length;
    let count = 0;

    for (let i = 0; i < amount; i++) {
      count += Math.max(this._componentTypes[types[i]], 1) || 0;
    }

    return count >= amount;
  }

  destroyAllComponents() {
    while (this.components.length > 0) {
      this.destroyComponent(this.components.pop());
    }
  }

  reset() {
    this.type = '';
    this._delegate = null;
    this.destroyAllComponents();
  }
}
