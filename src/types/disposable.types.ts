import isFunction from 'lodash/isFunction';

export type TDisposer = () => any;

export interface IDisposable {
  dispose: TDisposer;
}

export function isDisposable(obj: any): obj is IDisposable {
  return isFunction(obj.dispose);
}
