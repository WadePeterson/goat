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
  private _componentsByType: { [type: string]: Component };

  readonly id: string;

  constructor() {
    this.id = generateId();
    this._components = [];
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

  getComponent<C extends string, T>(componentFn: ComponentFunction<C, T>): Component<C, T> | null {
    const component = this._componentsByType[componentFn.type];
    return component ? component as Component<C, T> : null;
  }
}
