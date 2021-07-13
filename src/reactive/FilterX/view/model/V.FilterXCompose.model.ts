import { IVFilterXComposeModel, IVFilterXConfigModel } from '../V.FilterX.types';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { IDFilterXComposeModel, TDFilterXType } from '../../domain/D.FilterX.types';
import { makeObservable, observable } from 'mobx';
import { LambdaValue } from '../../../LambdaX.reactive';

export abstract class VFilterXComposeModel<T extends TDFilterXType> extends VModelX.Value<IDFilterXComposeModel<T>>
  implements IVFilterXComposeModel<T> {
  @observable.ref config: IVFilterXConfigModel<T>;

  constructor(dtoLV: LambdaValue<IDFilterXComposeModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV);
    this.config = config;
    makeObservable(this);
  }
}
