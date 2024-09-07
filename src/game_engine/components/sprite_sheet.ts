import { IComponent } from '../icomponent';
import { IFrame } from './texture';

export class SpriteSheet implements IComponent {
  readonly type = 'sprite-sheet';
  url: string;
  frames: IFrame[];

  constructor(url: string, frames: IFrame[] = []) {
    this.url = url;
    this.frames = frames;
  }
}
