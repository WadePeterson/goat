import { defineLevel } from './utils';
import { Music } from '../utils/assetUtils';
export default defineLevel({
  name: 'Baby Monkey\'s Tree House',
  backgroundColor: '#333333',
  song: Music.SONG1,
  startX: 3,
  startY: 12,
  tileData: [
    '     b          ',
    '                ',
    '                ',
    '          s     ',
    '                ',
    '       s        ',
    '                ',
    '         s      ',
    '    sss         ',
    '             b  ',
    '                ',
    '       sss      ',
    '                ',
    'gggggggggggggggg',
  ],
});
