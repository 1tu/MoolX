import { DSortXModel } from './D.SortX.model';
import { EDSortXType } from '../D.SortX.types';
import { EDSortDirection } from '../D.SortX.types';

export class DSortXStringModel extends DSortXModel<string> {
  public readonly type = EDSortXType.String;

  public sort(a: string, b: string) {
    if (this.isEmpty) return 0;
    switch (this.dto) {
      case EDSortDirection.Asc:
        return a.length - b.length;
      case EDSortDirection.Desc:
        return b.length - a.length;
      default:
        throw new Error(`[SortString] unknown direction: ${this.dto}`);
    }
  }

  public clone() {
    return new DSortXStringModel(this._dtoLV, this.config);
  }
}
