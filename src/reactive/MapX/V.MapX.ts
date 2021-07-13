import { IAsynX } from '../AsynX/AsynX.types';
import { LambdaValue } from '../LambdaX.reactive';
import { IVMapX, IVMapXList } from './MapX.types';
import { IModelBase, IModelX, IModelXValue, IVModelX, IVModelXValue } from '../ModelX/ModelX.types';
import { MapXBase, MapXListBase } from './MapXBase';

export class VMapX<DModel extends IModelXValue<any>, VModel extends IVModelXValue<DModel>, Source extends IAsynX = IAsynX>
  extends MapXBase<DModel, VModel> implements IVMapX<VModel, Source> {
  constructor(
    public source: Source,
    _v: LambdaValue<DModel | undefined>,
    _fabric: (v: LambdaValue<DModel>) => VModel,
  ) {
    super(_v, _fabric);
  }
}

export class VMapXList<DModel extends IModelX<IModelBase>, VModel extends IVModelX<DModel>, Source extends IAsynX = IAsynX>
  extends MapXListBase<DModel, VModel>
  implements IVMapXList<VModel, Source> {
  constructor(
    public source: Source,
    _v: LambdaValue<DModel[] | undefined>,
    _fabric: (v: LambdaValue<DModel>, index: number) => VModel,
  ) {
    super(_v, _fabric);
  }
}
