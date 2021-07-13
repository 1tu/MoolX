import {
  EDSortDirection, IDSortXConfigItem, IDSortXConfigModel, TDSortXType, TDSortXTypeMapper,
} from '../D.SortX.types';
import { computed, makeObservable } from 'mobx';

export class DSortXConfigModel<T extends TDSortXType> implements IDSortXConfigModel<T> {
  public type: TDSortXTypeMapper<T>;

  @computed
  public get list() {
    return [EDSortDirection.Desc, EDSortDirection.Asc, EDSortDirection.None];
  };

  constructor(config: IDSortXConfigItem<T>) {
    this.type = config.type;
    makeObservable(this);
  }
}
