import { action, computed, makeObservable, observable } from 'mobx';
import { DSortX } from '../../domain/model/D.SortX';
import { IDSortXMap, IDSortXTarget } from '../../domain/D.SortX.types';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { IVSortXConfigItemMap, IVSortXConfigMap, IVSortXMap, IVSortXModel, IVSortXProps } from '../V.SortX.types';
import { VSortXConfigModel } from './V.SortXConfig.model';
import { VModalModel } from '../../../Modal/V.Modal.model';
import { VSortXConst } from '../V.SortX.const';
import { IObjectItem } from '../../../../types/base.types';

export class VSortX<I extends IDSortXTarget> extends VModelX.Value<DSortX<I>> {
  public modalMain = new VModalModel();

  private readonly _sort: IVSortXMap<I>;
  @observable.ref private _sortTemp: IVSortXMap<I>;

  @computed
  public get sort() {
    return this._props.applyOnChange ? this._sort : this._sortTemp;
  }

  @computed
  public get list(): IObjectItem<IVSortXModel<I[keyof I]>, keyof I>[] {
    return Object.keys(this.sort).map((key) => ({ key, value: this.sort[key] }));
  }

  public config: IVSortXConfigMap<I>;

  @computed
  public get isEmpty() {
    return this.domain.isEmpty;
  }

  @computed
  public get state() {
    if (this.isEmpty) return 'Отключена';
    return this.domain.resultList.length > 1 ? 'Включена' : this.config[this.domain.result.field].title;
  }

  constructor(
    domain: DSortX<I>,
    config: IVSortXConfigItemMap<I>,
    private _props: IVSortXProps = {},
  ) {
    super(domain);
    makeObservable(this);
    this.config = this.domain.list.reduce((acc, { key }) => {
      acc[key] = new VSortXConfigModel(this.domain.config[key], config[key]);
      return acc;
    }, {} as IVSortXConfigMap<I>);
    this._sort = this.domain.list.reduce((acc, { key }) => {
      const Model = VSortXConst.domain2view(this.domain.dto[key]);
      acc[key] = new Model(() => this.domain.dto[key], this.config[key]);
      return acc;
    }, {} as IVSortXMap<I>);
    this._sortTemp = this._sortClone(this._sort);
  }

  @action.bound
  public apply() {
    if (!this._props.applyOnChange) {
      this.domain.lvSet(Object.keys(this._sortTemp)
        .reduce((acc, key: keyof I) => {
          if (!this.config[key].hidden) acc[key] = this._sortTemp[key].domain;
          // скрытые оставляем как были, они управляются не из view
          else acc[key] = this.sort[key].domain;
          return acc;
        }, {} as IDSortXMap<I>));
      this._sortTemp = this._sortClone(this.sort);
    }
    this.modalMain.close();
  }

  @action.bound
  public clear() {
    this.domain.clear();
    Object.keys(this._sortTemp).forEach((k: keyof I) => this._sortTemp[k].domain.clear());
  }

  private _sortClone(sort: IVSortXMap<I>) {
    return Object.keys(sort).reduce((acc, key: keyof I) => {
      const cfg = this.config[key];
      const Model = VSortXConst.domain2view(this.domain.dto[key]);
      acc[key] = new Model(cfg.hidden ? sort[key].domain : sort[key].domain.clone(), cfg);
      return acc;
    }, {} as IVSortXMap<I>);
  }
}
