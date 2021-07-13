import { VFilterXComposeModel } from './V.FilterXCompose.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { computed, makeObservable } from 'mobx';

export class VFilterXComposeStringModel extends VFilterXComposeModel<string> {
  constructor(dtoLV: LambdaValue<IDFilterXComposeModel<string>>, config: IVFilterXConfigModel<string>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get display() {
    return this.domain.dto.map(v => v.dto).join(', ');
  }
}
