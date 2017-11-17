export enum Action {
  Attack = 'attack',
  MenuDown = 'menudown',
  MenuSelect = 'menuselect',
  MenuUp = 'menuup',
  MoveLeft = 'moveleft',
  MoveRight = 'moveright',
  MoveUp = 'moveup',
  MoveDown = 'movedown',
  OpenPauseMenu = 'openmenu'
}

interface ActionKeyCodeMap {
  [key: string]: number[];
}

export const defaultActionKeyMap: ActionKeyCodeMap = {
  // Menus
  [Action.OpenPauseMenu]: [Phaser.KeyCode.ESC],
  [Action.MenuUp]: [Phaser.KeyCode.UP, Phaser.KeyCode.W],
  [Action.MenuDown]: [Phaser.KeyCode.DOWN, Phaser.KeyCode.S],
  [Action.MenuSelect]: [Phaser.KeyCode.ENTER, Phaser.KeyCode.SPACEBAR],

  // Player
  [Action.Attack]: [Phaser.KeyCode.SPACEBAR],
  [Action.MoveUp]: [Phaser.KeyCode.UP, Phaser.KeyCode.W],
  [Action.MoveDown]: [Phaser.KeyCode.DOWN, Phaser.KeyCode.S],
  [Action.MoveLeft]: [Phaser.KeyCode.LEFT, Phaser.KeyCode.A],
  [Action.MoveRight]: [Phaser.KeyCode.RIGHT, Phaser.KeyCode.D]
};

interface ActionKeyMap {
  [key: string]: Phaser.Key[];
}

export class KeyMap {
  private actionMap: ActionKeyMap;

  constructor(game: Phaser.Game, actionKeyMap = defaultActionKeyMap) {
    this.actionMap = Object.keys(actionKeyMap).reduce((acc, action) => {
      const keys = actionKeyMap[action].map(keyCode => {
        game.input.keyboard.addKeyCapture(keyCode);
        return game.input.keyboard.addKey(keyCode);
      });
      return Object.assign(acc, { [action]: keys });
    }, {} as { [key: string]: Phaser.Key[] });
  }

  private getKeys(action: Action) {
    return this.actionMap[action];
  }

  isDown(action: Action) {
    return this.getKeys(action).some(key => key.isDown);
  }

  justDown(action: Action) {
    return this.getKeys(action).some(key => key.justDown);
  }

  justUp(action: Action) {
    return this.getKeys(action).some(key => key.justUp);
  }

  reset(action: Action) {
    this.getKeys(action).forEach(key => key.reset());
  }

  duration(action: Action) {
    let longestHeldDownKey: Phaser.Key | null = null;
    let mostRecentlyReleasedKey: Phaser.Key | null = null;

    for (const key of this.getKeys(action)) {
      if (key.isDown) {
        if (!longestHeldDownKey || key.timeDown < longestHeldDownKey.timeDown) {
          longestHeldDownKey = key;
        }
      } else if (key.duration) {
        if (!mostRecentlyReleasedKey || key.timeUp > mostRecentlyReleasedKey.timeUp) {
          mostRecentlyReleasedKey = key;
        }
      }
    }

    if (longestHeldDownKey) {
      return longestHeldDownKey.duration;
    } else if (mostRecentlyReleasedKey) {
      return mostRecentlyReleasedKey.duration;
    }

    return 0;
  }
}
