import { Component, ComponentCreator } from './components';

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

  addComponent(component: Component) {
    this._components.push(component);
    this._componentsByType[component.type] = component;
    return this;
  }

  addComponents(components: Component[]) {
    for (const component of components) {
      this.addComponent(component);
    }
    return this;
  }

  getComponent<T>(componentType: ComponentCreator<T>): T | null {
    const comp = this._componentsByType[componentType.type];
    return comp ? comp.data : null;
  }
}

export interface EntityMap { [key: string]: Entity; }
