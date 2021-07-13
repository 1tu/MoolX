import { action, makeObservable, observable } from 'mobx';

export class ToggleX<T = any> {
  @observable public isOpen: boolean;
  @observable public context?: T;

  constructor(isOpen: boolean = false) {
    this.isOpen = isOpen;
    makeObservable(this);
  }

  @action.bound
  public close(): void {
    this.isOpen = false;
    this.context = undefined;
  }

  @action.bound
  public open(context?: T): void {
    this.context = context;
    this.isOpen = true;
  }

  @action.bound
  public toggle(next?: boolean): void {
    if (next == null ? !this.isOpen : next) this.open();
    else this.close();
  }
}
