export interface IPluralStrings {
  one: string;
  lt5: string;
  gt5: string;
}

export interface II18nMap extends IPluralStrings {
  many: string;
}

export interface IPluralizeOpts {
  withNumber?: boolean;
  skipOne?: boolean;
}

export function pluralize(num: number | string, pluralStrings: IPluralStrings, opts: IPluralizeOpts = {}): string {
  if (num == null || !pluralStrings) return '';

  num = Math.abs(parseInt((num as string), 10));
  const result = opts.withNumber ? num + ' ' : '';
  const plural = num % 10 === 1 && num % 100 !== 11
    ? 0 : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
      ? 1 : 2);
  switch (plural) {
    case 0:
      return result + (opts.skipOne ? pluralStrings.lt5 : pluralStrings.one);
    case 1:
      return result + pluralStrings.lt5;
    case 2:
      return result + pluralStrings.gt5;
    default:
      return result + pluralStrings.gt5;
  }
}

export class I18n {
  public static Pluralize = pluralize;
  public static Many = (map: II18nMap): string => map.many;
}
