export function asRecord<K extends string, V>(record: Record<K, V>): Record<K, V> {
  return record;
}

export function keys<T, K extends keyof T>(obj: T): K[] {
  return Object.keys(obj) as K[];
}

type KeyMap<K extends string> = {[P in K]: P};

export function keyMap<T, K extends keyof T>(obj: T): KeyMap<K> {
  return keys(obj).reduce((acc, key) => {
    return Object.assign(acc, { [key]: key });
  }, {} as any as KeyMap<K>);
}