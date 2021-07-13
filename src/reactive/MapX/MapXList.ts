import { IAsynX } from '../AsynX/AsynX.types';
import { LambdaValue } from '../LambdaX.reactive';
import { IMapXList } from './MapX.types';
import { IModelBase, IModelX } from '../ModelX/ModelX.types';
import { MapXListBase } from './MapXBase';

export class MapXList<Item extends IModelBase, Model extends IModelX<Item>, Source extends IAsynX = IAsynX>
  extends MapXListBase<Item, Model> implements IMapXList<Model, Source> {
  constructor(
    public source: Source,
    _v: LambdaValue<Item[] | undefined>,
    _fabric: (v: LambdaValue<Item>, index: number) => Model,
  ) {
    super(_v, _fabric);
  }
}
