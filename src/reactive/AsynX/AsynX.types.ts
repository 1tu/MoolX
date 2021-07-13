import { LambdaValue } from '../LambdaX.reactive';
import { IErrorDTO } from '../../dto/Error/Error.dto';

export type TAsyncRequestId = number;
export type TAsync = (args: any) => Promise<any | any[]>;
export type TAsyncArguments<T> = T extends (req: infer R) => any ? R : never;
export type TAsyncReturn<T> = T extends (req: any) => Promise<infer R> ? R : never;
export type TArrayElement<A> = A extends (infer T)[] ? T : A;
export type TAsyncError = IErrorDTO;
export type TAsyncAnswer<Res> = [Res | undefined | null, TAsyncRequestId?]; // null === api вернул ошибку
export interface IAsyncAnswer<Res> {
  res?: Res;
  error?: TAsyncError;
  id?: TAsyncRequestId;
}

export interface IAsynXPromiseControl {
  promise: Promise<void>;
  resolve(value?: any): void;
  reject(value?: any): void;
}

export interface IAsynX<Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>, Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> {
  data?: Res;
  error?: TAsyncError;
  readonly req?: Req;
  readonly isLoaded: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  // работает только если установлен interval
  readonly isReloading: boolean;
  clear(untrack?: boolean): void;
  refresh(): Promise<void>;
  // работает только если установлен interval
  stop(): void;
}

export interface IAsynXExtension<Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> {
  onGetData?: () => void; // нельзя внутри изменять observable, ибо может быть loop
  onSetData?: (res?: Res) => Res | undefined;
  onRefresh?: () => void;
  onClear?: () => void;
  onReset?: () => void;
  onLoad?: (req: Req) => Req;
  onGet?: (req: Req, res?: Res) => Res | undefined;
  onError?: (error: TAsyncError) => TAsyncError;
}

export interface IAsynXPagedExtension<Item> {
  readonly isLoadingMore: boolean;
  readonly isLoadedAll: boolean;
  readonly canLoadMore: boolean;
  readonly list?: Item[];
  loadMore(): void;
}

export type IAsynXPaged<Item, Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> = IAsynX<Api, Req, Res> & IAsynXPagedExtension<Item>;

// в методах нельзя ничего менять внутри себя же
export interface IAsynXOpts<Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> {
  // for debug
  name?: string;
  // без удаления текущего значение (не будет состояния loading, данные просто тихо обновятся)
  silent?: boolean;
  req?: LambdaValue<Req | undefined>;
  retryOnError?: boolean | number;
  clearOnUnobserve?: boolean;
  refreshOnObserve?: boolean;
  // запросы посылаются по интервалу
  interval?: LambdaValue<number | undefined>;
  onError?(error: TAsyncError): void;
  onLoaded?(req: Req, res?: Res): void;
  onUnobserve?(): void;
}

export interface IAsynXPagedExtensionOpts<Item, Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> {
  pageSizeKey: keyof Req;
  offsetKey: keyof Req;
  getArray(res: Res): Item[];
}

export type IAsynXPagedOpts<Item, Api extends TAsync = TAsync,
  Req extends TAsyncArguments<Api> = TAsyncArguments<Api>,
  Res extends TAsyncReturn<Api> = TAsyncReturn<Api>> =
  IAsynXOpts<Api, Req, Res> & IAsynXPagedExtensionOpts<Item, Api, Req, Res>;
