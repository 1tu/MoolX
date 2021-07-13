import { DFilterXModel } from './D.FilterX.model';
import { EDFilterXType } from '../D.FilterX.types';

export class DFilterXNumberModel extends DFilterXModel<number> {
  public readonly type = EDFilterXType.Number;

  public filter(value: number) {
    if (this.isEmpty) return true;
    switch (this.operator) {
      case '==':
        return value === this.dto!;
      case '!=':
        return value != this.dto!;
      case '>':
        return value > this.dto!;
      case '>=':
        return value >= this.dto!;
      case '<':
        return value < this.dto!;
      case '<=':
        return value <= this.dto!;
      default:
        throw new Error(`[FilterNumber] unknown operator: ${this.operator}`);
    }
  }

  public clone() {
    return new DFilterXNumberModel(this._dtoLV, this.operator, this.config);
  }
}
