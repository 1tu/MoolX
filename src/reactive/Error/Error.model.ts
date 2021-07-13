import { IErrorModel } from './Error.types';
import { ModelXValue } from '../ModelX/ModelX.model';
import { IErrorDTO } from '../../dto/Error/Error.dto';
import { computed, makeObservable, observable } from 'mobx';
import { LambdaValue } from '../LambdaX.reactive';

export class ErrorModel<DTO extends IErrorDTO = IErrorDTO> extends ModelXValue<DTO> implements IErrorModel<DTO> {
  public get isNotified(): boolean {
    return this._isNotified;
  }

  public set isNotified(value: boolean) {
    this._isNotified = value;
  }

  @observable protected _message?: string;

  @computed
  public get message(): string {
    return this._message || this.dto.message || 'Непредвиденная ошибка';
  }

  public set message(value: string) {
    this._message = value;
  }

  protected _isNotified = false;

  constructor(dtoLV: LambdaValue<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public toJSON() {
    return {
      message: this.message,
      fn: this.dto.fn,
      stack: this.dto.stack,
      code: this.dto.code,
    };
  }
}
