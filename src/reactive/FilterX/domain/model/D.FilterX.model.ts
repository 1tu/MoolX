import {
  EDFilterXType, IDFilterXConfigModel, IDFilterXModel, TDFilterXOperator, TDFilterXType, TDFilterXOperatorMapper,
} from '../D.FilterX.types';
import { ModelX } from '../../../ModelX/ModelX.model';
import { computed, makeObservable, observable } from 'mobx';
import { LambdaValue } from '../../../LambdaX.reactive';

export abstract class DFilterXModel<T extends TDFilterXType, O extends TDFilterXOperator = TDFilterXOperatorMapper<T>> extends ModelX.Value<T | undefined>
  implements IDFilterXModel<T, O> {
  @observable public abstract type: EDFilterXType;
  @observable public operator?: O;
  @observable.ref public config?: IDFilterXConfigModel<T>;

  @computed
  public get isEmpty() {
    return this.dto == null || this.operator == null;
  }

  @observable private _isActive = true;
  @computed
  public get isActive() {
    return !this.isEmpty && this._isActive;
  }

  public set isActive(v: boolean) {
    this._isActive = v;
  }

  constructor(dtoLV: LambdaValue<T | undefined>, operator?: O, config?: IDFilterXConfigModel<T>) {
    super(dtoLV);
    this.operator = operator;
    this.config = config;
    makeObservable(this);
  }

  public abstract filter(value: T): boolean;
  public abstract clone(): IDFilterXModel<T>;

  public clear() {
    if (this.isLambda) return;
    this.lvSet(undefined);
  }
}
