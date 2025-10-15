type Signed = -1 | 0 | 1;

interface BigDecimalProps {
  decimals: number[];
  integers: number[];
  signed: Signed;
}

type BigDecimalValue = string | number | BigDecimalProps;

const SAFE_REGEX = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
const SAFE_BASE_LOG = 5;

const SIGNED_POSITIVE = 1;
const SIGNED_NEUTRO = 0;
const SIGNED_NEGATIVE = -1;

const CHAR_NEGATIVE = 45;

const PROPS_ZERO: BigDecimalProps = {
  decimals: [],
  integers: [0],
  signed: 0
};

export class BigDecimal {
  public readonly signed: Signed;

  public readonly integers: number[];

  public readonly decimals: number[];

  protected constructor(value: BigDecimalValue | BigDecimal) {
    const props = bigDecimalPropsFromValue(value);

    this.signed = props.signed;
    this.integers = props.integers;
    this.decimals = props.decimals;
  }

  public get data(): number {
    return +this;
  }

  public abs(): BigDecimal {
    return new BigDecimal({
      decimals: this.decimals,
      integers: this.integers,
      signed: SIGNED_POSITIVE
    });
  }

  public negative(): BigDecimal {
    return new BigDecimal({
      decimals: this.decimals,
      integers: this.integers,
      signed: (this.signed * -1) as Signed
    });
  }

  public isNegative(): boolean {
    return this.signed === SIGNED_NEGATIVE;
  }

  public isPositive(): boolean {
    return this.signed === SIGNED_POSITIVE;
  }

  public isZero(): boolean {
    return this.signed === SIGNED_NEUTRO;
  }

  public equals(value: BigDecimalValue): boolean {
    const bigDecimal = valueToBigDecimal(value);

    if (this.signed !== bigDecimal.signed) {
      return false;
    }

    if (
      this.integers.length !== bigDecimal.integers.length ||
      this.decimals.length !== bigDecimal.decimals.length
    ) {
      return false;
    }

    const numbers1 = [...this.integers, ...this.decimals];
    const numbers2 = [...bigDecimal.integers, ...bigDecimal.decimals];

    for (let i = 0; i < numbers1.length; ++i) {
      if (numbers1[i] !== numbers2[i]) {
        return false;
      }
    }

    return true;
  }

  public greaterThan(value: BigDecimalValue): boolean {
    return compareTo(this, valueToBigDecimal(value)) > 0;
  }

  public greaterThanOrEqualTo(value: BigDecimalValue): boolean {
    return compareTo(this, valueToBigDecimal(value)) >= 0;
  }

  public lessThan(value: BigDecimalValue): boolean {
    return compareTo(this, valueToBigDecimal(value)) < 0;
  }

  public lessThanOrEqualTo(value: BigDecimalValue): boolean {
    return compareTo(this, valueToBigDecimal(value)) <= 0;
  }

  public clone(): BigDecimal {
    return new BigDecimal({
      decimals: this.decimals,
      integers: this.integers,
      signed: this.signed
    });
  }

  public toString(): string {
    return bigDecimalToString(this);
  }

  public static create(value: BigDecimalValue): BigDecimal {
    return new BigDecimal(value);
  }

  public static zero(): BigDecimal {
    return new BigDecimal(PROPS_ZERO);
  }
}

export function bigDecimal(value: BigDecimalValue = PROPS_ZERO): BigDecimal {
  return BigDecimal.create(value);
}

function valueToBigDecimal(value: BigDecimalValue): BigDecimal {
  return value instanceof BigDecimal ? value : BigDecimal.create(value);
}

function numberStrToFragments(numbersStr: string): number[] {
  const numbers = [];

  for (let i = numbersStr.length; i > 0; i -= SAFE_BASE_LOG) {
    const index = Math.max(0, i - SAFE_BASE_LOG);

    numbers.unshift(+numbersStr.slice(index, i));
  }

  return numbers;
}

function numberToProps(signed: Signed, number: string): BigDecimalProps {
  if (!number) {
    return PROPS_ZERO;
  }

  const [integers, _decimals] = number.split('.');

  const decimals = numberStrToFragments(_decimals || '');

  if (decimals.length) {
    const padZeroLength =
      _decimals.length > SAFE_BASE_LOG ? 0 : SAFE_BASE_LOG - _decimals.length;

    const decimal = String(decimals[0]);

    decimals[0] = +decimal.padEnd(decimal.length + padZeroLength, '0');
  }

  return {
    decimals,
    integers: numberStrToFragments(integers),
    signed
  };
}

function bigDecimalFromString(value: string): BigDecimalProps {
  let signed: Signed = SIGNED_POSITIVE;

  if (value.charCodeAt(0) === CHAR_NEGATIVE) {
    value = value.slice(1);
    signed = SIGNED_NEGATIVE;
  }

  if (!SAFE_REGEX.test(value)) {
    throw Error('[BigDecimalError] Invalid argument: ' + value);
  }

  return numberToProps(signed, value);
}

function bigDecimalFromNumber(value: number): BigDecimalProps {
  if (value * 0 !== 0) {
    throw Error('[BigDecimalError] Invalid argument: ' + value);
  }

  if (value === 0) {
    return PROPS_ZERO;
  }

  let signed: Signed = SIGNED_POSITIVE;

  if (value < 0) {
    value = Math.abs(value);
    signed = SIGNED_NEGATIVE;
  }

  return numberToProps(signed, String(value));
}

function bigDecimalPropsFromValue(
  value: BigDecimalValue | BigDecimal
): BigDecimalProps {
  if (value instanceof BigDecimal) {
    return {
      decimals: value.decimals,
      integers: value.integers,
      signed: value.signed
    };
  }

  if (typeof value === 'number') {
    return bigDecimalFromNumber(value);
  }

  if (typeof value === 'string') {
    return bigDecimalFromString(value);
  }

  return value;
}

function bigDecimalToString(number: BigDecimal): string {
  let integerStr = '';
  let decimalStr = '';

  for (let i = number.integers.length - 1; i >= 0; i--) {
    const integer = String(number.integers[i]);

    if (i !== 0) {
      integerStr = integer.padEnd(SAFE_BASE_LOG, '0') + integerStr;
    } else {
      integerStr = integer + integerStr;
    }
  }

  for (let i = 0; i < number.decimals.length; i++) {
    const decimal = String(number.decimals[i]);

    if (i === 0) {
      decimalStr += decimal.padStart(SAFE_BASE_LOG, '0');
    } else {
      decimalStr += decimal;
    }
  }

  const numberStr = decimalStr
    ? `${integerStr}.${decimalStr.replace(/0+$/, '')}`
    : integerStr;

  return number.isNegative() ? `-${numberStr}` : numberStr;
}

function compareTo(number1: BigDecimal, number2: BigDecimal): number {
  if (number1.isZero() && number2.isZero()) {
    return 0;
  }

  if (number1.signed !== number2.signed) {
    return number1.signed - number2.signed;
  }

  const integers1 = number1.integers;
  const integers2 = number2.integers;

  if (integers1.length !== integers2.length) {
    return integers1.length - integers2.length;
  }

  for (let i = 0; i < integers1.length; i++) {
    if (integers1[i] !== integers2[i]) {
      return (integers1[i] - integers2[i]) * number1.signed;
    }
  }

  const decimals1 = number1.decimals;
  const decimals2 = number2.decimals;

  for (let i = 0; i < decimals1.length; i++) {
    if (decimals1[i] !== decimals2[i]) {
      return (decimals1[i] - decimals2[i]) * number1.signed;
    }
  }

  return 0;
}
