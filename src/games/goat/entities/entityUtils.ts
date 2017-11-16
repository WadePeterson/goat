import { Component, ComponentType } from '../components';

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
  private _components: Component<any>[];
  private _componentsByType: { [type: string]: Component<any> };

  readonly id: string;

  constructor() {
    this.id = generateId();
    this._components = [];
  }

  addComponent(component: Component<any>) {
    this._components.push(component);
    this._componentsByType[component.type] = component;
    return this;
  }

  removeComponent(componentType: ComponentType) {
    const componentConfig = this._componentsByType[componentType];
    if (componentConfig) {
      delete this._componentsByType[componentType];
      const index = this._components.findIndex(c => c.type === componentType);
      this._components.splice(index, 1);
    }
  }

  getComponent<T extends ComponentType>(componentType: T): Component<T> | null {
    return this._componentsByType[componentType] || null;
  }

  hasComponent(componentType: ComponentType) {
    return !!this.getComponent(componentType);
  }
}
