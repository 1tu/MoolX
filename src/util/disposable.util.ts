import isFunction from 'lodash/isFunction';
import { IReactionDisposer } from 'mobx';

type DisposableType = (...args: any) => any | IReactionDisposer;

interface IDisposableItem {
  disposer?: DisposableType;
}

export class DisposableHolder {
  private _items: IDisposableItem[] = [];

  public dispose() {
    while (this._items.length) {
      const item = this._items.shift()!;
      item.disposer?.();
    }
  }

  public push(disposer: DisposableType): void {
    if (isFunction(disposer)) this._items.push({ disposer });
  }
}
