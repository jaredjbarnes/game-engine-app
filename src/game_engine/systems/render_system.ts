import { Application, Assets, Sprite as PixiSprite } from 'pixi.js';
import { Entity } from '../entity';
import { Texture } from '../components/texture';
import { Transform } from '../components/transform';
import { System } from './system';

export class RenderSystem extends System {
  private _pixiApplication: Application;
  private _pixiSprites: Record<string, PixiSprite>;
  private _loadingSprites: Record<string, Promise<void>>;

  get canvas() {
    return this._pixiApplication.canvas;
  }

  constructor() {
    super();
    this._pixiApplication = new Application();
    this._pixiSprites = {};
    this._loadingSprites = {};
  }

  entityAdded(entity: Entity) {
    const addSprite = this._isMatch(entity) && this._shouldAdd(entity);

    if (!addSprite) {
      return;
    }

    const sprite = entity.getComponentByType('texture') as Texture;
    const transform = entity.getComponentByType('transform') as Transform;

    this._loadingSprites[entity.id] = Assets.load(sprite.url).then(texture => {
      const shouldAdd = this._loadingSprites[entity.id];

      if (!shouldAdd) {
        return;
      }

      this._pixiSprites[entity.id] = new PixiSprite({
        x: sprite.frame.x,
        y: sprite.frame.y,
        width: sprite.frame.width,
        height: sprite.frame.height,
        anchor: { x: transform.anchorX, y: transform.anchorY },
        texture,
      });
    });
  }

  private _isMatch(entity: Entity) {
    return entity.hasComponents(['transform', 'sprite']);
  }

  private _shouldAdd(entity: Entity) {
    return (this._loadingSprites[entity.id] || this._pixiSprites[entity.id]) == null;
  }

  entityRemoved(entity: Entity) {
    if (this._loadingSprites[entity.id]) {
      delete this._loadingSprites[entity.id];
      return;
    }

    if (this._pixiSprites[entity.id]) {
      delete this._pixiSprites[entity.id];
    }
  }
}
