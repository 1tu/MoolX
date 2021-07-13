import { action, computed, makeObservable, observable } from 'mobx';
import { Formatter } from '../util/formatter.util';
import { LambdaValue, resolveLambdaValue } from './LambdaX.reactive';

export type TNumberXDelimiter = '.' | ',';

export interface INumberXParts {
  int: string;
  decimal?: string;
  delimiter?: string;
}

export interface INumberXLimiter {
  max?: number;
  min?: number;
  precision?: number;
}

export interface INumberXOpts {
  delimiters?: TNumberXDelimiter[];
  limiter?: INumberXLimiter;
}

const DELIMITER_LIST: TNumberXDelimiter[] = [',', '.'];

const DEFAULT_OPTS: INumberXOpts = {
  delimiters: DELIMITER_LIST,
  limiter: {},
};

type TNumberXIn = string | number | undefined;

export class NumberX {
  public static readonly nativeDelimiter: TNumberXDelimiter = '.';
  public static readonly reClearSource = '[^-0-9\\' + DELIMITER_LIST.join('') + ']';
  public static readonly reClear = new RegExp(NumberX.reClearSource, 'g');
  public static readonly reDelimiter = new RegExp('[' + DELIMITER_LIST.join('') + ']{1}', 'g');

  public static num2parts(num: TNumberXIn, precision?: number): INumberXParts | undefined {
    if (!num) return;
    const [int, decimal = ''] = num.toString().replace(this.reClear, '').split(this.reDelimiter);

    return {
      int: NumberX._isIntValidPartial(int) ? int : parseInt(int, 10).toString(),
      delimiter: precision === 0 ? undefined : DELIMITER_LIST.find(dl => num?.toString().includes(dl)),
      decimal: precision && decimal.length > precision ? decimal.slice(0, precision) : decimal,
    };
  }

  public static format(parts?: INumberXParts, noFormat?: boolean) {
    if (!parts) return;
    const { int, decimal, delimiter } = parts;
    const floatPart = delimiter ? NumberX.nativeDelimiter + decimal : '';
    return (this._isIntValidPartial(int) || noFormat ? int : Formatter.number(parseInt(int, 10), { precision: 0 })) + floatPart;
  }

  private static _isIntValidPartial(int: string) {
    return int === '-0' || int === '-';
  }

  @observable private _inputLV: LambdaValue<TNumberXIn>;

  @computed
  public get inputRaw() {
    return resolveLambdaValue(this._inputLV);
  }

  @computed
  public get value(): number | undefined {
    if (!this._parts || !this.string) return;
    const { int, delimiter } = this._parts;
    if (!int || (NumberX._isIntValidPartial(int) && !delimiter)) return;
    const num = parseFloat(this.string);
    const limiter = this._opts.limiter;
    if (!!limiter) {
      if (limiter.max != null && num > limiter.max) return limiter.max;
      else if (limiter.min != null && num < limiter.min) return limiter.min;
    }
    return num;
  }

  @computed
  public get string() {
    return NumberX.format(this._parts, true);
  }

  @computed
  public get formatted(): string | undefined {
    return NumberX.format(this._parts);
  }

  @computed
  public get isNegative() {
    return this._parts?.int[0] === '-';
  }

  @computed
  private get _parts(): INumberXParts | undefined {
    return NumberX.num2parts(this.inputRaw, this._opts.limiter?.precision);
  }

  @computed
  private get _opts() {
    return { ...DEFAULT_OPTS, ...resolveLambdaValue(this._optsLV) };
  }

  constructor(numStrLV: LambdaValue<TNumberXIn>, private _optsLV: LambdaValue<INumberXOpts>) {
    this._inputLV = numStrLV;
    makeObservable(this);
  }

  @action
  public inputSet(inputLV: LambdaValue<TNumberXIn>) {
    this._inputLV = inputLV;
  }

  public sync(num?: number): string | undefined {
    if (num === this.value) return this.formatted;
    const parts = NumberX.num2parts(num);
    if (parts) return NumberX.format(parts);
    return this.formatted;
  }
}
