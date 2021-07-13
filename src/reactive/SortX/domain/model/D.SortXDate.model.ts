import { DSortXModel } from './D.SortX.model';
import { EDSortDirection, EDSortXType } from '../D.SortX.types';

export class DSortXDateModel extends DSortXModel<Date> {
  public readonly type = EDSortXType.Date;

  public sort(a: Date, b: Date) {
    a = new Date(a);
    b = new Date(b);
    if (this.isEmpty) return 0;
    switch (this.dto) {
      case EDSortDirection.Asc:
        return a.getTime() - b.getTime();
      case EDSortDirection.Desc:
        return b.getTime() - a.getTime();
      default:
        throw new Error(`[SortDate] unknown direction: ${this.dto}`);
    }
  }

  public clone() {
    return new DSortXDateModel(this._dtoLV, this.config);
  }
}
