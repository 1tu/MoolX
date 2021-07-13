import { computed, makeObservable } from 'mobx';
import { DFilterXComposeModel } from './D.FilterXCompose.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { IDFilterXConfigModel, IDFilterXModelVariant } from '../D.FilterX.types';

export class DFilterXComposeDateModel extends DFilterXComposeModel<Date> {
  constructor(dtoLV: LambdaValue<IDFilterXModelVariant<Date>[]>, config?: IDFilterXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get from() {
    return this.modelList.find(f => f.operator?.includes('>'));
  }

  @computed
  public get to() {
    return this.modelList.find(f => f.operator?.includes('<'));
  }

  public clone() {
    return new DFilterXComposeDateModel(this.dto.map(f => f.clone()), this.config);
  }
}
