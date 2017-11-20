import { MainState } from './game';
import * as Utils from './utils';

interface MenuItem {
  action: () => void;
  text: string;
  item: Phaser.BitmapText;
}

export class PauseMenu {
  game: Phaser.Game;
  isOpen: boolean;
  menuGroup: Phaser.Group | undefined;
  levelState: MainState;
  menuItems: MenuItem[];
  activeItemIndex: number;

  constructor(game: Phaser.Game, levelState: MainState) {
    this.game = game;
    this.levelState = levelState;
    this.isOpen = false;
  }

  createMenu() {
    this.menuGroup = this.game.add.group();

    const graphics = this.game.add.graphics(0, 0, this.menuGroup);
    graphics.beginFill(0x000000, 0.7);
    graphics.drawRect(0, 0, this.game.width, this.game.height);
    graphics.fixedToCamera = true;

    this.menuItems = this.createMenuItems();
    this.setActiveItem(0);
  }

  createMenuItems(): MenuItem[] {
    const menuItemConfigs = [
      { action: this.close, text: 'Resume Game' },
    ];

    const menuItemHeight = 12;
    const menuHeight = menuItemConfigs.length * menuItemHeight;
    const menuTop = (this.game.height - menuHeight) / 2;

    return menuItemConfigs.map((config, index) => {
      const y = menuTop + index * menuItemHeight;
      return Object.assign({}, config, { item: this.addMenuItem(config.text, y) });
    });
  }

  setActiveItem(activeItemIndex: number) {
    this.activeItemIndex = activeItemIndex;
    this.menuItems.forEach((menuItem, index) => {
      if (index === activeItemIndex) {
        menuItem.item.alpha = 1;
      } else {
        menuItem.item.alpha = 0.6;
      }
    });
  }

  addMenuItem(text: string, y: number) {
    return Utils.Label.addFixedLabel(this.game, y, text, 8, Utils.Label.TextAlign.Center, 0, this.menuGroup);
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  open() {
    this.setOpen(true);
  }

  close() {
    this.setOpen(false);
  }

  private setOpen(open: boolean) {
    this.isOpen = open;
    this.levelState.pauseLevel(this.isOpen);

    this.levelState.keys.reset(Utils.Input.Action.MenuDown);
    this.levelState.keys.reset(Utils.Input.Action.MenuUp);
    this.levelState.keys.reset(Utils.Input.Action.MenuSelect);

    if (this.isOpen) {
      this.createMenu();
    } else if (this.menuGroup) {
      this.menuGroup.destroy(true);
      this.menuGroup = undefined;
    }
  }

  update() {
    if (this.levelState.keys.justDown(Utils.Input.Action.MenuUp) && this.activeItemIndex > 0) {
      this.setActiveItem(this.activeItemIndex - 1);
    } else if (this.levelState.keys.justDown(Utils.Input.Action.MenuDown) && this.activeItemIndex < this.menuItems.length - 1) {
      this.setActiveItem(this.activeItemIndex + 1);
    } else if (this.levelState.keys.justDown(Utils.Input.Action.MenuSelect)) {
      this.menuItems[this.activeItemIndex].action.call(this);
    }
  }
}
