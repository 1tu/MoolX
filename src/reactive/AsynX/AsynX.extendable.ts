import { action, computed, Lambda, observable, onBecomeUnobserved } from 'mobx';

import {
  IAsynX, IAsynXExtension, IAsynXOpts, IAsynXPromiseControl, TAsync, TAsyncAnswer, TAsyncArguments, TAsyncError,
  TAsyncRequestId, TAsyncReturn,
} from './AsynX.types';
import { LambdaValue, resolveLambdaValue } from '../LambdaX.reactive';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

// TODO: сделать opts.interval - LambdaValue
export abstract class AsynXExtendable<Api extends TAsync = TAsync, Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> implements IAsynX<Api, Req, Res> {
  @observable public isReloading = false; // как isLoading только когда обновились зависимости
  @observable protected _isTracked = true;

  protected _reqId: TAsyncRequestId = 0;
  protected _reqLast?: Req;
  protected _loadTicker?: any; // таймер асинхронного лоада (для lazyloading)
  protected _onErrorRetryCount = 0;
  protected _refreshPromise?: IAsynXPromiseControl;
  protected _onUnobservedListener?: Lambda;

  protected get _isObserved() {
    return !!this._onUnobservedListener;
  };

  protected _isTimedTicking = true;

  protected constructor(protected _apiFn: Api, protected _opts: IAsynXOpts<Api> = {},
    private _e: IAsynXExtension<Api, Req, Res> = {},
  ) {
    if (this._opts.req) this._req = this._opts.req;
  }

  protected abstract _data?: Res;
  @computed
  public get data() {
    // if (this._opts.name) console.log('DATA GET', this._opts.name);
    this._becomeObserved();
    if (this._isReqChanged && this._isTracked) {
      // if (this._opts.name) console.log('DATA GET CHANGE', this._opts.name);
      this._loadTickerStart();
    }
    // TODO: возможно стоит объеденить это выражение через computed? проверить
    if (this.interval && this.isLoaded) {
      if (!this._loadTicker && this._isTimedTicking) this._loadTickerStart(this.interval);
    }
    this._e.onGetData?.();
    return this._data;
  }

  public set data(value) {
    // if (this._opts.name) console.log('DATA SET', this._opts.name);
    if (value) this._error = undefined;
    if (this.interval) {
      this._timedNext();
      this.isReloading = false;
    }
    if (this._e.onSetData) value = this._e.onSetData(value);
    this._data = value;
    this._isLoaded = true;
    this._isLoading = false;
    this._refreshPromise?.resolve();
  }

  @observable protected _error?: TAsyncError;
  @computed
  public get error() {
    return this._error;
  }

  public set error(value) {
    if (value) {
      if (this.interval) this.isReloading = false;
      // TODO: insert retryOnError here & split onError/onRetry
      if (this._e.onError) value = this._e.onError(value);
      if (this._opts.onError) this._opts.onError(value);
    }
    this._error = value;
    this._isLoaded = true;
    this._isLoading = false;
    this._refreshPromise?.reject();
  }

  @observable protected _reqLocal?: Req = undefined;
  @observable protected _req?: LambdaValue<Req | undefined>;
  @computed
  public get req() {
    const req = resolveLambdaValue(this._req);
    return this._reqLocal || req ? ({ ...this._reqLocal, ...req } as Req) : undefined;
  }

  @observable protected _isLoaded = false;
  @computed
  public get isLoaded() {
    return this._isLoaded;
  }

  @observable protected _isLoading = false;
  @computed
  public get isLoading() {
    this.data; // если нас интересует загружаются ли данные - значит они нам потенциально нужны. пробуем дёрнуть data
    return this._isLoading;
  }

  @computed
  public get isError() {
    return !!this.error;
  }

  @computed
  public get interval() {
    return resolveLambdaValue(this._opts.interval);
  }

  @computed
  protected get _isReqChanged() {
    // после установки гарантированно знаем что запрос выполнился
    // поэтому надо перерасчитать чтоб при следующем data get этот параметр тоже перерасчитался, а не брался из memo
    this._isLoading;
    let result: Req | undefined;
    if (!isEqual(this.req, this._reqLast)) {
      this._reqLast = cloneDeep(this.req);
      result = this.req; // возвращаем сам объект запроса, для того чтоб наблюдатели могли реагировать на изменения в запросе
    }
    // if (this._opts.name) console.log('IS REQ CHANGE', this._opts.name, result);
    return result;
  }

  // очистить полностью
  // untrack? - перестать отслеживать this.req
  @action.bound
  public clear(untrack?: boolean) {
    if (untrack) this._isTracked = false;
    this._data = undefined;
    this._loadTickerClear();
    this._reset(true);
    if (this.interval) this.stop();
    this._e.onClear?.();
  }

  // обновить данные
  @action.bound
  public async refresh() {
    // if (this._opts.name) console.log('REFRESH', this._opts.name);
    if (!this._refreshPromise) {
      const promise = new Promise<void>((resolve, reject) => {
        this._refreshPromise = {
          promise,
          resolve: () => {
            this._refreshPromise = undefined;
            resolve();
          }, reject: () => {
            this._refreshPromise = undefined;
            reject();
          },
        };
      });
      this._refreshPromise!.promise = promise;
    }
    this._isTracked = true;
    this._reset();
    if (this.interval) this._isTimedTicking = true;
    this._e.onRefresh?.();
    this._loadTickerStart();
    return this._refreshPromise?.promise;
  }

  @action.bound
  public stop(untrack?: boolean) {
    if (untrack) this._isTracked = false;
    // if (this._opts.name) console.log('STOP', this._opts.name);
    this._isTimedTicking = false;
    this._loadTickerClear();
  }

  protected _timedNext() {
    if (this.interval && this._isTimedTicking) this._loadTickerStart(this.interval);
  }

  protected _loadTickerStart(interval?: number) {
    // if (this._opts.name) console.log('LOAD START', this._opts.name);
    this._loadTickerClear();
    this._loadTicker = setTimeout(() => this._loadFromApi(), interval);
  }

  @action
  protected async _loadFromApi() {
    this._loadTickerClear();
    if (!this.req) return;
    // if (this._opts.name) console.log('LOAD FROM API', this._opts.name);
    if (this.interval) {
      this._isTimedTicking = true;
      if (this._isReqChanged) this.isReloading = true;
    }
    const req = this._e.onLoad ? this._e.onLoad(this.req) : this.req;
    this._setFromApi(await this._getFromApi(req));
  }

  @action
  protected async _getFromApi(req?: Req): Promise<TAsyncAnswer<Res>> {
    if (!req) return [null];

    const reqId = ++this._reqId;
    if (!this._opts.silent || !this._isLoaded) this._isLoading = true;
    try {
      let res = await this._apiFn(req) as Res | undefined;
      if (this._e.onGet) res = this._e.onGet(req, res);
      this._opts.onLoaded?.(req, res);
      return [res, reqId];
    } catch (error) {
      this.error = error;
      return [null, reqId];
    }
  }

  @action
  protected _setFromApi(answer: TAsyncAnswer<Res>) {
    let [data, reqId] = answer;
    if (reqId && reqId !== this._reqId) return;

    if (data === null) {
      if (this._opts.silent) return;
      else data = undefined;
    }
    this.data = data;
  }

  // сброс базовых свойств в начальное состояние
  @action
  private _reset(forceReload?: boolean) {
    if (!this._opts.silent) {
      this._data = undefined;
      this._isLoaded = false;
    }
    this._onErrorRetryCount = 0;
    if (forceReload) this._reqLast = undefined;
    this._error = undefined;
    this._isLoading = false;
    if (this.interval) this.isReloading = false;
    this._e.onReset?.();
  }

  protected _loadTickerClear() {
    if (!this._loadTicker) return;
    clearTimeout(this._loadTicker);
    this._loadTicker = undefined;
  }

  private _becomeObserved() {
    if (this._onUnobservedListener) return;

    if (this.interval) this._isTimedTicking = true;
    if (this._opts.refreshOnObserve && this.isLoaded) Promise.resolve().then(() => this.refresh());

    this._onUnobservedListener = onBecomeUnobserved(this, 'data', () => {
      // if (this._opts.name) console.log('BECOME UN observed', this._opts.name);
      this._onUnobservedListener?.();
      this._onUnobservedListener = undefined;
      if (this.interval) this._opts.clearOnUnobserve ? this.clear() : this.stop();
      if (this._error) this._reset(true);
      this._opts.onUnobserve?.();
    });
  }
}
