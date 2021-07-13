import { Formatter } from '../../../../util/formatter.util';
import { computed, makeObservable } from 'mobx';
import { VFilterXComposeModel } from './V.FilterXCompose.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXComposeNumberModel extends VFilterXComposeModel<number> {
  @computed
  public get display() {
    const { from, to } = this.domain;
    if (!from?.dto || !to?.dto) return;
    return `${Formatter.number(from.dto)} - ${Formatter.number(to.dto)}`;
  }

  constructor(dtoLV: LambdaValue<IDFilterXComposeModel<number>>, config: IVFilterXConfigModel<number>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
