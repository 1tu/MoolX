import { DFilterXModel } from './D.FilterX.model';
import { computed, makeObservable } from 'mobx';
import moment from 'moment';
import { EDFilterXType, IDFilterXConfigModel, TDFilterXDateOperator } from '../D.FilterX.types';
import { LambdaValue } from '../../../LambdaX.reactive';

export class DFilterXDateModel extends DFilterXModel<Date> {
  public readonly type = EDFilterXType.Date;

  constructor(dtoLV: LambdaValue<Date | undefined>, operator?: TDFilterXDateOperator, config?: IDFilterXConfigModel<Date>) {
    super(dtoLV, operator, config);
    makeObservable(this);
  }

  @computed
  private get _date() {
    return this.dto ? moment(this.dto) : undefined;
  }

  @computed
  private get _dayStart() {
    return this._date?.startOf('day');
  }

  @computed
  private get _dayEnd() {
    return this._date?.endOf('day');
  }

  public filter(value: Date) {
    if (this.isEmpty) return true;
    const date = moment(value);
    switch (this.operator) {
      case '==':
        return date.isAfter(this._dayStart) && date.isBefore(this._dayEnd);
      case '>':
        return date.isAfter(this._date);
      case '>=':
        return date.isAfter(this._dayStart);
      case '<':
        return date.isBefore(this._date);
      case '<=':
        return date.isBefore(this._dayEnd);
      default:
        throw new Error(`[FilterDate] unknown operator: ${this.operator}`);
    }
  }

  public clone() {
    return new DFilterXDateModel(this._dtoLV, this.operator, this.config);
  }
}
