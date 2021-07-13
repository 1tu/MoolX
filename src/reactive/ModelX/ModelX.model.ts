import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable } from 'mobx';
import { LambdaValue, resolveLambdaValue } from '../LambdaX.reactive';
import { IModelBase, IModelX, IModelXValue } from './ModelX.types';

export abstract class ModelXValue<DTO> implements IModelXValue<DTO> {
  @observable.ref protected _dtoLV: LambdaValue<DTO>;

  constructor(dtoLV: LambdaValue<DTO>) {
    makeObservable(this);
    this._dtoLV = dtoLV;
  }

  @computed
  public get dto() {
    return resolveLambdaValue(this._dtoLV);
  }

  @computed
  public get isLambda() {
    return isFunction(this._dtoLV);
  }

  // @deprecated - использовать lvSet()
  public dtoSet(dtoLV: LambdaValue<DTO>) {
    this.lvSet(dtoLV);
  }

  @action
  public lvSet(dtoLV: LambdaValue<DTO>) {
    this._dtoLV = dtoLV;
  }
}

export abstract class ModelX<DTO extends IModelBase> extends ModelXValue<DTO> implements IModelX<DTO> {
  public static Value = ModelXValue;

  constructor(dtoLV: LambdaValue<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  @computed
  public get id() {
    return this.dto.id.toString();
  }
}

