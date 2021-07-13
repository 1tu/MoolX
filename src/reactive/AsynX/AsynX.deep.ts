import { IAsynX, IAsynXOpts, TAsync, TAsyncArguments, TAsyncReturn } from './AsynX.types';
import { AsynXExtendable } from './AsynX.extendable';
import { makeObservable, observable } from 'mobx';

export class AsynXDeep<Api extends TAsync = TAsync, Req extends TAsyncArguments<Api> = TAsyncArguments<Api>, Res extends TAsyncReturn<Api> = TAsyncReturn<Api>>
  extends AsynXExtendable<Api, Req, Res> implements IAsynX<Api, Req, Res> {
  @observable protected _data?: Res;

  constructor(_apiFn: Api, _opts: IAsynXOpts<Api> = {}) {
    super(_apiFn, _opts, {
      onError: (err) => {
        if (this._opts.retryOnError) {
          this._onErrorRetryCount++;
          const needRetry = (typeof this._opts.retryOnError === 'number' && this._opts.retryOnError >= this._onErrorRetryCount) || this._opts.retryOnError === true;
          if (this._isObserved && needRetry) {
            if (this._opts.name) console.log('RETRY ON ERROR', this._opts.name);
            if (this._opts.interval) this._timedNext();
            else this._loadTickerStart(2000);
          }
        }
        return err;
      },
    });
    makeObservable(this);
  }
}


