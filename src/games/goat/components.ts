import { createTypeDefiner, TypedData, TypeDef } from './utils/dataUtils';
import { Command } from './commands';
import { AnimationConfig } from './utils/assetUtils';

const component = createTypeDefiner('component');
export type ComponentCreator<T = any> = TypeDef<T, 'component'>;
export type Component<T = any> = TypedData<T, 'component'>;

export const Position = component('position', (data: { x: number; y: number; angle?: number }) => {
  return { x: data.x, y: data.y, angle: data.angle || 0};
});
export type Position = typeof Position._dataType;

export const Velocity = component<{ x: number; y: number; maxSpeed: number }>('velocity', { x: 0, y: 0, maxSpeed: 90 });
export type Velocity = typeof Velocity._dataType;

export const AI = component('ai');
export const Player = component('player');
export const Commandable = component<{ commands: { [key: string]: Command } }>('commandable', { commands: {} });
export const Sprite = component<{ key: string; animations?: AnimationConfig[] }>('sprite');
export const Health = component('health', (data: { current?: number; max: number }) => {
  return { current: data.current || data.max, max: data.max };
});
export const CollidableBox = component<{ width: number; height: number; offsetX: number; offsetY: number }>('collidablebox', { width: 0, height: 0, offsetX: 0, offsetY: 0 });
export const Weapon = component<{ damage: number; attackDelay: number }>('weapon');

export const DamagesOnCollision = component<{ damage: number }>('damagesonimpact');
export const DestroyedOnCollision = component('destroyedonimpact');
