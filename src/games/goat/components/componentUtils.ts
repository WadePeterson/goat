export interface Component<T = {}> {
  type: string;
  data: T;
}

export type ComponentFunction<T, T2 = T> = { type: string } & ((data: T2) => Component<T>);
type Primitive = boolean | number | string | null | undefined;
interface PlainObject { [key: string]: Primitive | PlainObject; }
type ComponentFunctionNoArgs = { type: string } & (() => Component);
type PartialComponentFunction<T> = { type: string } & ((data?: Partial<T>) => Component<T>);
type ComponentInitalizer<T, T2> = (data: T2) => T;

function component(type: string): ComponentFunctionNoArgs;
function component<T>(type: string): ComponentFunction<T>;
function component<T extends PlainObject>(type: string, defaultValue: T): PartialComponentFunction<T>;
function component<T, T2>(type: string, initializer: ComponentInitalizer<T, T2>): ComponentFunction<T, T2>;
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
export const Velocity = component<{ x: number; y: number; maxSpeed: number }>('velocity', { x: 0, y: 0, maxSpeed: 90 });
export const PlayerControllable = component<{ actions: { [key: string]: any } }>('player', { actions: {} });
export const Sprite = component<{ key: string; }>('sprite');
export const Health = component('health', (data: { current?: number; max: number }) => {
  return { current: data.current || data.max, max: data.max };
});
export const CollidableBox = component('collidablebox', (data: { width: number; height: number; offsetX?: number; offsetY?: number }) => {
  return { width: data.width, height: data.height, offsetX: data.offsetX || 0, offsetY: data.offsetY || 0 };
});
