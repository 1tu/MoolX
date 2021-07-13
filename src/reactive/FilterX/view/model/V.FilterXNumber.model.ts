import { computed, makeObservable } from 'mobx';
import { VFilterXModel } from './V.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXNumberModel extends VFilterXModel<number> {
  @computed
  public get display() {
    return !this.domain.isEmpty ? this.domain.dto?.toString() : undefined;
  }

  constructor(dtoLV: LambdaValue<DFilterXModel<number>>, config: IVFilterXConfigModel<number>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
