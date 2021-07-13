import {
  IDFilterXComposeModel, IDFilterXConfigModel, IDFilterXModel, IDFilterXTarget, TDFilterXType,
} from '../domain/D.FilterX.types';
import { IVModelXValue } from '../../ModelX/ModelX.types';
import { IVModalModel } from '../../Modal/V.Modal.types';

export interface IVFilterXItem<T extends TDFilterXType> {
  readonly display?: string;
  config: IVFilterXConfigModel<T>;
}

export interface IVFilterXModel<T extends TDFilterXType>
  extends IVModelXValue<IDFilterXModel<T>>, IVFilterXItem<T> {
}


export interface IVFilterXComposeModel<T extends TDFilterXType>
  extends IVModelXValue<IDFilterXComposeModel<T>>, IVFilterXItem<T> {
}

export interface IVFilterXComposeRootModel<T extends TDFilterXType>
  extends IVFilterXComposeModel<T> {
  modelList: IVFilterXModel<T>[];
  list: IVFilterXModelVariant<T>[];
}

export type IVFilterXModelVariant<T extends TDFilterXType> = IVFilterXModel<T> | IVFilterXComposeModel<T>;

// list filter
export interface IVFilterXProps {
  applyOnChange?: boolean;
}

export type IVFilterXMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IVFilterXComposeRootModel<I[K]>
};

// config
export type IVFilterXConfigItemMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IVFilterXConfigItem;
};

export interface IVFilterXConfigItem {
  title?: string;
  // скрытые, управляются не из view слоя
  hidden?: boolean;
  // вынести выбор в отдельную модалку (modalList)
  separate?: boolean;
}

export interface IVFilterXConfigModel<T extends TDFilterXType>
  extends IVFilterXConfigItem {
  domain: IDFilterXConfigModel<T>;
}

export type IVFilterXConfigMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IVFilterXConfigModel<I[K]>
};

// filter modal
export type VFilterXModalMap<I extends IDFilterXTarget> = {
  [K in keyof I]: IVModalModel<IVFilterXModalContext<I, K>>
}

export interface IVFilterXModalContext<I extends IDFilterXTarget, K extends keyof I> {
  model: IVFilterXModelVariant<I[K]>;
  key: K;
}
