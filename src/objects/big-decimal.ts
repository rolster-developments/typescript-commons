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

const MAX_VALUE_NUMBER = 99999;
const MIN_VALUE_NUMBER = 0;
const MAX_VALUE_BASE = 100000;

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
      decimals: [...this.decimals],
      integers: [...this.integers],
      signed: SIGNED_POSITIVE
    });
  }

  public negative(): BigDecimal {
    return new BigDecimal({
      decimals: [...this.decimals],
      integers: [...this.integers],
      signed: (this.signed * -1) as Signed
    });
  }

  public plus(value: BigDecimalValue): BigDecimal {
    const number = valueToBigDecimal(value);

    if (this.isZero() && number.isZero()) {
      return BigDecimal.zero();
    }

    if (this.isZero()) {
      return number.clone();
    }

    if (number.isZero()) {
      return this.clone();
    }

    if (this.signed === number.signed) {
      return operationPlus(this, number, this.signed);
    }

    if (this.abs().equals(number.abs())) {
      return BigDecimal.zero();
    }

    const thisAbs = this.abs();
    const numberAbs = number.abs();

    return thisAbs.greaterThan(numberAbs)
      ? operationMinus(thisAbs, numberAbs, this.signed)
      : operationMinus(numberAbs, thisAbs, number.signed);
  }

  public minus(value: BigDecimalValue): BigDecimal {
    const number = valueToBigDecimal(value);

    if ((this.isZero() && number.isZero()) || this.equals(number)) {
      return BigDecimal.zero();
    }

    if (this.isZero()) {
      return number.negative();
    }

    if (number.isZero()) {
      return this.clone();
    }

    const thisAbs = this.abs();
    const numberAbs = number.abs();

    if (this.isPositive() && number.isPositive()) {
      return thisAbs.greaterThan(numberAbs)
        ? operationMinus(thisAbs, numberAbs, SIGNED_POSITIVE)
        : operationMinus(numberAbs, thisAbs, SIGNED_NEGATIVE);
    }

    if (this.isPositive() && number.isNegative()) {
      return operationPlus(thisAbs, numberAbs, SIGNED_POSITIVE);
    }

    if (this.isNegative() && number.isPositive()) {
      return operationPlus(thisAbs, numberAbs, SIGNED_NEGATIVE);
    }

    return thisAbs.greaterThan(numberAbs)
      ? operationMinus(thisAbs, numberAbs, SIGNED_NEGATIVE)
      : operationMinus(numberAbs, thisAbs, SIGNED_POSITIVE);
  }

  public multiply(value: BigDecimalValue): BigDecimal {
    return operationMultiply(this, valueToBigDecimal(value));
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
      decimals: [...this.decimals],
      integers: [...this.integers],
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
      integerStr = integer.padStart(SAFE_BASE_LOG, '0') + integerStr;
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

function normalizeIntegers(numbers: number[]): number[] {
  const _numbers: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    if (number !== 0) {
      _numbers.push(number);
    } else {
      const beforeIsDefined = i > 0 ? numbers[i - 1] > 0 : false;

      beforeIsDefined && _numbers.push(number);
    }
  }

  return _numbers;
}

function operationPlus(
  number1: BigDecimal,
  number2: BigDecimal,
  signed: Signed
): BigDecimal {
  const integers1 = number1.integers.reverse();
  const integers2 = number2.integers.reverse();

  const decimals1 = number1.decimals.reverse();
  const decimals2 = number2.decimals.reverse();

  const integersLength =
    integers1.length > integers2.length ? integers1.length : integers2.length;

  const decimalsLength =
    decimals1.length > decimals2.length ? decimals1.length : decimals2.length;

  const integers: number[] = [];
  const decimals: number[] = [];
  let carry = 0;

  for (let i = 0; i < decimalsLength; i++) {
    const total = (decimals1[i] ?? 0) + (decimals2[i] ?? 0) + carry;

    if (total > MAX_VALUE_NUMBER) {
      carry = 1;
      decimals.unshift(+String(total).slice(1));
    } else {
      carry = 0;
      decimals.unshift(total);
    }
  }

  for (let i = 0; i < integersLength; i++) {
    const total = (integers1[i] ?? 0) + (integers2[i] ?? 0) + carry;

    if (total > MAX_VALUE_NUMBER) {
      carry = 1;
      integers.unshift(+String(total).slice(1));
    } else {
      carry = 0;
      integers.unshift(total);
    }
  }

  carry > 0 && integers.unshift(carry);

  return BigDecimal.create({ decimals, integers, signed });
}

function operationMinus(
  number1: BigDecimal,
  number2: BigDecimal,
  signed: Signed
): BigDecimal {
  const integers1 = number1.integers.reverse();
  const integers2 = number2.integers.reverse();

  const decimals1 = number1.decimals.reverse();
  const decimals2 = number2.decimals.reverse();

  const integersLength =
    integers1.length > integers2.length ? integers1.length : integers2.length;

  const decimalsLength =
    decimals1.length > decimals2.length ? decimals1.length : decimals2.length;

  const integers: number[] = [];
  const decimals: number[] = [];
  let carry = 0;

  for (let i = 0; i < decimalsLength; i++) {
    const total = (decimals1[i] ?? 0) - (decimals2[i] ?? 0) - carry;

    if (total < MIN_VALUE_NUMBER) {
      carry = 1;
      decimals.unshift(MAX_VALUE_BASE - Math.abs(total));
    } else {
      carry = 0;
      decimals.unshift(total);
    }
  }

  for (let i = 0; i < integersLength; i++) {
    const total = (integers1[i] ?? 0) - (integers2[i] ?? 0) - carry;

    if (total < MIN_VALUE_NUMBER) {
      carry = 1;
      integers.unshift(MAX_VALUE_BASE - Math.abs(total));
    } else {
      carry = 0;
      integers.unshift(total);
    }
  }

  return BigDecimal.create({
    decimals,
    integers: normalizeIntegers(integers),
    signed
  });
}

function operationMultiply(bd1: BigDecimal, bd2: BigDecimal): BigDecimal {
  if (bd1.isZero() || bd2.isZero()) return BigDecimal.zero();

  const signed = (bd1.signed * bd2.signed) as Signed;

  // 1. TRATAR COMO ARRAY CONTINUO (como en Double)
  const totalDigits1 = bd1.integers.length + bd1.decimals.length;
  const totalDigits2 = bd2.integers.length + bd2.decimals.length;

  // Crear arrays completos (rellenar con ceros si es necesario)
  const numbers1 = [...bd1.integers, ...bd1.decimals];
  const numbers2 = [...bd2.integers, ...bd2.decimals];

  // 2. CALCULAR POSICIÓN DEL PUNTO DECIMAL
  const decimalPlaces1 = bd1.decimals.length;
  const decimalPlaces2 = bd2.decimals.length;
  const totalDecimalPlaces = decimalPlaces1 + decimalPlaces2;

  // 3. MULTIPLICACIÓN NORMAL (igual que en Double)
  let numbersTemp: number[] = Array(totalDigits1 + totalDigits2).fill(0);

  for (let i = totalDigits2 - 1; i >= 0; i--) {
    let carry = 0;
    for (let j = totalDigits1 - 1; j >= 0; j--) {
      const idx = i + j + 1;
      const product = numbers2[i] * numbers1[j] + carry + numbersTemp[idx];
      numbersTemp[idx] = product % MAX_VALUE_BASE;
      carry = Math.floor(product / MAX_VALUE_BASE);
    }
    numbersTemp[i] += carry;
  }

  // 4. SEPARAR ENTEROS/DECIMALES BASADO EN PUNTO DECIMAL
  const totalLength = numbersTemp.length;
  const integerDigits = totalLength - totalDecimalPlaces;

  const integers =
    integerDigits > 0 ? numbersTemp.slice(0, integerDigits) : [0];
  const decimals = numbersTemp.slice(integerDigits);

  return BigDecimal.create({ integers, decimals, signed });
}
