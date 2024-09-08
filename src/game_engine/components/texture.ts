import { Component } from '../component';

export interface IFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Texture extends Component {
  url = '';
  frame: IFrame = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  isVisible = false;

  constructor(id: number) {
    super(id, 'texture');
  }

  reset() {
    this.url = '';
    this.frame.x = 0;
    this.frame.y = 0;
    this.frame.width = 0;
    this.frame.height = 0;
  }
}
