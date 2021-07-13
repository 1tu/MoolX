import { IDFilterXComposeModel, IDFilterXConfigModel, IDFilterXModelVariant, TDFilterXType } from '../D.FilterX.types';
import { ModelX } from '../../../ModelX/ModelX.model';
import { computed, IObservableArray, makeObservable, observable } from 'mobx';
import { DFilterXModel } from './D.FilterX.model';
import { LambdaValue } from '../../../LambdaX.reactive';

// каждый фильтр внутри работает по принципу "И" (&&)
export class DFilterXComposeModel<T extends TDFilterXType> extends ModelX.Value<IDFilterXModelVariant<T>[]>
  implements IDFilterXComposeModel<T> {
  @observable.ref public config?: IDFilterXConfigModel<T>;

  @computed
  public get modelList() {
    return this.dto.filter(f => (f instanceof DFilterXModel)) as DFilterXModel<T>[];
  }

  @computed
  public get type() {
    return this.dto[0].type;
  }

  @computed
  public get isEmpty() {
    return this.dto.some(f => f.isEmpty);
  }

  @computed
  public get isActive() {
    return this.dto.every(f => f.isActive);
  }

  constructor(dtoLV: LambdaValue<IDFilterXModelVariant<T>[]>, config?: IDFilterXConfigModel<T>) {
    super(dtoLV);
    this.config = config;
    makeObservable(this);
  }

  public filter(value: T) {
    return this.dto.every(f => f.filter(value));
  }

  public add(m: IDFilterXModelVariant<T>) {
    this.dto.push(m);
  }

  public replace(m: IDFilterXModelVariant<T>) {
    this.lvSet([m] as IObservableArray);
  }

  public clear() {
    this.dto.forEach(f => f.clear());
  }

  public clone() {
    return new DFilterXComposeModel(this.dto.map(f => f.clone()), this.config);
  }
}
