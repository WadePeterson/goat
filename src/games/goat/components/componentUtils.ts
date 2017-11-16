function defineComponent<TData = null>(): TData {
  return null as any;
}

const componentDataTypes = {
  Position: defineComponent<{ x: number; y: number }>(),
  Velocity: defineComponent<{ x: number; y: number }>(),
  Sprite: defineComponent<{ path: string }>(),
  Player: defineComponent(),
  Health: defineComponent<{ current: number; max: number }>()
};

export type ComponentType = keyof typeof componentDataTypes;
export interface Component<T extends ComponentType> { type: T; }

type ComponentMap = typeof componentDataTypes;
function generateComponentFunctions(map: ComponentMap): { [P in keyof ComponentMap]: Component<P> & ((data?: ComponentMap[P]) => Component<P> & ComponentMap[P] ) } {
  return Object.keys(map).reduce((acc, type) => {
    const fn: any = (data: null) => Object.assign({ type }, data);
    Object.assign(fn, { type });
    return Object.assign(acc, { [type]: (map as any)[type] });
  }, {}) as any;
}

export const Components = generateComponentFunctions(componentDataTypes);
