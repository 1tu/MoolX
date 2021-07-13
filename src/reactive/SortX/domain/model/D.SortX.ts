import { action, computed, makeObservable, reaction } from 'mobx';
import { ModelX } from '../../../ModelX/ModelX.model';
import {
  IDSortResult, IDSortXConfigItemMap, IDSortXConfigMap, IDSortXMap, IDSortXModel, IDSortXProps, IDSortXTarget,
} from '../D.SortX.types';
import { DSortXConfigModel } from './D.SortXConfig.model';
import { DSortXConst } from '../D.SortX.const';
import { DisposableHolder } from '../../../../util/disposable.util';
import { IObjectItem } from '../../../../types/base.types';

export class DSortX<I extends IDSortXTarget> extends ModelX.Value<IDSortXMap<I>> {
  public config: IDSortXConfigMap<I>;
  private _dH: DisposableHolder;

  @computed
  public get list(): IObjectItem<IDSortXModel<I[keyof I]>, keyof I>[] {
    return Object.keys(this.dto).map((key) => ({ key, value: this.dto[key] }));
  }

  @computed
  public get isEmpty() {
    return this.list.every(s => s.value.isEmpty);
  }

  @computed
  public get resultList() {
    return this.list.filter(s => !s.value.isEmpty)
      .map(s => ({ field: s.key, direction: s.value.dto! } as IDSortResult<I>));
  }

  @computed
  public get result() {
    return this.resultList[0];
  }

  constructor(config: IDSortXConfigItemMap<I>, props?: IDSortXProps) {
    const keys = Object.keys(config);
    const fConfig = keys.reduce((acc, key: keyof I) => {
      acc[key] = new DSortXConfigModel(config[key]);
      return acc;
    }, {} as IDSortXConfigMap<I>);
    super(keys.reduce((acc, key: keyof I) => {
      const cfg = fConfig[key];
      const Model = DSortXConst.type2model(cfg.type);
      acc[key] = new Model(undefined, cfg);
      return acc;
    }, {} as IDSortXMap<I>));
    makeObservable(this);
    this.config = fConfig;
    this._dH = new DisposableHolder();
    if (props?.single) {
      keys.map(key => this._dH.push(
        reaction(() => this.dto[key].dto, (value) => {
          if (value == null) return;
          const i = this.dto[key];
          this.list.forEach(item => i !== item.value && item.value.lvSet(undefined));
        })),
      );
    }
  }

  public dispose() {
    return this._dH.dispose();
  }

  @action.bound
  public clear() {
    this.list.forEach(s => s.value.clear());
    return this;
  }

  public sortFn(a: I, b: I) {
    return this.list.reduce((acc, { key, value }) =>
      acc + value.sort(a[key], b[key]), 0);
  }
}
