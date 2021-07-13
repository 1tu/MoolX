import { computed, makeObservable } from 'mobx';
import { IAsynX } from '../AsynX/AsynX.types';
import { LambdaValue, resolveLambdaValue } from '../LambdaX.reactive';
import { IMapX, IMapXList } from './MapX.types';
import { IModelBase, IModelX } from '../ModelX/ModelX.types';

export class MapXProxy<Model extends IModelX<IModelBase>, Source extends IAsynX = IAsynX>
  implements IMapX<Model, Source> {
  constructor(
    private _v: LambdaValue<Model | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get model(): Model | undefined {
    return resolveLambdaValue(this._v);
  }
}

export class MapXListProxy<Model extends IModelX<IModelBase>, Source extends IAsynX = IAsynX>
  implements IMapXList<Model, Source> {
  constructor(
    private _v: LambdaValue<Model[] | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get list(): Model[] {
    return resolveLambdaValue(this._v) ?? [];
  }
}
