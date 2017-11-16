import { Component, ComponentFunction } from '../components';

let idCounter = 0;

function leftPad(input: string, width: number, char: string = '0') {
  return input.length >= width ? input : char.repeat(width - input.length) + input;
}

function generateId() {
  return new Date().getTime().toString(36) +
    leftPad((idCounter++).toString(36).substr(0, 4), 4) +
    leftPad(Math.random().toString(36).substr(2, 9), 9);
}

export class Entity {
  private _components: Component[];
  private _componentsByType: { [type: string]: Component } = {};

  readonly id: string;

  constructor() {
    this.id = generateId();
    this._components = [];
  }

  static getEntitiesWithComponents<T1, T2>(entities: Entity[], [c1, c2]: [ComponentFunction<T1>, ComponentFunction<T2>]): Array<{ entity: Entity; components: [T1, T2] }>;
  static getEntitiesWithComponents<T1, T2, T3>(entities: Entity[], [c1, c2, c3]: [ComponentFunction<T1>, ComponentFunction<T2>, ComponentFunction<T3>]): Array<{ entity: Entity; components: [T1, T2, T3] }>;
  static getEntitiesWithComponents<T1, T2, T3, T4>(entities: Entity[], [c1, c2, c3, c4]: [ComponentFunction<T1>, ComponentFunction<T2>, ComponentFunction<T3>, ComponentFunction<T4>]): Array<{ entity: Entity; components: [T1, T2, T3, T4] }>;
  static getEntitiesWithComponents(entities: Entity[], compFns: ComponentFunction<any>[]): any {
    const results = [];

    for (const entity of entities) {
      let components: any[] | null = [];
      for (const compFn of compFns) {
        const component = entity.getComponent(compFn);
        if (!component) {
          components = null;
          break;
        }
        components.push(compFn);
      }

      if (components) {
        results.push({ entity, components });
      }
    }

    return results;
  }

  addComponent(component: Component) {
    this._components.push(component);
    this._componentsByType[component.type] = component;
    return this;
  }

  removeComponent(componentType: string) {
    const componentConfig = this._componentsByType[componentType];
    if (componentConfig) {
      delete this._componentsByType[componentType];
      const index = this._components.findIndex(c => c.type === componentType);
      this._components.splice(index, 1);
    }
  }

  getComponent<T>(componentFn: ComponentFunction<T>): Component<T> | null {
    const component = this._componentsByType[componentFn.type];
    return component ? component as Component<T> : null;
  }
}
