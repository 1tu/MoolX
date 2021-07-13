import { IVSortXConfigModel, IVSortXModel } from '../V.SortX.types';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { TDSortXType } from '../../domain/D.SortX.types';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { makeObservable, observable } from 'mobx';

export abstract class VSortXModel<T extends TDSortXType> extends VModelX.Value<DSortXModel<T>>
  implements IVSortXModel<T> {
  @observable.ref config: IVSortXConfigModel<T>;

  constructor(dtoLV: LambdaValue<DSortXModel<T>>, config: IVSortXConfigModel<T>) {
    super(dtoLV);
    makeObservable(this);
    this.config = config;
  }
}
