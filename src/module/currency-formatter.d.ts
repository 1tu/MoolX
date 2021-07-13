declare module 'currency-formatter' {
  export = CF;
}

declare const CF: CurrencyFormatter;

interface CurrencyFormatterOptions extends NumberFormatOptions {
  /** Код валюты. Н-р: RUR, EUR */
  code?: string;
  /** Локаль. Н-р: RU */
  locale?: string;
  /** Задает символ, для отображения знака валюты */
  symbol?: string;
}

interface NumberFormatOptions {
  /** Отбрасывает незначащие нули. Н-р: 1,7700 -> 1,77 */
  omitZero?: boolean;
  /** Сокращение числа за счет использования слов-названий разрядов. Н-р: 1045000000 -> 1,045 млрд */
  short?: boolean;
  /** Минимальная разрядность при которой число будет сокращенно. Н-р: 1000 -> 1 тыс */
  shortCount?: number;
  /** Задает количество цифр в сокращенном числе(см. short). Н-р: 1045000000, 2 -> 1,1 млрд */
  shortNumCount?: number;
  /** Разделитель целой и дробной частей числа */
  decimal?: string;
  /** Разделитель разрядов, кратных 1000. Н-р: 1045000, '_' -> 1_045_000 */
  thousand?: string;
  /** Задает разряд для округления числа. Н-р: 1045117, 4 -> 1050000 */
  roundWholeNumber?: number;
  /** Задает точность дробной части (использует округление, чтобы отбросить лишнее). Н-р: 2,149, 2 -> 2,15 */
  precision?: number;
  /** Задает точность дробной части числа. От precision отличается форматом-указывается числом с необходимым количеством разрядов).
   * Используется округдение. Н-р: 2,149, 0,01 -> 2,15 */
  priceStep?: number;
  /** Задает знаки, которые будут использоваться положительным, отрицательным результатом, а также с нулем. Н-р: 88,1, { pos: '+' } -> +88,1 */
  format?: string | { pos?: string; neg?: string; zero?: string };
  /** Указывает шаблон для отображения знака для положительных и отрицательных значений, исключая ноль */
  signed?: boolean;
  /** Параметр задает порог, при превышении которого числа будет округлено до целого. */
  bigThreshold?: number;
}

interface CurrencyData {
  code: string;
  symbol: string;
  thousandsSeparator: string;
  decimalSeparator: string;
  symbolOnLeft: boolean;
  spaceBetweenAmountAndSymbol: boolean;
  decimalDigits: number;
}

declare interface CurrencyFormatter {
  currencies: CurrencyData[];
  format(amount: number, opts: CurrencyFormatterOptions): string;
  unformat(str: string, opts: CurrencyFormatterOptions): number;
  findCurrency(code: string): CurrencyData;
}
