import { IComponent } from '../icomponent';

export class WorldBoundaries implements IComponent {
  readonly type = 'world-boundaries';

  top = -5000;
  right = 5000;
  bottom = 5000;
  left = -5000;

  constructor(top = -5000, right = 5000, bottom = -5000, left = 5000) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}
