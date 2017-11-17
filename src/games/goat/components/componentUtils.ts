import * as Utils from '../utils';

export interface Component<T = {}> {
  type: string;
  data: T;
}

export type ComponentFunction<T> = { type: string } & ((data: T) => Component<T>);
type ComponentFunctionNoArgs = { type: string } & (() => Component);
type PartialComponentFunction<T> = { type: string } & ((data?: Partial<T>) => Component<T>);
type ComponentInitalizer<T, T2> = (data: T2) => T;

function component(type: string): ComponentFunctionNoArgs;
function component<T>(type: string): ComponentFunction<T>;
function component<T>(type: string, defaultValue: T): PartialComponentFunction<T>;
function component<T, T2>(type: string, initializer: ComponentInitalizer<T, T2>): PartialComponentFunction<T>;
function component<T, T2>(type: string, initializerOrDefault?: ComponentInitalizer<T, T2> | T): any {
  const fn = (data: any) => {
    if (initializerOrDefault) {
      data = typeof initializerOrDefault === 'function' ? initializerOrDefault(data) : Object.assign({}, initializerOrDefault, data);
    }
    return { type, data };
  };

  return Object.assign(fn, { type });
}

export const Position = component<{ x: number; y: number; }>('position');
export const Velocity = component<{ x: number; y: number; }>('velocity', { x: 0, y: 0 });
export const PlayerControllable = component<{ action: Utils.Input.Action | null }>('player', { action: null });
export const Sprite = component<{ key: string; }>('sprite');
export const Health = component('health', (data: { current?: number; max: number }) => {
  return { current: data.current || data.max, max: data.max };
});
