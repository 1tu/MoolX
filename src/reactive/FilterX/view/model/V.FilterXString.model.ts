import { computed, makeObservable } from 'mobx';
import { VFilterXModel } from './V.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXStringModel extends VFilterXModel<string> {
  @computed
  public get display() {
    return !this.domain.isEmpty ? this.domain.dto : undefined;
  }

  constructor(dtoLV: LambdaValue<DFilterXModel<string>>, config: IVFilterXConfigModel<string>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
