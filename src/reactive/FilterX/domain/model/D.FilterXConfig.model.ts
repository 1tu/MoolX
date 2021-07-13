import { IDFilterXConfigItem, IDFilterXConfigModel, IDFilterXSelectItem, TDFilterXType } from '../D.FilterX.types';
import { ModelX } from '../../../ModelX/ModelX.model';

export class DFilterXConfigModel<T extends TDFilterXType>
  extends ModelX.Value<IDFilterXSelectItem<T>[] | undefined> implements IDFilterXConfigModel<T> {
  public input?: boolean;

  constructor(config: IDFilterXConfigItem<T>) {
    super(config.list);
    this.input = config.input;
  }
}
