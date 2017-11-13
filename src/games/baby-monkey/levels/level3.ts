import { defineLevel } from './utils';
import { Music } from '../constants';
export default defineLevel({
  name: 'The Pit of Doom',
  backgroundColor: '#29B6F6',
  song: Music.SONG1,
  startX: 5,
  startY: 9,
  tileData: [
    '                                             ',
    '                                             ',
    '                                             ',
    '       s                                     ',
    '                                             ',
    '         s                                   ',
    '    sss                                      ',
    '             b          sss                  ',
    '        s b                                  ',
    '                                           b ',
    '      b   s                                  ',
    'gggggggggggggggggggggg         gggggggggggggg',
    'gggggggggggggggggggggg         gggggggggggggg',
    'gggggggggggggggggggggg         gggggggggggggg',
  ],
});