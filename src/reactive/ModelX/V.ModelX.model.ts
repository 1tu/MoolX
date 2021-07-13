import { IModelX, IModelXValue, IVModelX, IVModelXValue } from './ModelX.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { LambdaValue, resolveLambdaValue } from '../LambdaX.reactive';

export abstract class VModelXValue<V extends IModelXValue<any>> implements IVModelXValue<V> {
  @observable.ref public _domain: LambdaValue<V>;

  @computed
  public get domain() {
    return resolveLambdaValue(this._domain);
  }

  constructor(domain: LambdaValue<V>) {
    makeObservable(this);
    this._domain = domain;
  }

  // @deprecated - использовать lvSet()
  public domainSet(domain: V) {
    this.lvSet(domain);
  }

  @action
  public lvSet(domain: V) {
    this._domain = domain;
  }
}

export abstract class VModelX<M extends IModelX<any>> extends VModelXValue<M> implements IVModelX<M> {
  public static Value = VModelXValue;

  @computed
  public get id() {
    return this.domain.id.toString();
  }

  constructor(dtoLV: LambdaValue<M>) {
    super(dtoLV);
    makeObservable(this);
  }
}
