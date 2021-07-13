import { action, computed, makeObservable, observable } from 'mobx';
import { DFilterX } from '../../domain/model/D.FilterX';
import { IDFilterXMap, IDFilterXTarget } from '../../domain/D.FilterX.types';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import {
  IVFilterXConfigItemMap, IVFilterXConfigMap, IVFilterXMap, IVFilterXModalContext, IVFilterXProps, VFilterXModalMap,
} from '../V.FilterX.types';
import { VFilterXConfigModel } from './V.FilterXConfig.model';
import { VModalModel } from '../../../Modal/V.Modal.model';
import { VFilterXComposeRootModel } from './V.FilterXComposeRoot.model';
import { LambdaValue } from '../../../LambdaX.reactive';

export class VFilterX<I extends IDFilterXTarget> extends VModelX.Value<DFilterX<I>> {
  public modalMain = new VModalModel();
  public modalList = Object.keys(this.domain.dto)
    .reduce(<K extends keyof I>(acc: VFilterXModalMap<I>, key: K) => {
      acc[key] = new VModalModel<IVFilterXModalContext<I, K>>();
      return acc;
    }, {} as VFilterXModalMap<I>);

  private readonly _filter: IVFilterXMap<I>;
  @observable.ref private _filterTemp: IVFilterXMap<I>;

  @computed
  public get filter() {
    return this._props.applyOnChange ? this._filter : this._filterTemp;
  }

  public config: IVFilterXConfigMap<I>;

  @computed
  public get isEmpty() {
    return this.domain.isEmpty;
  }

  @computed
  public get state() {
    return !this.isEmpty ? 'Включен' : 'Отключен';
  }

  constructor(
    domain: LambdaValue<DFilterX<I>>,
    config: IVFilterXConfigItemMap<I>,
    private _props: IVFilterXProps = {},
  ) {
    super(domain);
    makeObservable(this);
    this.config = Object.keys(this.domain.dto).reduce((acc, key: keyof I) => {
      acc[key] = new VFilterXConfigModel(this.domain.config[key], config[key]);
      return acc;
    }, {} as IVFilterXConfigMap<I>);
    this._filter = Object.keys(this.domain.dto).reduce((acc, key: keyof I) => {
      acc[key] = new VFilterXComposeRootModel(() => this.domain.dto[key], this.config[key]);
      return acc;
    }, {} as IVFilterXMap<I>);
    this._filterTemp = this._filterClone(this._filter);
  }

  @action.bound
  public apply() {
    if (!this._props.applyOnChange) {
      this.domain.lvSet(Object.keys(this._filterTemp)
        .reduce((acc, key: keyof I) => {
          if (!this.config[key].hidden) acc[key] = this._filterTemp[key].domain;
          // скрытые оставляем как были, они управляются не из view
          else acc[key] = this.filter[key].domain;
          return acc;
        }, {} as IDFilterXMap<I>));
      this._filterTemp = this._filterClone(this.filter);
    }
    this.modalMain.close();
  }

  @action.bound
  public clear() {
    this.domain.clear();
    Object.keys(this._filterTemp).forEach((k: keyof I) => {
      this._filterTemp[k].domain.clear();
    });
  }

  @action.bound
  public async modalOpen<K extends keyof I>(context: IVFilterXModalContext<I, K>) {
    this.modalMain.close();
    await this.modalMain.whenClose();
    this.modalList[context.key].open(context);
  }

  @action.bound
  public async modalClose<K extends keyof I>(context: IVFilterXModalContext<I, K>) {
    const modal = this.modalList[context.key];
    modal.close();
    await modal.whenClose();
    this.modalMain.open();
  }

  private _filterClone(filter: IVFilterXMap<I>) {
    return Object.keys(filter).reduce((acc, key: keyof I) => {
      const cfg = this.config[key];
      const dFilter = filter[key].domain;
      acc[key] = new VFilterXComposeRootModel(cfg.hidden ? dFilter : dFilter.clone(), cfg);
      return acc;
    }, {} as IVFilterXMap<I>);
  }
}
