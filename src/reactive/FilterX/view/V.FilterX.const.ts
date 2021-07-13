import { IDFilterXModelVariant, TDFilterXType } from '../domain/D.FilterX.types';
import { IVFilterXConfigModel, IVFilterXModelVariant } from './V.FilterX.types';
import { VFilterXStringModel } from './model/V.FilterXString.model';
import { VFilterXNumberModel } from './model/V.FilterXNumber.model';
import { VFilterXDateModel } from './model/V.FilterXDate.model';
import { VFilterXBooleanModel } from './model/V.FilterXBoolean.model';
import { VFilterXComposeDateModel } from './model/V.FilterXComposeDate.model';
import { VFilterXComposeStringModel } from './model/V.FilterXComposeString.model';
import { VFilterXComposeNumberModel } from './model/V.FilterXComposeNumber.model';
import { DFilterXComposeStringModel } from '../domain/model/D.FilterXComposeString.model';
import { DFilterXComposeNumberModel } from '../domain/model/D.FilterXComposeNumber.model';
import { DFilterXComposeDateModel } from '../domain/model/D.FilterXComposeDate.model';
import { DFilterXStringModel } from '../domain/model/D.FilterXString.model';
import { DFilterXNumberModel } from '../domain/model/D.FilterXNumber.model';
import { DFilterXDateModel } from '../domain/model/D.FilterXDate.model';
import { DFilterXBooleanModel } from '../domain/model/D.FilterXBoolean.model';
import { LambdaValue } from '../../LambdaX.reactive';

export class VFilterXConst {
  // TODO: fix any
  public static domain2view<T extends TDFilterXType, D extends IDFilterXModelVariant<T>>(model: D): new<T extends TDFilterXType>(d: LambdaValue<IDFilterXModelVariant<T>>, c?: IVFilterXConfigModel<T>) => IVFilterXModelVariant<T> {
    if (model instanceof DFilterXComposeStringModel) return VFilterXComposeStringModel as any;
    else if (model instanceof DFilterXComposeNumberModel) return VFilterXComposeNumberModel as any;
    else if (model instanceof DFilterXComposeDateModel) return VFilterXComposeDateModel as any;

    else if (model instanceof DFilterXStringModel) return VFilterXStringModel as any;
    else if (model instanceof DFilterXNumberModel) return VFilterXNumberModel as any;
    else if (model instanceof DFilterXDateModel) return VFilterXDateModel as any;
    else if (model instanceof DFilterXBooleanModel) return VFilterXBooleanModel as any;
    throw new Error(`Not valid DFilterModel: ${model?.constructor.name}`);
  }
}
