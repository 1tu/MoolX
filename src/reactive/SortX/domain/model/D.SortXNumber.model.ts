import { DSortXModel } from './D.SortX.model';
import { EDSortXType } from '../D.SortX.types';
import { EDSortDirection } from '../D.SortX.types';

export class DSortXNumberModel extends DSortXModel<number> {
  public readonly type = EDSortXType.Number;

  public sort(a: number, b: number) {
    if (this.isEmpty) return 0;
    switch (this.dto) {
      case EDSortDirection.Asc:
        return a - b;
      case EDSortDirection.Desc:
        return b - a;
      default:
        throw new Error(`[SortNumber] unknown direction: ${this.dto}`);
    }
  }

  public clone() {
    return new DSortXNumberModel(this._dtoLV, this.config);
  }
}
