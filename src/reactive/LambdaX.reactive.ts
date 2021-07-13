import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable, when } from 'mobx';

export type LambdaValue<TValue> = TValue | (() => TValue);

// Если value функция, вызвать для получения значения, иначе вернуть value.
export function resolveLambdaValue<T extends any>(value: LambdaValue<T>): T {
  return isFunction(value) ? value() : value;
}

export interface IValueHolder<T> {
  readonly value: T;
  setValue(value: LambdaValue<T>): void;
}

export class ValueHolder<T> implements IValueHolder<T> {
  @observable.ref private _value: LambdaValue<T>;

  constructor(value: LambdaValue<T>) {
    this._value = value;
    makeObservable(this);
  }

  @action
  public setValue(value: LambdaValue<T>) {
    this._value = value;
  }

  @computed
  public get value() {
    return resolveLambdaValue(this._value);
  }

  @computed
  public get isLambda() {
    return isFunction(this._value);
  }

  public whenChanged() {
    const value = this.value;
    return when(() => this.value !== value);
  }
}
