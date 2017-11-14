import { defineLevel } from './utils';
import { Music } from '../utils/assetUtils';
export default defineLevel({
  name: 'The Journey Begins',
  backgroundColor: '#29B6F6',
  song: Music.SONG2,
  startX: 5,
  startY: 2,
  tileData: [
    '                   b          b                                     ',
    '               sssssssss                                            ',
    '                                                      bb            ',
    '   sssss                                   b                        ',
    '                                                   ssssss           ',
    '          ssssssssssssssssssssssss    ssssssssss                    ',
    '                                                                    ',
    '       s                                                            ',
    '                                                                    ',
    '         s                                                          ',
    '    sss                                                             ',
    '             b   sss                                                ',
    '        s b                                                     b   ',
    '                                                                    ',
    '      b   s                                                         ',
    'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
  ],
});
