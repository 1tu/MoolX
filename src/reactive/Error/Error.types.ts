import { IModelXValue } from '../ModelX/ModelX.types';
import { IErrorDTO } from '../../dto/Error/Error.dto';

export interface IErrorModel<DTO extends IErrorDTO = IErrorDTO> extends IModelXValue<DTO> {
  message: string;
  isNotified: boolean;
}
