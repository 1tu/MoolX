import moment, { DurationInputArg1 } from 'moment';
import cf from 'currency-formatter';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import { numberShort } from './number.util';
import { pluralize } from './string.util';
import { TDurationISO8601 } from '../types/base.types';

const defaultCurrencyOptions: CurrencyFormatterOptions = {
  thousand: ' ',
  decimal: ',',
  precision: 2,
  format: {
    pos: '%v %s',
    neg: '-%v %s',
    zero: '%v %s',
  },
  bigThreshold: 1e4,
};

const defaultNumberOptions: NumberFormatOptions = {
  ...defaultCurrencyOptions,
  format: {
    pos: '%v',
    neg: '-%v',
    zero: '%v',
  },
};

export interface DurationFormatOptions {
  pattern: 'humanize' | 'countdown' | 'humanizeYearCount';
  units?: 'days' | 'hours' | 'minutes_or_seconds';
  omitLeadingZeroes?: boolean;
}

export interface DateFormatOptions {
  pattern?: 'default' | 'date' | 'time' | 'dateTime' | 'days' | string;
  calendar?: boolean;
}

const defaultDurationFormatOptions: Partial<DurationFormatOptions> = {
  units: 'days',
};

const defaultDateFormatOptions: Partial<DateFormatOptions> = {
  pattern: 'default',
};

const humanizeYearCountPluralStrings = {
  one: 'год',
  lt5: 'года',
  gt5: 'лет',
};

export enum FormatterPreset {
  BigAmount = 'BigAmount',
}

type PresetFunc<TOpts> = (num: number, opts: TOpts) => TOpts;

export class Formatter {
  public static currency(num: number = 0, presetOrOpts: FormatterPreset | CurrencyFormatterOptions = {},
    opts: CurrencyFormatterOptions = {},
  ): string {
    if (isString(presetOrOpts)) {
      const preset = ((this as any)['preset' + presetOrOpts] as PresetFunc<CurrencyFormatterOptions>);
      opts = { ...defaultCurrencyOptions, ...opts };
      if (preset) {
        opts = { ...opts, ...preset(num, opts) };
      }
    } else {
      opts = { ...presetOrOpts, ...opts };
    }
    opts = this._presetBigAmount(num, opts);

    if (!opts.code) return this.number(num, opts);
    if (opts.priceStep) this._priceStepHandle(opts);

    opts.code = this._codeCheckWrong(opts.code);
    if (opts && opts.short) num = this._shortHandle(num, opts);

    if (opts.roundWholeNumber) {
      num = Math.round(num / opts.roundWholeNumber) * opts.roundWholeNumber;
    }

    if (opts.signed === true) {
      opts.format = { neg: '-%v %s', pos: '+%v %s', zero: '%v %s' };
    } else if (opts.signed === false) {
      opts.format = { neg: '%v %s', pos: '%v %s', zero: '%v %s' };
    }

    let result = cf.format(num, { ...defaultCurrencyOptions, ...opts });
    if (opts.omitZero) result = this._precisionZeroOmit(result);
    return this._nonBreakingMake(result);
  }

  public static number(num: number = 0, opts: NumberFormatOptions = {}): string {
    if (opts.priceStep) this._priceStepHandle(opts);
    if (opts.short) num = this._shortHandle(num, opts, true);
    if (opts.roundWholeNumber) {
      num = Math.round(num / opts.roundWholeNumber) * opts.roundWholeNumber;
    }

    if (opts.signed === true) {
      opts.format = { neg: '-%v', pos: '+%v', zero: '%v' };
    } else if (opts.signed === false) {
      opts.format = { neg: '%v', pos: '%v', zero: '%v' };
    }

    let result = cf.format(num, { ...defaultNumberOptions, ...opts });
    if (opts.omitZero) result = this._precisionZeroOmit(result);
    return this._nonBreakingMake(result);
  }

  public static symbol(code: string) {
    const currencyData = this.currencyData(code);
    return currencyData ? currencyData.symbol : '';
  }

  public static currencyData(code: string) {
    code = this._codeCheckWrong(code);
    return cf.findCurrency(code);
  }

  public static priceStepMorph(num: number): number {
    if (num == null) return 2;
    return num.toFixed(12).replace(/0*$/, '').replace(/^\d+\./, '').length;
  }

  public static bankAccount(str?: string): string {
    if (str == null) return '';
    return str.replace(/(.{4})/g, '$1 ').trim();
  }

  public static duration(arg: DurationInputArg1 | TDurationISO8601, opts: DurationFormatOptions): string {
    opts = { ...defaultDurationFormatOptions, ...opts };
    let result: string | null = null;

    this._relativeTimeThresholdReset();
    if (opts.pattern === 'humanize') {
      moment.relativeTimeThreshold('d', 30); // до 30 дней показываем дни
      moment.relativeTimeThreshold('M', 1000); // года не показываем
      moment.relativeTimeThreshold('m', 60);
      result = moment.duration(arg).humanize();
    } else if (opts.pattern === 'countdown') {
      const d = moment.duration(arg);
      const locale = d.localeData();
      let items = [];
      let hours = d.hours();

      if (opts.units === 'days') {
        const days = Math.floor(d.asDays());
        items.push(locale.relativeTime(days, false, 'dd', false));
      } else if (opts.units === 'hours') {
        hours = Math.floor(d.asHours());
      }

      if (hours) items.push(locale.relativeTime(hours, false, 'hh', false));
      items.push(locale.relativeTime(d.minutes(), false, 'mm', false));
      if (opts.units === 'minutes_or_seconds') items.push(locale.relativeTime(d.seconds(), false, 'ss', false));
      if (!opts.omitLeadingZeroes) items = items.map(item => item[1] === ' ' ? '0' + item : item); // make 00 format

      result = items.join(' ');
    } else if (opts.pattern === 'humanizeYearCount') {
      if (!isNumber(arg)) throw new Error('Arg for pattern humanizeYearCount must be number');
      result = `${arg} ${pluralize(arg, humanizeYearCountPluralStrings)}`;
    }

    return result || moment.duration(arg).humanize();
  }

  public static date(date: Date | string, opts?: DateFormatOptions): string {
    opts = { ...defaultDateFormatOptions, ...opts };

    let result: string;
    const md = moment(date);

    if (opts.pattern === 'default') {
      result = md.format('DD.MM.YYYY');
    } else if (opts.pattern === 'date') {
      result = md.format('D MMM YYYY');
    } else if (opts.pattern === 'time') {
      result = md.format('HH:mm');
    } else if (opts.pattern === 'dateTime') {
      const elseFormat = 'DD.MM.YY, HH:mm';
      result = opts.calendar ? md.calendar(undefined, {
        sameDay: '[Сегодня], HH:mm', lastDay: '[Вчера], HH:mm',
        sameElse: elseFormat, lastWeek: elseFormat,
      }) : md.format(elseFormat);
    } else if (opts.pattern === 'days') {
      const elseFormat = moment().year() === md.year() ? 'D MMMM' : 'D MMMM, YYYY';
      result = opts.calendar ? md.calendar(undefined, {
        sameDay: '[Сегодня]', lastDay: '[Вчера]',
        sameElse: elseFormat, lastWeek: elseFormat,
      }) : md.format(elseFormat);
    } else {
      const elseFormat = opts.pattern;
      result = opts.calendar ? md.calendar(undefined, {
        sameDay: '[Сегодня]', lastDay: '[Вчера]',
        sameElse: elseFormat, lastWeek: elseFormat,
      }) : md.format(elseFormat);
    }
    return result;
  }

  public static timer(timeToFinish: number): string {
    const time = timeToFinish;
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    let formattedMin = `${min}`;
    if (min < 10) formattedMin = `0${min}`;
    let formattedSec = `${sec}`;
    if (sec < 10) formattedSec = `0${sec}`;
    return `${formattedMin}:${formattedSec}`;
  }

  private static _nonBreakingMake(str: string) {
    return str.replace(/ /g, '\u00a0');
  }

  private static _relativeTimeThresholdReset() {
    // moment defaults
    moment.relativeTimeThreshold('d', 26);
    moment.relativeTimeThreshold('M', 11);
    moment.relativeTimeThreshold('h', 22);
    moment.relativeTimeThreshold('m', 45);
  }

  private static _priceStepHandle(opts: NumberFormatOptions) {
    if (opts.priceStep == null) opts.precision = 2;

    if ((opts.priceStep as number) < 1) {
      opts.precision = this.priceStepMorph(opts.priceStep as number);
    } else {
      opts.precision = 0;
      opts.roundWholeNumber = opts.priceStep;
    }
  }

  private static _shortHandle(num: number, opts: NumberFormatOptions, noSymbol?: boolean) {
    const short = numberShort(num, opts.shortNumCount, opts.shortCount);
    if (short.precision != null) opts.precision = short.precision;
    if (short.triad) opts.format = `%v ${short.triad + (noSymbol ? '' : ' %s')}`;
    return short.num;
  }

  private static _precisionZeroOmit(str: string) {
    return str.replace(/[\.,]\s?\d+/, (match) => {
      match = match.replace(/0+$/, '');
      return /\d/.test(match) ? match : '';
    });
  }

  private static _codeCheckWrong(code: string) {
    return code === 'RUR' ? 'RUB' : code;
  }

  private static _presetBigAmount(num: number, opts: CurrencyFormatterOptions) {
    let result = opts;

    if (opts.bigThreshold) {
      const isBig = Math.abs(num) >= opts.bigThreshold;
      if (isBig) result = { ...opts, precision: 0 };
    }

    return result;
  }
}
