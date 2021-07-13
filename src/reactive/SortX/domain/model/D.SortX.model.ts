import { ModelX } from '../../../ModelX/ModelX.model';
import { computed, makeObservable, observable } from 'mobx';
import { LambdaValue } from '../../../LambdaX.reactive';
import { EDSortDirection, EDSortXType, IDSortXConfigModel, IDSortXModel, TDSortXType } from '../D.SortX.types';

export abstract class DSortXModel<T extends TDSortXType> extends ModelX.Value<EDSortDirection | undefined>
  implements IDSortXModel<T> {
  @observable public abstract type: EDSortXType;
  @observable.ref public config?: IDSortXConfigModel<T>;

  @computed
  public get isEmpty() {
    return this.dto == null || this.dto === EDSortDirection.None;
  }

  @observable private _isActive = true;
  @computed
  public get isActive() {
    return !this.isEmpty && this._isActive;
  }

  public set isActive(v: boolean) {
    this._isActive = v;
  }

  constructor(dtoLV: LambdaValue<EDSortDirection | undefined>, config?: IDSortXConfigModel<T>) {
    super(dtoLV);
    makeObservable(this);
    this.config = config;
  }

  public abstract sort(a: T, b: T): number;
  public abstract clone(): IDSortXModel<T>;

  public clear() {
    if (this.isLambda) return;
    this.lvSet(undefined);
  }
}
