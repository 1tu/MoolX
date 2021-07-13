import { DFilterXModel } from './D.FilterX.model';
import { EDFilterXType } from '../D.FilterX.types';

export class DFilterXBooleanModel extends DFilterXModel<boolean> {
  public readonly type = EDFilterXType.Boolean;

  public filter(value: boolean) {
    if (this.isEmpty) return true;
    switch (this.operator) {
      case '!=':
        return value !== this.dto;
      case '==':
        return value === this.dto;
      default:
        throw new Error(`[FilterBoolean] unknown operator: ${this.operator}`);
    }
  }

  public clone() {
    return new DFilterXBooleanModel(this._dtoLV, this.operator, this.config);
  }
}
