import { EDSortDirection, EDSortXType, IDSortXConfigModel, IDSortXModel, TDSortXType } from './D.SortX.types';
import { DSortXBooleanModel } from './model/D.SortXBoolean.model';
import { DSortXStringModel } from './model/D.SortXString.model';
import { DSortXDateModel } from './model/D.SortXDate.model';
import { DSortXNumberModel } from './model/D.SortXNumber.model';
import { LambdaValue } from '../../LambdaX.reactive';

export class DSortXConst {
  // TODO: fix any
  public static type2model<T extends EDSortXType, D extends IDSortXModel<T>>(type: T): new<T extends TDSortXType>(d: LambdaValue<EDSortDirection | undefined>, c?: IDSortXConfigModel<T>) => IDSortXModel<T> {
    if (type === EDSortXType.String) return DSortXStringModel as any;
    else if (type === EDSortXType.Number) return DSortXNumberModel as any;
    else if (type === EDSortXType.Date) return DSortXDateModel as any;
    else if (type === EDSortXType.Boolean) return DSortXBooleanModel as any;
    throw new Error(`Not valid EDSortXType: ${type}`);
  }
}
