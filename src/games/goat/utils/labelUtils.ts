import { Fonts, GameStates, Sprites, SoundFX } from '../constants';

export function leftPad(num: number) {
  return num < 10 ? ' ' + num : '' + num;
}

export enum TextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export function addFixedLabel(game: Phaser.Game, y: number, text: string, size: number, align: TextAlign, marginX = 0, group?: Phaser.Group) {
  const label = game.add.bitmapText(0, y, Fonts.PRESS_START, text, size, group);

  if (align === 'left') {
    label.x = marginX;
  } else if (align === 'right') {
    label.x = game.width - label.width - marginX;
  } else {
    label.x = (game.width - label.width) / 2;
  }

  label.x = Math.round(label.x);
  label.fixedToCamera = true;

  return label;
}

export function fadeText(game: Phaser.Game, initialDelay: number, y: number, text: string, size: number, align: TextAlign, marginX = 0) {
  const label = addFixedLabel(game, y, text, size, align, marginX);
  label.alpha = 0;
  const textDuration = 1000;
  const fadeInDuration = 1000;
  const fadeOutDuration = 500;

  return new Promise(resolve => {
    game.add.tween(label)
      .to({ alpha: 1 }, fadeInDuration, Phaser.Easing.Linear.None, true, initialDelay, 0)
      .onComplete.addOnce(() => {
        game.add.tween(label)
          .to({ alpha: 0 }, fadeOutDuration, Phaser.Easing.Linear.None, true, textDuration, 0)
          .onComplete.add(() => {
            label.destroy();
            resolve();
          });
      });
  });
}
