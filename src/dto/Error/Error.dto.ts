export interface IErrorDTO<C = number> extends Partial<Error> {
  code?: C;
  fn?: string;
  readonly signoutNeed?: boolean;
}

// отмена mobx.wait не является бизнесовой ошибкой
export const errorWhenCancelled = 'WHEN_CANCELLED';
