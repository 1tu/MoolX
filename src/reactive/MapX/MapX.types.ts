import { IAsynX } from '../AsynX/AsynX.types';
import { IModelXValue, IVModelXValue } from '../ModelX/ModelX.types';

export interface IMapXBase<Model> {
  readonly model?: Model;
}

export interface IMapXListBase<Model> {
  readonly list: Model[];
}

export interface IMapX<Model extends IModelXValue<any>, Source extends IAsynX = IAsynX>
  extends IMapXBase<Model> {
  readonly source: Source;
}

export interface IMapXList<Model extends IModelXValue<any>, Source extends IAsynX = IAsynX>
  extends IMapXListBase<Model> {
  readonly source: Source;
}

export interface IVMapX<VModel extends IVModelXValue<IModelXValue<any>>, Source extends IAsynX = IAsynX>
  extends IMapXBase<VModel> {
  readonly source: Source;
}

export interface IVMapXList<VModel extends IVModelXValue<IModelXValue<any>>, Source extends IAsynX = IAsynX>
  extends IMapXListBase<VModel> {
  readonly source: Source;
}
