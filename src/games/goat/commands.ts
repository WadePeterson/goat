import { createTypeDefiner, TypedData, TypeDef } from './utils/dataUtils';

const defineCommand = createTypeDefiner('command');
export type CommandCreator<T = any> = TypeDef<T, 'command'>;
export type Command<T = any> = TypedData<T, 'command'>;

export const Attack = defineCommand('attack');
export const AttackEntity = defineCommand<{ entityId: string }>('attackentity');
export const MoveLeft = defineCommand('moveleft');
export const MoveRight = defineCommand('moveright');
export const MoveUp = defineCommand('moveup');
export const MoveDown = defineCommand('movedown');
export const MoveToPoint = defineCommand<{ x: number; y: number }>('movetopoint');

export function isCommandOfType<T>(command: Command, commandCreator: CommandCreator<T>): command is Command<T> {
  return command.type === commandCreator.type;
}

export function getCommand<T>(commands: { [key: string]: Command }, commandDef: CommandCreator<T>): T | null {
  const command = commands[commandDef.type];
  return (command && command.data) || null;
}

export function addCommand<T>(commands: { [key: string]: Command }, command: Command<T>) {
  commands[command.type] = command;
}

type CommandHandler<TArgs, T> = (args: TArgs, data: T) => any;
type CommandTypeHandler<TArgs, T> = [string, CommandHandler<TArgs, T>];

export function createCommandHandler<TArgs>() {
  return function handleCommand<T>(commandTypeDef: CommandCreator<T>, handler: CommandHandler<TArgs, T>): CommandTypeHandler<TArgs, T> {
    return [commandTypeDef.type, handler];
  };
}

export function createCommandHandlers<TArgs>(...handlers: CommandTypeHandler<TArgs, any>[]) {
  const handlerMap = handlers.reduce((acc, [type, handler]) => {
    return Object.assign(acc, { [type]: handler });
  }, {} as { [key: string]: CommandHandler<TArgs, any> });

  return (args: TArgs, command: Command) => {
    const handler = handlerMap[command.type];
    if (handler) {
      handler(command.data, args);
    }
  };
}
