import { LambdaValue } from '../LambdaX.reactive';
import { TObject } from '../../types/base.types';

export interface IVModalModel<C = any, P extends TObject<C> = {}> {
  inViewPort: boolean;
  context?: C;
  readonly isVisible: boolean;
  readonly isDisabled: boolean;
  readonly props: { onClose: () => void; onBackdropPress: () => void; onModalShow: () => void; onModalHide: () => void; onBackButtonPress: () => void; isVisible: boolean };
  setVisible(isVisible: LambdaValue<boolean>): void;
  close(): void;
  open(context?: C): void;
  toggle(context?: C): void;
  whenClose(): Promise<void> & { cancel(): void };
  setDisabled(isDisabled: LambdaValue<boolean>): void;
  setProps(props: LambdaValue<P | undefined>): void;
}
