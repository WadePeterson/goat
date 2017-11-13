import { LevelConfig } from './utils';

const reqCtx = require.context('./', true, /level.*.ts$/);
const levels = reqCtx.keys().map(filename => {
  return reqCtx(filename).default as LevelConfig;
});

export * from './utils';
export default levels;