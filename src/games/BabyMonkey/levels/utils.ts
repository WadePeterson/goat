export interface LevelConfig {
  name: string;
  song: string;
  backgroundColor: string;
  tileData: string[];
  startX: number;
  startY: number;
}

export function defineLevel(config: LevelConfig) {
  return config;
}