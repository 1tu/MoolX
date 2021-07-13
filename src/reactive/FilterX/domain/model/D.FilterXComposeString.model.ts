import { computed, makeObservable } from 'mobx';
import { DFilterXComposeModel } from './D.FilterXCompose.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { IDFilterXConfigModel, IDFilterXModelVariant } from '../D.FilterX.types';

export class DFilterXComposeStringModel extends DFilterXComposeModel<string> {
  constructor(dtoLV: LambdaValue<IDFilterXModelVariant<string>[]>, config?: IDFilterXConfigModel<string>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get from() {
    return this.modelList.find(f => f.operator?.includes('startWith'));
  }

  @computed
  public get to() {
    return this.modelList.find(f => f.operator?.includes('endsWith'));
  }

  public clone() {
    return new DFilterXComposeStringModel(this.dto.map(f => f.clone()), this.config);
  }
}
