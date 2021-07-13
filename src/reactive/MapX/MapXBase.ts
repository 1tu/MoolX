import { action, computed, makeObservable } from 'mobx';
import { LambdaValue, resolveLambdaValue } from '../LambdaX.reactive';
import { IMapXBase, IMapXListBase } from './MapX.types';
import { IModelBase, IModelXBase, IModelXValueBase } from '../ModelX/ModelX.types';

export class MapXBase<Input, Output extends IModelXValueBase<Input>>
  implements IMapXBase<Output> {

  constructor(
    protected _v: LambdaValue<Input | undefined>,
    protected _fabric: (v: LambdaValue<Input>) => Output,
  ) {
    makeObservable(this);
  }

  protected _model?: Output;

  @computed
  public get model(): Output | undefined {
    if (this._item) {
      // тут уже знаем что в LV уже что-то лежит, оно не пусто
      if (!this._model) this._model = this._fabric(this._v as LambdaValue<Input>);
      else Promise.resolve().then(() => this._model?.lvSet(this._v as LambdaValue<Input>));
    } else {
      this._model = undefined;
    }
    return this._model;
  }

  @computed
  protected get _item() {
    return resolveLambdaValue(this._v);
  }
}

export class MapXListBase<Input extends IModelBase, Output extends IModelXBase<Input>>
  implements IMapXListBase<Output> {
  constructor(
    protected _v: LambdaValue<Input[] | undefined>,
    protected _fabric: (v: LambdaValue<Input>, index: number) => Output,
  ) {
    makeObservable(this);
  }

  protected _list: Output[] = [];

  @computed
  public get list(): Output[] {
    const listNext = this._data;
    const idListNext = listNext?.map(a => a.id.toString());
    const idSetCurrent = this._idSetCurrent;
    const idSetHandled = new Set();
    const listUpdate: Input[] = [];

    const listNew = listNext?.filter(item => {
      const isNew = !idSetCurrent.has(item.id);
      const isNeedUpdate = idSetHandled.has(item.id);
      if (isNew && isNeedUpdate) {
        if (__DEV__) console.warn(`[MapX.list] Id duplicate: ${item.id}`);
        return false;
      } else if (!isNew) {
        idSetCurrent.delete(item.id);
        idSetHandled.add(item.id);
        listUpdate.push(item);
      }
      return isNew;
    });
    // update
    Promise.resolve().then(() => this._update(listUpdate));
    // remove unused models
    if (idSetCurrent.size) {
      const idList = [...idSetCurrent];
      this._list = this._list.filter(item => !idList.includes(item.id));
    }
    // TODO: не работает. читай ниже, проблема аналогичная
    // idSetCurrent.forEach(id => {
    //   const index = this._list.findIndex(m => m.id === id);
    //   if (index !== -1) this._list.splice(index, 1);
    // });
    if (listNew?.length) {
      const len = this._list.length;
      this._list.push(...listNew.map((item, index) => this._fabric(item, index + len)));
      if (idListNext) this._list = idListNext.map(id => this._list.find(m => m.id === id)!);
      // TODO: при таком подходе из-за того, что ссылка на массив не меняется - в некоторых случаях не видно обновлений
      // например при дозагрузке новой партии котировок
      // if (idListNext) {
      //   const list = idListNext.map(id => this._list.find(m => m.id === id)!);
      //   this._list.splice(0, this._list.length);
      //   this._list.push(...list);
      // }
    }
    return this._list;
  };

  @computed
  protected get _data() {
    return resolveLambdaValue(this._v);
  }

  protected get _idSetCurrent() {
    return new Set(this._list.map(item => item.id));
  }

  @action
  protected _update(list: Input[]) {
    list.forEach(item => this._list.find(model => model.id === item.id)?.lvSet(() => item));
  }
}
