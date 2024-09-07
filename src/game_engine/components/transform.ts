import { IComponent } from '../icomponent';

export class Transform implements IComponent {
  readonly type = 'transform';

  anchorX = 0;
  anchorY = 0;

  x = 0;
  y = 0;

  scaleX = 0;
  scaleY = 0;

  width = 0;
  height = 0;

  rotation = 0;
}
