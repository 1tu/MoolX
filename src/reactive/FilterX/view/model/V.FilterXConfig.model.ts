import { VModelX } from '../../../ModelX/V.ModelX.model';
import { IDFilterXConfigModel, IDFilterXTarget } from '../../domain/D.FilterX.types';
import { IVFilterXConfigItem, IVFilterXConfigModel } from '../V.FilterX.types';

export class VFilterXConfigModel<I extends IDFilterXTarget, K extends keyof I>
  extends VModelX.Value<IDFilterXConfigModel<I[K]>> implements IVFilterXConfigModel<I[K]> {
  public title?: string;
  public hidden?: boolean;
  public separate?: boolean;

  constructor(domain: IDFilterXConfigModel<I[K]>, data: IVFilterXConfigItem) {
    super(domain);
    this.title = data.title;
    this.hidden = data.hidden;
    this.separate = data.separate;
  }
}
