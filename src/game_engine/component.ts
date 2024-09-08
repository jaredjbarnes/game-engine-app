import { IReusableIdentity } from './ireusable_identity';

export abstract class Component implements IReusableIdentity {
  readonly id: number;
  readonly type: string;

  constructor(id: number, type: string) {
    this.id = id;
    this.type = type;
  }

  abstract reset(): void;
}
