export type Component<C extends string = string, T = {}> = { type: C } & T;

type ComponentFunctionNoArgs<C extends string> = { type: C } & (() => Component<C>);
export type ComponentFunction<C extends string, T> = { type: C } & ((data: T) => Component<C, T>);

type ComponentBuilderNoArgs = <C extends string>(type: C) => ComponentFunctionNoArgs<C>;
type ComponentBuilder<T> = <C extends string>(type: C) => ComponentFunction<C, T>;

function component(): ComponentBuilderNoArgs;
function component<T>(defaultValue?: T): ComponentBuilder<T>;
function component<T>(defaultValue?: T): ComponentBuilder<T> {
  return (type: string): any => {
    const fn = (data: any): any => {
      return Object.assign({ type }, defaultValue, data);
    };
    return Object.assign(fn, { type });
  };
}

export interface Position { x: number; y: number; }
export const Position = component<Position>()('position');

export interface Velocity { x: number; y: number; }
export const Velocity = component<Velocity>()('velocity');

export interface Player {}
export const Player = component<Player>()('player');

export interface Sprite { path: string; }
export const Sprite = component<Sprite>()('sprite');

export interface Health { current: number; max: number; }
export const Health = component<Health>()('health');
