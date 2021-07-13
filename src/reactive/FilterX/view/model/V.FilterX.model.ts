import { IVFilterXConfigModel, IVFilterXModel } from '../V.FilterX.types';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { TDFilterXType } from '../../domain/D.FilterX.types';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { makeObservable, observable } from 'mobx';

export class VFilterXModel<T extends TDFilterXType> extends VModelX.Value<DFilterXModel<T>>
  implements IVFilterXModel<T> {
  @observable.ref config: IVFilterXConfigModel<T>;

  constructor(dtoLV: LambdaValue<DFilterXModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV);
    this.config = config;
    makeObservable(this);
  }
}
