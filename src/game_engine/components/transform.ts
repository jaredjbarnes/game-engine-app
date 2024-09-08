import { Component } from '../component';

export class Transform extends Component {
  x = 0;
  y = 0;

  width = 0;
  height = 0;

  anchorX = 0.5;
  anchorY = 0.5;

  scaleX = 1;
  scaleY = 1;

  rotation = 0;

  constructor(id: number) {
    super(id, 'transform');
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
  }
}
