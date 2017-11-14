interface Action {
  value: string;
  _isAction: true;
}

function defineAction(value: string): Action {
  return { _isAction: true, value };
}

export const Actions = {
  Jump: defineAction('jump'),
  MenuDown: defineAction('menudown'),
  MenuSelect: defineAction('menuselect'),
  MenuUp: defineAction('menuup'),
  MoveLeft: defineAction('moveleft'),
  MoveRight: defineAction('moveright'),
  NextLevel: defineAction('nextlevel'),
  OpenPauseMenu: defineAction('openmenu'),
  PrevLevel: defineAction('prevlevel'),
};

interface ActionKeyCodeMap {
  [key: string]: number[];
}

export const defaultActionKeyMap: ActionKeyCodeMap = {
  [Actions.MenuDown.value]: [Phaser.KeyCode.DOWN, Phaser.KeyCode.S],
  [Actions.MenuUp.value]: [Phaser.KeyCode.UP, Phaser.KeyCode.W],
  [Actions.Jump.value]: [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.UP, Phaser.KeyCode.W],
  [Actions.MoveLeft.value]: [Phaser.KeyCode.LEFT, Phaser.KeyCode.A],
  [Actions.MoveRight.value]: [Phaser.KeyCode.RIGHT, Phaser.KeyCode.D],
  [Actions.NextLevel.value]: [Phaser.KeyCode.EQUALS],
  [Actions.PrevLevel.value]: [Phaser.KeyCode.MINUS],
  [Actions.OpenPauseMenu.value]: [Phaser.KeyCode.ESC],
  [Actions.MenuSelect.value]: [Phaser.KeyCode.ENTER, Phaser.KeyCode.SPACEBAR],
};

interface ActionKeyMap {
  [key: string]: Phaser.Key[];
}

export class KeyMap {
  actionMap: ActionKeyMap;

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
    return this.actionMap[action.value];
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
    let longestHeldDownKey: Phaser.Key;
    let mostRecentlyReleasedKey: Phaser.Key;

    this.getKeys(action).forEach(key => {
      if (key.isDown) {
        if (!longestHeldDownKey || key.timeDown < longestHeldDownKey.timeDown) {
          longestHeldDownKey = key;
        }
      } else if (key.duration) {
        if (!mostRecentlyReleasedKey || key.timeUp > mostRecentlyReleasedKey.timeUp) {
          mostRecentlyReleasedKey = key;
        }
      }
    });

    if (longestHeldDownKey) {
      return longestHeldDownKey.duration;
    } else if (mostRecentlyReleasedKey) {
      return mostRecentlyReleasedKey.duration;
    }

    return 0;
  }
}
