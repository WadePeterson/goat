export interface Component<T = {}> {
  type: string;
  data: T;
}

export type ComponentFunction<T> = { type: string } & ((data: T) => Component<T>);
type PartialComponentFunction<T> = { type: string } & ((data: Partial<T>) => Component<T>);
type ComponentInitalizer<T, T2> = (data: T2) => T;

function component<T>(type: string): ComponentFunction<T>;
function component<T, T2>(type: string, initializer: ComponentInitalizer<T, T2>): PartialComponentFunction<T>;
function component<T, T2>(type: string, initializer?: ComponentInitalizer<T, T2>) {
  const fn = (data: any) => {
    if (initializer) {
      data = initializer(data);
    }
    return { type, data };
  };

  return Object.assign(fn, { type });
}

export const Position = component<{ x: number; y: number; }>('position');
export const Velocity = component<{ x: number; y: number; }>('velocity');
export const Player = component('player');
export const Sprite = component<{ key: string; }>('sprite');
export const Health = component('health', (data: { current?: number; max: number }) => {
  return { current: data.current || data.max, max: data.max };
});
