import { computed, makeObservable } from 'mobx';
import { VSortXModel } from './V.SortX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { IVSortXConfigModel } from '../V.SortX.types';

export class VSortXDateModel extends VSortXModel<Date> {
  constructor(dtoLV: LambdaValue<DSortXModel<Date>>, config: IVSortXConfigModel<Date>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get display() {
    if (this.domain.isEmpty) return;
    return this.domain.dto;
  }
}
