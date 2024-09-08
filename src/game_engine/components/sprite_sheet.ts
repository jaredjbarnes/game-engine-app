import { Component } from '../component';
import { IFrame } from './texture';

export class SpriteSheet extends Component {
  url = '';
  frames: IFrame[] = [];

  constructor(id: number) {
    super(id, 'sprite-sheet');
  }

  reset() {
    this.url = '';
    this.frames.length = 0;
  }
}
