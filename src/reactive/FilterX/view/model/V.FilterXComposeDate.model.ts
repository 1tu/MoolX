import { Formatter } from '../../../../util/formatter.util';
import { computed, makeObservable } from 'mobx';
import { VFilterXComposeModel } from './V.FilterXCompose.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXComposeDateModel extends VFilterXComposeModel<Date> {
  @computed
  public get display() {
    const { from, to } = this.domain;
    if (!from?.dto || !to?.dto) return;
    return `${Formatter.date(from.dto, { pattern: 'default' })
    } - ${Formatter.date(to.dto, { pattern: 'default' })}`;
  }

  constructor(dtoLV: LambdaValue<IDFilterXComposeModel<Date>>, config: IVFilterXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
