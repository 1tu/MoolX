import { IDSortXModel, TDSortXType } from '../domain/D.SortX.types';
import { IVSortXConfigModel, IVSortXModel } from './V.SortX.types';
import { VSortXStringModel } from './model/V.SortXString.model';
import { VSortXNumberModel } from './model/V.SortXNumber.model';
import { VSortXDateModel } from './model/V.SortXDate.model';
import { VSortXBooleanModel } from './model/V.SortXBoolean.model';
import { DSortXStringModel } from '../domain/model/D.SortXString.model';
import { DSortXNumberModel } from '../domain/model/D.SortXNumber.model';
import { DSortXDateModel } from '../domain/model/D.SortXDate.model';
import { DSortXBooleanModel } from '../domain/model/D.SortXBoolean.model';
import { LambdaValue } from '../../LambdaX.reactive';

export class VSortXConst {
  // TODO: fix any
  public static domain2view<T extends TDSortXType, D extends IDSortXModel<T>>(model: D): new<T extends TDSortXType>(d: LambdaValue<IDSortXModel<T>>, c?: IVSortXConfigModel<T>) => IVSortXModel<T> {
    if (model instanceof DSortXStringModel) return VSortXStringModel as any;
    else if (model instanceof DSortXNumberModel) return VSortXNumberModel as any;
    else if (model instanceof DSortXDateModel) return VSortXDateModel as any;
    else if (model instanceof DSortXBooleanModel) return VSortXBooleanModel as any;
    throw new Error(`Not valid DSortModel: ${model?.constructor.name}`);
  }
}
