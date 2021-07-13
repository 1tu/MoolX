import { DFilterXModel } from './D.FilterX.model';
import { EDFilterXType } from '../D.FilterX.types';

export class DFilterXStringModel extends DFilterXModel<string> {
  public readonly type = EDFilterXType.String;

  public filter(value: string) {
    if (this.isEmpty) return true;
    value = value.toLowerCase();
    const dto = this.dto?.toLowerCase() || '';
    switch (this.operator) {
      case 'equal':
        return value === dto;
      case 'include':
        return value.includes(dto);
      case 'startWith':
        return value.startsWith(dto);
      case 'endWith':
        return value.endsWith(dto);
      default:
        throw new Error(`[FilterString] unknown operator: ${this.operator}`);
    }
  }

  public clone() {
    return new DFilterXStringModel(this._dtoLV, this.operator, this.config);
  }
}
