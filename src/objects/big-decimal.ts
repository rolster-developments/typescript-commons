type Signed = -1 | 0 | 1;

interface BigDecimalProps {
  decimals: readonly number[];
  integers: readonly number[];
  signed: Signed;
}

type BigDecimalValue = string | number | BigDecimalProps;

type RoundMode = 'round' | 'ceil' | 'floor' | 'half-to-even';

interface RoundStrategy {
  precision: number;
  roundMode: RoundMode;
}

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

let _roundStrategy: RoundStrategy = {
  precision: 2,
  roundMode: 'half-to-even'
};

export class BigDecimal {
  public readonly signed: Signed;

  public readonly integers: readonly number[];

  public readonly decimals: readonly number[];

  protected constructor(value: BigDecimalValue | BigDecimal) {
    const props = bigDecimalPropsFromValue(value);

    this.integers = props.integers.length ? props.integers : [0];
    this.signed = props.signed;
    this.decimals = props.decimals;
  }

  public get data(): number {
    return +this;
  }

  public get rounded(): number {
    const { roundMode: mode, precision } = _roundStrategy;

    return roundPrecision(this, precision, mode).data;
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

    const _this = this.abs();
    const _number = number.abs();

    return _this.greaterThan(_number)
      ? operationMinus(_this, _number, this.signed)
      : operationMinus(_number, _this, number.signed);
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

    const _this = this.abs();
    const _number = number.abs();

    if (this.isPositive() && number.isPositive()) {
      return _this.greaterThan(_number)
        ? operationMinus(_this, _number, SIGNED_POSITIVE)
        : operationMinus(_number, _this, SIGNED_NEGATIVE);
    }

    if (this.isPositive() && number.isNegative()) {
      return operationPlus(_this, _number, SIGNED_POSITIVE);
    }

    if (this.isNegative() && number.isPositive()) {
      return operationPlus(_this, _number, SIGNED_NEGATIVE);
    }

    return _this.greaterThan(_number)
      ? operationMinus(_this, _number, SIGNED_NEGATIVE)
      : operationMinus(_number, _this, SIGNED_POSITIVE);
  }

  public multiply(value: BigDecimalValue): BigDecimal {
    return operationMultiply(this, valueToBigDecimal(value));
  }

  public divide(value: BigDecimalValue, precision = 15): BigDecimal {
    return operationDivide(this, valueToBigDecimal(value), precision);
  }

  public percentage(rate: number): BigDecimal {
    return this.multiply(rate).divide(100);
  }

  public round(precision = 0): BigDecimal {
    return this.isZero()
      ? this.clone()
      : roundPrecision(this, precision, 'round');
  }

  public ceil(precision = 0): BigDecimal {
    return this.isZero()
      ? this.clone()
      : roundPrecision(this, precision, 'ceil');
  }

  public floor(precision = 0): BigDecimal {
    return this.isZero()
      ? this.clone()
      : roundPrecision(this, precision, 'floor');
  }

  public halfToEven(precision = 0): BigDecimal {
    return this.isZero()
      ? this.clone()
      : roundPrecision(this, precision, 'half-to-even');
  }

  public roundWith(strategy: RoundStrategy): number {
    return roundPrecision(this, strategy.precision, strategy.roundMode).data;
  }

  public isNegative(): boolean {
    return this.signed === SIGNED_NEGATIVE;
  }

  public isPositive(): boolean {
    return this.signed === SIGNED_POSITIVE;
  }

  public isZero(): boolean {
    return (
      this.signed === SIGNED_NEUTRO &&
      integersIsZero(this.integers) &&
      !this.decimals.length
    );
  }

  public equals(value: BigDecimalValue): boolean {
    const bigDecimal = valueToBigDecimal(value);

    if (this.signed !== bigDecimal.signed) {
      return false;
    }

    const decimals1 = removeZerosInDecimals([...this.decimals]);
    const decimals2 = removeZerosInDecimals([...bigDecimal.decimals]);

    if (
      this.integers.length !== bigDecimal.integers.length ||
      decimals1.length !== decimals2.length
    ) {
      return false;
    }

    const numbers1 = [...this.integers, ...decimals1];
    const numbers2 = [...bigDecimal.integers, ...decimals2];

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

export function roundStrategy(strategy: RoundStrategy): void {
  _roundStrategy = strategy;
}

function integersIsZero(numbers: readonly number[]): boolean {
  return numbers.length === 1 && numbers[0] === 0;
}

function valueToBigDecimal(value: BigDecimalValue): BigDecimal {
  return value instanceof BigDecimal ? value : BigDecimal.create(value);
}

function removeZerosInIntegers(integers: readonly number[]): number[] {
  if (integersIsZero(integers)) {
    return [...integers];
  }

  const firstNonZero = integers.findIndex((integer) => integer !== 0);

  return firstNonZero === -1 ? [] : integers.slice(firstNonZero);
}

function integersToChunks(integers: string | number): number[] {
  integers = String(integers);

  const _integers = [];

  for (let i = integers.length; i > 0; i -= SAFE_BASE_LOG) {
    const index = Math.max(0, i - SAFE_BASE_LOG);

    _integers.unshift(+integers.slice(index, i));
  }

  return _integers;
}

function removeZerosInDecimals(decimals: readonly number[]): number[] {
  let end = decimals.length;

  while (end > 0 && decimals[end - 1] === 0) {
    end--;
  }

  return decimals.slice(0, end);
}

function removeLeadingZeros(numberStr: string): string {
  return numberStr.replace(/^0+/, '');
}

function removeTrailingZeros(numberStr: string): string {
  return numberStr.replace(/0+$/, '');
}

function formatDecimal(decimal: string): string {
  const padZeroLength =
    decimal.length >= SAFE_BASE_LOG ? 0 : SAFE_BASE_LOG - decimal.length;

  return decimal.padEnd(decimal.length + padZeroLength, '0');
}

function decimalsToChunks(decimals: string | number): number[] {
  decimals = String(decimals);

  if (!decimals.length) {
    return [];
  }

  if (decimals.length <= SAFE_BASE_LOG) {
    return removeZerosInDecimals([+formatDecimal(decimals)]);
  }

  const _decimals = [];

  for (let i = 0; i < decimals.length; i += SAFE_BASE_LOG) {
    const decimal = decimals.slice(i, i + SAFE_BASE_LOG);

    _decimals.push(+formatDecimal(decimal));
  }

  removeZerosInDecimals(_decimals);

  return _decimals;
}

function integersToString(integers: readonly number[]): string {
  return integers.reduce((total, integer, index) => {
    return (total +=
      index !== 0
        ? String(integer).padStart(SAFE_BASE_LOG, '0')
        : String(integer));
  }, '');
}

function decimalsToString(decimals: readonly number[]): string {
  return decimals.reduce((total, decimal) => {
    return (total += String(decimal).padStart(SAFE_BASE_LOG, '0'));
  }, '');
}

function numberToChunks(number: string): string[] {
  if (/e-/.test(number)) {
    const [int, dec] = number.split('e-');

    const count = +dec + int.length - 1;

    return ['0', int.replace('.', '').padStart(count, '0')];
  }

  return number.split('.');
}

function numberToProps(signed: Signed, number: string): BigDecimalProps {
  if (!number) {
    return PROPS_ZERO;
  }

  const [integers, _decimals] = numberToChunks(number);

  const decimals = decimalsToChunks(_decimals || '');

  return {
    decimals,
    integers: integersToChunks(integers),
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

  const decimals = removeZerosInDecimals(value.decimals);
  const integers = removeZerosInIntegers(value.integers);

  return {
    decimals,
    integers,
    signed:
      !decimals.length && integersIsZero(integers)
        ? SIGNED_NEUTRO
        : value.signed
  };
}

function bigDecimalToString(number: BigDecimal): string {
  const integerStr = integersToString(number.integers);
  const decimalStr = decimalsToString(number.decimals).replace(/0+$/, '');
  const numberStr = decimalStr ? `${integerStr}.${decimalStr}` : integerStr;

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

function normalizeIntegers(numbers: readonly number[]): number[] {
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

function plusNumbers(
  number1: readonly number[],
  number2: readonly number[],
  carry = 0
) {
  number1 = [...number1].reverse();
  number2 = [...number2].reverse();

  const length =
    number1.length > number2.length ? number1.length : number2.length;

  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    const total = (number1[i] ?? 0) + (number2[i] ?? 0) + carry;

    if (total > MAX_VALUE_NUMBER) {
      carry = 1;
      numbers.unshift(+String(total).slice(1));
    } else {
      carry = 0;
      numbers.unshift(total);
    }
  }

  return { carry, numbers };
}

function plusNumbersOnCarry(
  number1: readonly number[],
  number2: readonly number[],
  carry = 0
) {
  const result = plusNumbers(number1, number2, carry);

  result.carry > 0 && result.numbers.unshift(result.carry);

  return result.numbers;
}

function minusNumbers(
  numbers1: readonly number[],
  numbers2: readonly number[],
  carry = 0
) {
  numbers1 = [...numbers1].reverse();
  numbers2 = [...numbers2].reverse();

  const length =
    numbers1.length > numbers2.length ? numbers1.length : numbers2.length;

  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    const total = (numbers1[i] ?? 0) - (numbers2[i] ?? 0) - carry;

    if (total < MIN_VALUE_NUMBER) {
      carry = 1;
      numbers.unshift(MAX_VALUE_BASE - Math.abs(total));
    } else {
      carry = 0;
      numbers.unshift(total);
    }
  }

  return { carry, numbers };
}

type Decimals = [number[], number[]];

function fillArrayDecimals(
  decimals1: readonly number[],
  decimals2: readonly number[]
): Decimals {
  const maxLength = Math.max(decimals1.length, decimals2.length);

  const _decimals1 = [
    ...decimals1,
    ...Array(maxLength - decimals1.length).fill(0)
  ];
  const _decimals2 = [
    ...decimals2,
    ...Array(maxLength - decimals2.length).fill(0)
  ];

  return [_decimals1, _decimals2];
}

function operationPlus(
  number1: BigDecimal,
  number2: BigDecimal,
  signed: Signed
): BigDecimal {
  const [decimals1, decimals2] = fillArrayDecimals(
    number1.decimals,
    number2.decimals
  );

  const { carry, numbers } = plusNumbers(decimals1, decimals2);

  const integers = plusNumbersOnCarry(
    [...number1.integers],
    [...number2.integers],
    carry
  );

  return BigDecimal.create({ decimals: numbers, integers, signed });
}

function operationMinus(
  number1: BigDecimal,
  number2: BigDecimal,
  signed: Signed
): BigDecimal {
  const [decimals1, decimals2] = fillArrayDecimals(
    number1.decimals,
    number2.decimals
  );

  const decimals = minusNumbers(decimals1, decimals2);

  const integers = minusNumbers(
    [...number1.integers],
    [...number2.integers],
    decimals.carry
  );

  return BigDecimal.create({
    decimals: decimals.numbers,
    integers: normalizeIntegers(integers.numbers),
    signed
  });
}

function operationMultiply(
  number1: BigDecimal,
  number2: BigDecimal
): BigDecimal {
  if (number1.isZero() || number2.isZero()) {
    return BigDecimal.zero();
  }

  const signed = (number1.signed * number2.signed) as Signed;

  const length1 = number1.integers.length + number1.decimals.length;
  const length2 = number2.integers.length + number2.decimals.length;

  const numbers1 = [...number1.integers, ...number1.decimals];
  const numbers2 = [...number2.integers, ...number2.decimals];

  let _numbers: number[] = Array(length1 + length2).fill(0);

  for (let i = length2 - 1; i >= 0; i--) {
    let carry = 0;

    for (let j = length1 - 1; j >= 0; j--) {
      const position = i + j + 1;

      const result = numbers2[i] * numbers1[j] + carry + _numbers[position];

      _numbers[position] = result % MAX_VALUE_BASE;

      carry = Math.floor(result / MAX_VALUE_BASE);
    }

    _numbers[i] += carry;
  }

  const places1 = decimalsToString(number1.decimals).length;
  const places2 = decimalsToString(number2.decimals).length;
  const placesTotal = Math.ceil((places1 + places2) / SAFE_BASE_LOG);

  const integerIndex = _numbers.length - placesTotal;

  const integers = removeZerosInIntegers(
    integerIndex > 0 ? _numbers.slice(0, integerIndex) : [0]
  );

  const decimals = removeZerosInDecimals(_numbers.slice(integerIndex));

  return BigDecimal.create({ decimals, integers, signed });
}

function operationDivide(
  number1: BigDecimal,
  number2: BigDecimal,
  precision: number
): BigDecimal {
  if (number2.isZero()) {
    throw new Error('[BigDecimalError] Division by zero');
  }

  if (number1.isZero()) {
    return BigDecimal.zero();
  }

  const signed = (number1.signed * number2.signed) as Signed;

  if (number1.equals(number2)) {
    return BigDecimal.create(1);
  }

  if (number2.equals(1) || number2.equals(-1)) {
    return BigDecimal.create({
      decimals: [...number1.decimals],
      integers: [...number1.integers],
      signed
    });
  }

  const decimalsStr1 = removeTrailingZeros(
    decimalsToString([...number1.decimals])
  );

  const decimalsStr2 = removeTrailingZeros(
    decimalsToString([...number2.decimals])
  );

  const integersStr1 = integersToString([...number1.integers]);
  const integersStr2 = integersToString([...number2.integers]);

  const numerator = integersStr1 + decimalsStr1;
  const denominator = integersStr2 + decimalsStr2;

  const length1 = decimalsStr1.length;
  const length2 = decimalsStr2.length;

  const _precision = numerator.length + precision + length2;
  const _numerator = numerator.padEnd(_precision, '0');
  const _denominador = BigInt(denominator);

  let result = '';
  let remainder = 0n;

  for (let i = 0; i < _numerator.length; i++) {
    const digit = BigInt(+_numerator[i]);

    const value = remainder * 10n + digit;

    if (value < _denominador) {
      result += '0';
      remainder = value;
    } else {
      const quotient = value / _denominador;

      result += quotient.toString();
      remainder = value % _denominador;
    }
  }

  result = result.slice(length2);
  const point = result.length - (length1 + precision);

  let integers = point <= 0 ? '0' : result.slice(0, point);
  let decimals = point <= 0 ? '0'.repeat(-point) + result : result.slice(point);

  integers = removeLeadingZeros(integers) || '0';
  decimals = removeTrailingZeros(decimals);

  return BigDecimal.create({
    decimals: decimalsToChunks(decimals),
    integers: integersToChunks(integers),
    signed
  });
}

function precisionUpper(
  roundMode: RoundMode,
  integer: number,
  decimal: number,
  comparator: number
): boolean {
  switch (roundMode) {
    case 'round':
      return decimal >= comparator;
    case 'half-to-even':
      return decimal < comparator
        ? false
        : decimal > comparator || integer % 2 !== 0;
    case 'ceil':
      return true;
    default:
      return false;
  }
}

function roundPrecisionZero(
  number: BigDecimal,
  roundMode: RoundMode
): BigDecimal {
  if (number.decimals.length === 0) {
    return number.clone();
  }

  const decimal = +String(number.decimals[0])
    .padStart(SAFE_BASE_LOG, '0')
    .charAt(0);

  const precisionIsUpper = precisionUpper(
    roundMode,
    number.integers[0],
    decimal,
    5
  );

  if (!precisionIsUpper) {
    return BigDecimal.create({
      decimals: [],
      integers: [...number.integers],
      signed: number.signed
    });
  }

  const result = plusNumbers(number.integers, [1]);

  result.carry > 0 && result.numbers.unshift(result.carry);

  return BigDecimal.create({
    decimals: [],
    integers: result.numbers,
    signed: number.signed
  });
}

function roundPrecisionPositive(
  number: BigDecimal,
  precision: number,
  roundMode: RoundMode
): BigDecimal {
  const decimalsStr = decimalsToString(number.decimals);

  if (decimalsStr.replace(/0+$/, '').length <= precision) {
    return number.clone();
  }

  const decimals = decimalsToChunks(decimalsStr.slice(0, precision));

  const decimalLimit = +decimalsStr[precision - 1];
  const decimalUpper = +decimalsStr[precision];

  const precisionIsUpper = precisionUpper(
    roundMode,
    decimalLimit,
    decimalUpper,
    5
  );

  if (!precisionIsUpper) {
    return BigDecimal.create({
      decimals,
      integers: [...number.integers],
      signed: number.signed
    });
  }

  const decimalsCarry = decimalsToChunks('1'.padStart(precision, '0'));
  const resultPlus = plusNumbers(decimals, decimalsCarry);

  const integers =
    resultPlus.carry > 0
      ? plusNumbersOnCarry(number.integers, [1])
      : [...number.integers];

  return BigDecimal.create({
    decimals: resultPlus.numbers,
    integers,
    signed: number.signed
  });
}

function roundPrecisionNegative(
  number: BigDecimal,
  precision: number,
  roundMode: RoundMode
): BigDecimal {
  const integersStr = number.integers.reduce((total, integers) => {
    return (total += String(integers));
  }, '');

  if (integersStr.length <= precision) {
    return BigDecimal.zero();
  }

  const upper = integersStr.length - precision;
  const limit = upper - 1;

  let integers = integersToChunks(
    integersStr.slice(0, upper).padEnd(integersStr.length, '0')
  );

  const integerLimit = +integersStr[limit];
  const integerUpper = +integersStr[upper];

  const precisionIsUpper = precisionUpper(
    roundMode,
    integerLimit,
    integerUpper,
    5
  );

  if (precisionIsUpper) {
    const carry = integersToChunks('1'.padEnd(precision + 1, '0'));
    integers = plusNumbersOnCarry(integers, carry);
  }

  return BigDecimal.create({
    decimals: [],
    integers,
    signed: number.signed
  });
}

function roundPrecision(
  number: BigDecimal,
  precision: number,
  roundMode: RoundMode
): BigDecimal {
  const _precision = Math.trunc(precision);

  if (_precision === 0) {
    return roundPrecisionZero(number, roundMode);
  }

  if (_precision > 0) {
    return roundPrecisionPositive(number, _precision, roundMode);
  }

  return roundPrecisionNegative(number, Math.abs(_precision), roundMode);
}
