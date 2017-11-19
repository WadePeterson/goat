interface TypeInfo<TData, TWrapper> {
  type: string;
  _dataType: TData;
  _wrapperType: TWrapper;
}

type TypedDataInitalizer<T, TInput> = (data: TInput) => T;

export interface TypedData<T = {}, TWrapper = any> extends TypeInfo<T, TWrapper> {
  data: T;
}

export function returnType<T>(__fn: (...args: any[]) => T): T {
  return null as any as T;
}

export interface TypeDef<TOutput, TWrapper> extends TypeInfo<TOutput, TWrapper> {
  (...args: any[]): TypedData<TOutput, TWrapper> & { type: string, _wrapperType: TWrapper | undefined };
}

type TypedDataCreator<TOutput, TInput, TWrapper> = TypeInfo<TOutput, TWrapper> & ((data: TInput) => TypedData<TOutput, TWrapper>);
type TypedDataCreatorOptionalArgs<TOutput, TInput, TWrapper> = TypeInfo<TOutput, TWrapper> & ((data?: Partial<TInput>) => TypedData<TOutput, TWrapper>);
type TypedDataCreatorNoArgs<TWrapper> = TypeInfo<{}, TWrapper> & (() => TypedData<{}, TWrapper>);

export function createTypeDefiner<TWrapper extends string>(__wrapperType: TWrapper) {
  function defineType(type: string): TypedDataCreatorNoArgs<TWrapper>;
  function defineType<T>(type: string): TypedDataCreator<T, T, TWrapper>;
  function defineType<T, T2>(type: string, initializer: TypedDataInitalizer<T, T2>): TypedDataCreator<T, T2, TWrapper>;
  function defineType<T>(type: string, defaultValue: T): TypedDataCreatorOptionalArgs<T, T, TWrapper>;
  function defineType<T, T2>(type: string, initializerOrDefault?: TypedDataInitalizer<T, T2> | T) {
    const fn = (data: any = {}) => {
      if (initializerOrDefault) {
        data = typeof initializerOrDefault === 'function' ? initializerOrDefault(data) : Object.assign({}, initializerOrDefault, data);
      }
      return { type, data };
    };

    return Object.assign(fn, { type });
  }

  return defineType;
}

export function getDataWithTypes<T1, T2>(data: { [key: string]: TypedData<any, any> }, c1: TypedDataCreator<T1, any, any>, c2: TypedDataCreator<T2, any, any>): [T1 | null, T2 | null];
export function getDataWithTypes<T1, T2, T3>(data: { [key: string]: TypedData<any, any> }, c1: TypedDataCreator<T1, any, any>, c2: TypedDataCreator<T2, any, any>, c3: TypedDataCreator<T3, any, any>): [T1 | null, T2 | null, T3 | null];
export function getDataWithTypes<T1, T2, T3, T4>(data: { [key: string]: TypedData<any, any> }, c1: TypedDataCreator<T1, any, any>, c2: TypedDataCreator<T2, any, any>, c3: TypedDataCreator<T3, any, any>, c4: TypedDataCreator<T4, any, any>): [T1 | null, T2 | null, T3 | null, T3 | null];
export function getDataWithTypes(data: { [key: string]: TypedData<any, any> }, ...fns: TypedDataCreator<any, any, any>[]) {
  return fns.map(f => data[f.type]);
}
