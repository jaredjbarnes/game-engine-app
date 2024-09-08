import { IReusableIdentity } from './ireusable_identity';

export class ReusableFactory<T extends IReusableIdentity> {
  private _create: (id: number) => T;
  private _instanceCount = 0;
  private _availableInstances: T[] = [];

  constructor(create: (id: number) => T) {
    this._create = create;
  }

  create() {
    if (this._availableInstances.length > 0) {
      const instance = this._availableInstances.pop();
      return instance;
    }

    return this._create(this._instanceCount++);
  }

  release(instance: T) {
    instance.reset();
    this._availableInstances.push(instance);
  }
}
