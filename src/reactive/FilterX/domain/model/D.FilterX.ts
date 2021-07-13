import { action, computed, makeObservable } from 'mobx';
import {
  IDFilterXComposeModel, IDFilterXConfigItemMap, IDFilterXConfigMap, IDFilterXMap, IDFilterXModelVariant,
  IDFilterXTarget,
} from '../D.FilterX.types';
import { DFilterXConfigModel } from './D.FilterXConfig.model';
import { ModelX } from '../../../ModelX/ModelX.model';
import { DFilterXComposeModel } from './D.FilterXCompose.model';
import { IObjectItem } from '../../../../types/base.types';

export class DFilterX<I extends IDFilterXTarget> extends ModelX.Value<IDFilterXMap<I>> {
  public config: IDFilterXConfigMap<I>;

  @computed
  public get list(): IObjectItem<IDFilterXComposeModel<I[keyof I]>, keyof I>[] {
    return Object.keys(this.dto).map((key) => ({ key, value: this.dto[key] }));
  }

  @computed
  public get isEmpty() {
    return this.list.every(s => s.value.isEmpty);
  }

  constructor(config: IDFilterXConfigItemMap<I>) {
    const keys = Object.keys(config);
    const fConfig = keys.reduce((acc, key: keyof I) => {
      acc[key] = new DFilterXConfigModel(config[key]);
      return acc;
    }, {} as IDFilterXConfigMap<I>);
    super(keys.reduce((acc, key: keyof I) => {
      acc[key] = new DFilterXComposeModel([], fConfig[key]);
      return acc;
    }, {} as IDFilterXMap<I>));
    this.config = fConfig;
    makeObservable(this);
  }

  @action
  public add<K extends keyof I>(key: K, filter: IDFilterXModelVariant<I[K]>) {
    filter.config = this.config[key];
    this.dto[key].add(filter);
    return this;
  }

  @action
  public replace<K extends keyof I>(key: K, filter: IDFilterXModelVariant<I[K]>) {
    filter.config = this.config[key];
    this.dto[key].replace(filter);
    return this;
  }

  @action.bound
  public clear() {
    this.list.forEach(s => s.value.clear());
    return this;
  }

  public filterFn(item: I) {
    return this.list.every((s) => s.value.filter(item[s.key]));
  }
}

