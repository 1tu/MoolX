import { computed, makeObservable } from 'mobx';
import { VSortXModel } from './V.SortX.model';
import { LambdaValue } from '../../../LambdaX.reactive';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { IVSortXConfigModel } from '../V.SortX.types';

export class VSortXNumberModel extends VSortXModel<number> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return;
    return this.domain.dto;
  }

  constructor(dtoLV: LambdaValue<DSortXModel<number>>, config: IVSortXConfigModel<number>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
