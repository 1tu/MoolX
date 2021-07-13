export type TDCurrencyCode = string;

export enum EDCurrencyCode {
  RUR = 'RUR',
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  CHF = 'CHF',
  CNY = 'CNY',
  GBP = 'GBP',
}

export const DCurrencyCodeRuble = [EDCurrencyCode.RUR, EDCurrencyCode.RUB];

export interface IDCurrencyDTO {
  Name: TDCurrencyCode;
  // TODO: currency
  // Code?: TDCurrencyCode;
}

