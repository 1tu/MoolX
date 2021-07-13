import { Formatter } from '../../../../util/formatter.util';
import { computed, makeObservable } from 'mobx';
import { VFilterXModel } from './V.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXDateModel extends VFilterXModel<Date> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return;
    return `${this.domain.operator} ${Formatter.date(this.domain.dto!, {
      pattern: 'default',
    })}`;
  }

  constructor(dtoLV: LambdaValue<DFilterXModel<Date>>, config: IVFilterXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
