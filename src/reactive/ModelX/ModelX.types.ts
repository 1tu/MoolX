import { LambdaValue } from '../LambdaX.reactive';

export type TModelDTO = {
  [key: string]: string | number | Date | TModelDTO | Array<string | number | Date | TModelDTO> | undefined;
}

export type TModelId = string;

export interface IModelBase {
  id: TModelId | { toString(): string };
}

export interface IModelXValueBase<V> {
  lvSet(dtoLv: LambdaValue<V>): void;
}

export type IModelXBase<DTO> = IModelXValueBase<DTO> & IModelBase;

export interface IModelXValue<DTO> extends IModelXValueBase<DTO> {
  readonly dto: DTO;
  // @deprecated - использовать lvSet()
  dtoSet(dtoLv: LambdaValue<DTO>): void;
}

export type IModelX<DTO> = IModelXValue<DTO> & IModelBase;

export interface IVModelXValue<V extends IModelXValue<any>> extends IModelXValueBase<V> {
  readonly domain: V;
  // @deprecated - использовать lvSet()
  domainSet(domain: LambdaValue<V>): void;
}

export interface IVModelX<M extends IModelX<any>> extends IVModelXValue<M> {
  readonly id: TModelId;
}
