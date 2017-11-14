import { defineLevel } from './utils';
import { Music } from '../constants';
export default defineLevel({
  name: 'The Pit of Doom 2',
  backgroundColor: '#29B6F6',
  song: Music.SONG1,
  startX: 2,
  startY: 2,
  tileData: [
    '                                  ',
    '                                  ',
    '                                  ',
    '                            b     ',
    '                                  ',
    'ssss                sss           ',
    '                                  ',
    '    b        sss                  ',
    ' b                      s         ',
    '                                b ',
    '               b                  ',
    'ggggggggggg         gggggggggggggg',
    'ggggggggggg         gggggggggggggg',
    'ggggggggggg         gggggggggggggg',
  ],
});