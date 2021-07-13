import { EDSortDirection, IDSortXConfigModel, IDSortXModel, IDSortXTarget, TDSortXType } from '../domain/D.SortX.types';
import { IVModelXValue } from '../../ModelX/ModelX.types';
import { IVModalModel } from '../../Modal/V.Modal.types';
import { ISelectItem } from '../../../types/base.types';

export interface IVSortXItem<T extends TDSortXType> {
  readonly display?: string;
  config: IVSortXConfigModel<T>;
}

export interface IVSortXModel<T extends TDSortXType>
  extends IVModelXValue<IDSortXModel<T>>, IVSortXItem<T> {
}

// list Sort
export interface IVSortXProps {
  applyOnChange?: boolean;
  // сортировка ТОЛЬКО по одному свойству за раз
  single?: boolean;
}

export type IVSortXMap<I extends IDSortXTarget> = {
  [K in keyof I]: IVSortXModel<I[K]>
};

// config
export type IVSortXConfigItemMap<I extends IDSortXTarget> = {
  [K in keyof I]: IVSortXConfigItem;
};

export interface IVSortXConfigItem {
  title?: string;
  // скрытые, управляются не из view слоя
  hidden?: boolean;
}

export interface IVSortXConfigModel<T extends TDSortXType>
  extends IVSortXConfigItem {
  domain: IDSortXConfigModel<T>;
  list: ISelectItem<EDSortDirection>[];
}

export type IVSortXConfigMap<I extends IDSortXTarget> = {
  [K in keyof I]: IVSortXConfigModel<I[K]>
};

// Sort modal
export type VSortXModalMap<I extends IDSortXTarget> = {
  [K in keyof I]: IVModalModel<IVSortXModalContext<I, K>>
}

export interface IVSortXModalContext<I extends IDSortXTarget, K extends keyof I> {
  model: IVSortXModel<I[K]>;
  key: K;
}
