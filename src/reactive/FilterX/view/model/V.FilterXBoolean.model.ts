import { computed, makeObservable } from 'mobx';
import { VFilterXModel } from './V.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXBooleanModel extends VFilterXModel<boolean> {
  @computed
  public get display() {
    return this.domain.dto ? 'Да' : 'Нет';
  }

  constructor(dtoLV: LambdaValue<DFilterXModel<boolean>>, config: IVFilterXConfigModel<boolean>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
