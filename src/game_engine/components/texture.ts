import { IComponent } from '../icomponent';

export interface IFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Texture implements IComponent {
  readonly type = 'texture';
  url: string;
  frame: IFrame = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  isVisible: boolean;

  constructor(url: string, x = 0, y = 0, width = 0, height = 0) {
    this.url = url;
    this.frame.x = x;
    this.frame.y = y;
    this.frame.width = width;
    this.frame.height = height;
    this.isVisible = false;
  }
}
