const TRIAD_NAMES = ['', 'тыс.', 'млн.', 'млрд.', 'трлн.', 'блн.'];

export const numberHearZero = 1E-7;

interface INumberShort {
  precision?: number;
  num: number;
  triad: string;
}

export function numberShort(value: string | number = 0, resultNumberCount?: number, shortCount: number = 1000000): INumberShort {
  value = value || 0;
  if (typeof value === 'number') {
    value = value.toString();
  } else {
    value = value.replace(/\s*/g, '');
    if (isNaN(parseFloat(value))) {
      // TODO: подумать что вернуть в этом случае, посмотреть использование
      return { num: 0, triad: '' };
    }
  }

  const numValue = parseFloat(value);
  if (numValue < shortCount) {
    return {
      precision: 2,
      num: numValue,
      triad: TRIAD_NAMES[0],
    };
  }

  const intValue = value.replace(/[\.,]\d*/, '');
  let triadCount = Math.floor(intValue.length / 3);
  let sliceTo = intValue.length % 3;
  if (sliceTo === 0) {
    sliceTo = 3;
    triadCount -= 1;
  }

  const num = parseFloat(triadCount ? intValue.slice(0, sliceTo) + '.' + intValue.slice(sliceTo) : value.replace(',', '.'));

  return {
    precision: num === 0 ? 2 : (resultNumberCount && resultNumberCount > sliceTo ? resultNumberCount - sliceTo : undefined),
    num, triad: TRIAD_NAMES[triadCount],
  };
}

export function numberRound(n: number, precision: number = 0) {
  const cfc = Math.pow(10, precision);
  return Math.round(n * cfc) / cfc;
}


export function numberIsZero(n: number) {
  return Math.abs(n) < numberHearZero;
}

export function numberEnsureZero(n: number) {
  return numberIsZero(n) || !isFinite(n) ? 0 : n;
}
