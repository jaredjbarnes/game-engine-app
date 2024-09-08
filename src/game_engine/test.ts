import { World } from './world';

const world = new World();
const entity = world.spawnEntity('player');
entity.hasComponents(['sprite-sheet', 'transform']);
entity.getComponentByType("transform");
entity.spawnComponent("transform")
