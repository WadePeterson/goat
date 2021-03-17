import { defineLevel } from './utils';
import { Music } from '../constants';
export default defineLevel({
  name: 'Cave of Doom',
  backgroundColor: '#6e6e6e',
  song: Music.SONG2,
  startX: 4,
  startY: 10,
  tileData: [
    '                                                ',
    '                                                ',
    '                                                ',
    '                                                ',
    '                                       b        ',
    '                                                ',
    '                 b                   ggggg      ',
    '                                                ',
    '    b        ggggggggg                          ',
    '                                           b    ',
    '                                           g    ',
    'gggggggggg                 ggggggggggggg        ',
  ],
});
