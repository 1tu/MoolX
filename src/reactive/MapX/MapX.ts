import { MapXList } from './MapXList';
import { IAsynX } from '../AsynX/AsynX.types';
import { LambdaValue } from '../LambdaX.reactive';
import { IMapX } from './MapX.types';
import { MapXListProxy, MapXProxy } from './MapX.proxy';
import { VMapX, VMapXList } from './V.MapX';
import { IModelXValue } from '../ModelX/ModelX.types';
import { MapXBase, MapXListBase } from './MapXBase';

export class MapX<Item, Model extends IModelXValue<Item>, Source extends IAsynX = IAsynX>
  extends MapXBase<Item, Model> implements IMapX<Model, Source> {
  public static List = MapXList;
  public static Base = MapXBase;
  public static BaseList = MapXListBase;
  public static Proxy = MapXProxy;
  public static ProxyList = MapXListProxy;
  public static View = VMapX;
  public static ViewList = VMapXList;

  constructor(
    public source: Source,
    _v: LambdaValue<Item | undefined>,
    _fabric: (v: LambdaValue<Item>) => Model,
  ) {
    super(_v, _fabric);
  }
}
