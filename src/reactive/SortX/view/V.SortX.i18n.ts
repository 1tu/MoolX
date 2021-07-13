import { EDSortDirection } from '../domain/D.SortX.types';

export class VSortXI18n {
  public static direction: { [D in EDSortDirection]: string } = {
    [EDSortDirection.Asc]: 'По возрастанию',
    [EDSortDirection.Desc]: 'По убыванию',
    [EDSortDirection.None]: 'Отсутствует',
  };
}
