import { action, computed, makeObservable, observable, when } from 'mobx';
import { IVModalModel } from './V.Modal.types';
import { LambdaValue, ValueHolder } from '../LambdaX.reactive';
import { TObject } from '../../types/base.types';

export class VModalModel<C = any, P extends TObject<C> = {}> implements IVModalModel<C, P> {
  @observable public inViewPort = false;
  @observable.ref public context?: C;

  private _isVisible = new ValueHolder<boolean>(false);
  private _isDisabled = new ValueHolder<boolean>(false);
  private _props = new ValueHolder<P | undefined>(undefined);

  constructor() {
    makeObservable(this);
  }

  @computed
  public get isVisible(): boolean {
    return this._isVisible.value || !!this._props.value?.isVisible;
  }

  public setVisible(isVisible: LambdaValue<boolean>) {
    this._isVisible.setValue(isVisible);
    return this;
  }

  @action.bound
  public close() {
    this._isVisible.setValue(false);
    // если грохнуть контект тут, не срабатывает onModalHide
    // this.context = undefined;
    return this;
  }

  @action.bound
  public open(context?: C) {
    this.context = context;
    this._isVisible.setValue(true);
    return this;
  }

  @action.bound
  public toggle(context?: C) {
    if (this._isVisible.value) this.close();
    else this.open(context);
    return this;
  }

  /**
   * Используется, чтобы подождать закрытия диалога.
   * @example
   * await dialog.whenClose();
   */
  public whenClose() {
    return when(() => !this.inViewPort);
  }

  /**
   * Признак необходимости:
   * - блокировать возможность закрыть диалог;
   * - привести кнопки, поля ввода и др. управляющие элементы в состояние disabled.
   * По этому признаку отключается возможность закрыть модалку через дефолтный onRequestClose.
   * Используется на фоне долгих операций, требующих дождаться их выполнения
   */
  @computed
  public get isDisabled() {
    return this._isDisabled.value;
  }

  public setDisabled(isDisabled: LambdaValue<boolean>) {
    this._isDisabled.setValue(isDisabled);
    return this;
  }

  @action
  public setProps(props: LambdaValue<P | undefined>) {
    this._props.setValue(props);
    return this;
  }

  @computed
  public get props() {
    return {
      isVisible: this.isVisible,
      onModalHide: this._onModalHide,
      onModalShow: this._onModalShow,
      onClose: this._onClose,
      onBackdropPress: this._onBackdropPress,
      onBackButtonPress: this._onBackButtonPress,
    };
  }

  @action.bound
  private _onBackdropPress(): void {
    if (this._props.value?.onBackdropPress) {
      this._props.value.onBackdropPress();
    } else {
      this._onClose();
    }
  }

  @action.bound
  private _onBackButtonPress(): void {
    if (this._props.value?.onBackButtonPress) {
      this._props.value.onBackButtonPress();
    } else {
      this._onClose();
    }
  }

  @action.bound
  private _onClose(): void {
    if (this._props.value?.onClose) {
      this._props.value.onClose(this.context as C);
    } else {
      if (!this.isDisabled) this.close();
    }
  }

  @action.bound
  private _onModalShow(): void {
    this.inViewPort = true;
    this._props.value?.onModalShow?.();
  }

  @action.bound
  private _onModalHide(): void {
    this.context = undefined;
    this.inViewPort = false;
    this._props.value?.onModalHide?.();
  }
}
