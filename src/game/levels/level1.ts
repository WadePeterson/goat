import { defineLevel } from './utils';
import { Music } from '../constants';
export default defineLevel({
  name: 'Baby Monkey\'s Tree House',
  backgroundColor: '#29B6F6',
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