import { SpriteSheet } from './components/sprite_sheet';
import { Texture } from './components/texture';
import { Transform } from './components/transform';
import { ReusableFactory } from './reusable_factory';

export class ComponentFactory {
  readonly ['transform'] = new ReusableFactory<Transform>((id: number) => {
    return new Transform(id);
  });

  readonly ['sprite-sheet'] = new ReusableFactory<SpriteSheet>((id: number) => {
    return new SpriteSheet(id);
  });

  readonly ['texture'] = new ReusableFactory<Texture>((id: number) => {
    return new Texture(id);
  });
}
