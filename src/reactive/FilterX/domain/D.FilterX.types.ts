import { LambdaValue } from '../../LambdaX.reactive';
import { IModelXValue } from '../../ModelX/ModelX.types';

export type IDFilterXTarget = Record<string, any>;
export type TDFilterXType = Date | number | string | boolean;

export type TDFilterXStringOperator = 'include' | 'equal' | 'startWith' | 'endWith';
export type TDFilterXNumberOperator = '==' | '<' | '<=' | '>' | '>=' | '!=';
export type TDFilterXDateOperator = '==' /* same DAY */ | '<' | '<=' | '>' | '>=';
export type TDFilterXBoolOperator = '==' | '!=';

export type TDFilterXOperator = TDFilterXStringOperator | TDFilterXNumberOperator | TDFilterXDateOperator
  | TDFilterXBoolOperator;

export type TDFilterXOperatorMapper<T extends TDFilterXType> = T extends Date ? TDFilterXDateOperator : T extends number
  ? TDFilterXNumberOperator : T extends boolean ? TDFilterXBoolOperator : TDFilterXStringOperator;

// TODO: need add Array (Object too?)
export enum EDFilterXType {
  String = 'string',
  Number = 'number',
  Date = 'Date',
  Boolean = 'boolean',
}

export interface IDFilterXSelectItem<V extends TDFilterXType> {
  value: V | V[];
  // TODO: must be in view layer
  name: string;
}

export interface IDFilterXItem<T extends TDFilterXType> {
  isActive: boolean;
  readonly isEmpty: boolean;
  readonly type: EDFilterXType;
  config?: IDFilterXConfigModel<T>;
  clear(): void;
  filter(item: T): boolean;
  clone(): IDFilterXModelVariant<T>;
}

export interface IDFilterXModel<T extends TDFilterXType, O extends TDFilterXOperator = TDFilterXOperatorMapper<T>>
  extends IDFilterXItem<T>, IModelXValue<T | undefined> {
  operator?: O;
  clone(): IDFilterXModel<T>;
}

export interface IDFilterXComposeModel<T extends TDFilterXType>
  extends IDFilterXItem<T>, IModelXValue<IDFilterXModelVariant<T>[]> {
  modelList: IDFilterXModel<T>[];
  from?: IDFilterXModel<T>;
  to?: IDFilterXModel<T>;
  add(m: IDFilterXModelVariant<T>): void;
  replace(m: IDFilterXModelVariant<T>): void;
  clone(): IDFilterXComposeModel<T>;
}

export type IDFilterXModelVariant<T extends TDFilterXType> = IDFilterXModel<T> | IDFilterXComposeModel<T>;

export type IDFilterXMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IDFilterXComposeModel<I[K]>;
};

export interface IDFilterXConfigItemBase {
  // можно ли вводить значение
  input?: boolean;
}

export type IDFilterXConfigItemMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IDFilterXConfigItem<I[K]>;
  // TODO: structural filter?
  // [K in keyof I]: I[K] extends Array<infer A>
  //   // TODO: if in Array not objects
  //   // ? (A extends object ? Array<IDFilterConfigInput<A>> : Array<IDFilterConfigItemInput<A>>)
  //   ? Array<IDFilterConfigInput<A>>
  //   // Date is object, but not structure
  //   : I[K] extends Date ? IDFilterConfigItemInput<I, K>
  //   : (I[K] extends object ? IDFilterConfigInput<I[K]> : IDFilterConfigItemInput<I, K>)
};

export interface IDFilterXConfigItem<T extends TDFilterXType>
  extends IDFilterXConfigItemBase {
  list?: LambdaValue<IDFilterXSelectItem<T>[]>;
}

export interface IDFilterXConfigModel<T extends TDFilterXType>
  extends IModelXValue<IDFilterXSelectItem<T>[] | undefined>, IDFilterXConfigItemBase {
}

export type IDFilterXConfigMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IDFilterXConfigModel<I[K]>;
};

