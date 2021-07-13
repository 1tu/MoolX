import { action, computed, IObservableArray, makeObservable, observable, runInAction } from 'mobx';

import { IAsynXPaged, IAsynXPagedOpts, TAsync, TAsyncArguments, TAsyncReturn } from './AsynX.types';
import { AsynXExtendable } from './AsynX.extendable';
import { pageSizeEdged } from './AsynX.helper';

export class AsynXPaged<Item extends Record<string, any>, Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>, Res extends TAsyncReturn<Api> = TAsyncReturn<Api>>
  extends AsynXExtendable<Api, Req, Res> implements IAsynXPaged<Item, Api, Req, Res> {
  @observable public isLoadedAll = false;
  @observable public isLoadingMore = false;

  // чтобы работало обновление списка, _data должна бать НЕ observable.ref, т.к. нужно наблюдать внутреннее состояние
  @observable protected _data?: Res;

  constructor(_apiFn: Api, protected _opts: IAsynXPagedOpts<Item, Api>) {
    super(_apiFn, _opts, {
      onSetData: (res) => {
        runInAction(() => {
          this.isLoadingMore = false;
        });
        return res;
      },
      onReset: () => {
        runInAction(() => {
          this.isLoadedAll = false;
          this.isLoadingMore = false;
        });
      },
      onGet: (req, res) => {
        const array = res && this._opts.getArray(res);
        runInAction(() => {
          this.isLoadedAll = !array || array.length === 0 || ((array.length % req[this._opts.pageSizeKey]) !== 0);
        });
        return res;
      },
      onError: (err) => {
        runInAction(() => {
          this.isLoadingMore = false;
        });
        return err;
      },
      onLoad: (req) => {
        return { ...this.req, [this._opts.pageSizeKey]: this._pageSizeAll } as Req;
      },
    });
    makeObservable(this);
  }

  @computed
  public get list() {
    return this.data && this._opts.getArray(this.data);
  }

  @computed
  public get canLoadMore() {
    return !!this._data && !this.isLoadedAll && !this.isError;
  }

  @computed
  private get _pageSize() {
    return this.req ? this.req[this._opts.pageSizeKey] : 0;
  }

  @computed
  private get _pageSizeAll() {
    return this._opts.silent && !this._isLoaded ? this._pageSize : pageSizeEdged(this._pageSize, this.list);
  }

  @action.bound
  public async loadMore() {
    this._loadTickerClear();
    if (!this.req || !this.canLoadMore || this.isLoadingMore) return;
    this.isLoadingMore = true;
    const [res] = await this._getFromApi({ ...this.req, [this._opts.offsetKey]: this._pageSizeAll });
    const resArray = res && this._opts.getArray(res);
    let data: Res | null | undefined;
    if (this.list && resArray) {
      // const dataNext = this.list.concat(resArray);
      runInAction(() => (this.list as IObservableArray).push(...resArray));
      data = this._data;
    } else {
      data = res;
    }
    this._setFromApi([data]);
  }
}
