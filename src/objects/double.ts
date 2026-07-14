interface DoubleProps {
  base: number;
  numbers: number[];
  signed: number;
}

type DoubleValue = string | number | Double | DoubleProps;

interface DividerValue {
  denominator: Double;
  numerator: Double;
  places?: boolean;
  precision?: number;
}

const SAFE_INTEGER_MAX = 9007199254740991;
const DOUBLE_REGEX = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

const BASE = 1e5;
const BASE_LOG = 5;
const BASE_NEGATIVE = -5;
const BASE_POSITIVE = 15;
const BASE_MAX = Math.floor(SAFE_INTEGER_MAX / BASE_LOG);

const DIGITS_MAX = 1e9;
const NEGATIVE_CHAR = 45;
const PRECISION = 20;
const ROUNDING = 4;
const FIXED_DEFAULT = 2;

const SIGNED_POSITIVE = 1;
const SIGNED_NEUTRO = 0;
const SIGNED_NEGATIVE = -1;

const ZERO_CHAR = 48;
const ZERO_PROPS: DoubleProps = {
  numbers: [0],
  base: 0,
  signed: 0
};

export class Double {
  public readonly signed;

  public readonly base;

  public readonly numbers;

  protected constructor(value: DoubleValue) {
    const props = createDoublePropsFromValue(value);

    this.signed = props.signed;
    this.base = props.base;
    this.numbers = props.numbers;
  }

  public get data(): number {
    return +this;
  }

  public get rounded(): number {
    return +this.format();
  }

  public plus(value: DoubleValue): Double {
    const double = createDouble(value);

    if (this.isZero() && double.isZero()) {
      return Double.zero();
    }

    if (this.isZero()) {
      return double.clone();
    }

    if (double.isZero()) {
      return this.clone();
    }

    if (this.signed === double.signed) {
      return doublePlus(this, double);
    }

    if (this.abs().equals(double.abs())) {
      return Double.zero();
    }

    const absThis = this.abs();
    const absDouble = double.abs();

    return absThis.greaterThan(absDouble)
      ? doubleMinus(absThis, absDouble, this.signed)
      : doubleMinus(absDouble, absThis, double.signed);
  }

  public minus(value: DoubleValue): Double {
    const double = createDouble(value);

    if ((this.isZero() && double.isZero()) || this.equals(double)) {
      return Double.zero();
    }

    if (this.isZero()) {
      return double.negative();
    }

    if (double.isZero()) {
      return this.clone();
    }

    const absThis = this.abs();
    const absDouble = double.abs();

    if (this.isPositive() && double.isPositive()) {
      return absThis.greaterThan(absDouble)
        ? doubleMinus(absThis, absDouble, SIGNED_POSITIVE)
        : doubleMinus(absDouble, absThis, SIGNED_NEGATIVE);
    }

    if (this.isPositive() && double.isNegative()) {
      return doublePlus(absThis, absDouble);
    }

    if (this.isNegative() && double.isPositive()) {
      return doublePlus(absThis, absDouble).negative();
    }

    return absThis.greaterThan(absDouble)
      ? doubleMinus(absThis, absDouble, SIGNED_NEGATIVE)
      : doubleMinus(absDouble, absThis, SIGNED_POSITIVE);
  }

  public multiply(value: DoubleValue): Double {
    return operationMultiply(this, createDouble(value));
  }

  public divide(value: DoubleValue): Double {
    return operationDivide({
      numerator: this,
      denominator: createDouble(value),
      places: true,
      precision: 2
    });
  }

  public module(value: DoubleValue): Double {
    const denominator = createDouble(value);

    if (!denominator.signed) {
      throw Error('[DecimalError] Exponent out of range: NaN');
    }

    if (!this.signed) {
      return round(this, PRECISION);
    }

    const result = operationDivide({
      numerator: this,
      denominator,
      places: true,
      precision: 0
    }).multiply(denominator);

    return this.minus(result);
  }

  public percentage(rate: number): Double {
    return this.multiply(rate / 100);
  }

  public equals(value: DoubleValue): boolean {
    const double = createDouble(value);

    if (this.signed !== double.signed || this.base !== double.base) {
      return false;
    }

    if (this.numbers.length !== double.numbers.length) {
      return false;
    }

    for (let i = 0; i < this.numbers.length; ++i) {
      if (this.numbers[i] !== double.numbers[i]) {
        return false;
      }
    }

    return true;
  }

  public greaterThan(value: DoubleValue): boolean {
    return compareTo(this, createDouble(value)) > 0;
  }

  public greaterThanOrEqualTo(value: DoubleValue): boolean {
    return compareTo(this, createDouble(value)) >= 0;
  }

  public lessThan(value: DoubleValue): boolean {
    return compareTo(this, createDouble(value)) < 0;
  }

  public lessThanOrEqualTo(value: DoubleValue): boolean {
    return compareTo(this, createDouble(value)) <= 0;
  }

  public abs(): Double {
    return new Double({
      numbers: this.numbers,
      base: this.base,
      signed: SIGNED_POSITIVE
    });
  }

  public negative(): Double {
    return new Double({
      numbers: this.numbers,
      base: this.base,
      signed: this.signed * -1
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

  public format(fixed = FIXED_DEFAULT, rounding = ROUNDING): string {
    checkInt32(fixed, 0, DIGITS_MAX);
    checkInt32(rounding, 0, 8);

    const double = round(this, fixed + base10Exp(this) + 1, rounding);

    const sd = fixed + base10Exp(double) + 1;

    return doubleToString(double.abs(), false, sd);
  }

  public round(precision = 0): Double {
    let size = 0; // Enabled number

    for (let i = 0; i <= this.base; i++) {
      size += String(this.numbers[i]).length;
    }

    if (this.base + 1 < this.numbers.length && precision > 0) {
      size += precision;
    }

    return round(this, size, 4);
  }

  public roundCeil(precision = 0): Double {
    const position = this.base + 1;

    if (this.numbers.length === position) {
      return new Double({
        numbers: this.numbers,
        base: this.base,
        signed: this.signed
      });
    }

    if (precision <= 0) {
      const numbers = this.numbers.slice(0, position);

      numbers[this.base] = this.numbers[this.base] + 1;

      return new Double({
        numbers,
        base: this.base,
        signed: this.signed
      });
    }

    const base = Math.floor(precision / BASE_LOG);
    const size = precision % BASE_LOG;

    const decimals = this.base + base;

    const numbers = this.numbers.slice(0, decimals + 1);

    if (size > 0) {
      const _number = this.numbers[decimals + 1];

      if (_number) {
        const ceil = +String(_number).slice(0, size) + 1;
        numbers.push(+String(ceil).padEnd(BASE_LOG, '0'));
      }
    } else {
      numbers[decimals] = this.numbers[decimals] + 1;
    }

    return new Double({
      numbers,
      base: this.base,
      signed: this.signed
    });
  }

  public roundFloor(precision = 0): Double {
    if (precision === 0) {
      return this.base < 0
        ? Double.zero()
        : new Double({
            numbers: this.numbers.slice(0, this.base + 1),
            base: this.base,
            signed: this.signed
          });
    }

    const base = Math.floor(precision / BASE_LOG);
    const size = precision % BASE_LOG;
    const position = this.base + base + 1;

    const numbers = this.numbers.slice(0, position);

    if (size > 0) {
      const _number = this.numbers[position];

      if (_number) {
        const floor = String(_number).padStart(BASE_LOG, '0').slice(0, size);
        numbers.push(+floor.padEnd(BASE_LOG, '0'));
      }
    }

    return new Double({
      numbers,
      base: this.base,
      signed: this.signed
    });
  }

  public clone(): Double {
    return new Double(this.props());
  }

  public props(): DoubleProps {
    return {
      numbers: [...this.numbers],
      base: this.base,
      signed: this.signed
    };
  }

  public toString(): string {
    return doubleToString(this, isExponent(base10Exp(this)));
  }

  public static create(value: DoubleValue): Double {
    return new Double(value);
  }

  public static zero(): Double {
    return new Double(ZERO_PROPS);
  }
}

export function double(value: DoubleValue): Double {
  return Double.create(value);
}

function createDouble(value: DoubleValue): Double {
  return value instanceof Double ? value : Double.create(value);
}

function parseDouble(signed: number, doubleStr: string): DoubleProps {
  let numberStr = doubleStr.indexOf('.');
  let i = doubleStr.search(/e/i);
  let length = doubleStr.length;

  if (numberStr > -1) {
    doubleStr = doubleStr.replace('.', '');
  }

  if (i > 0) {
    if (numberStr < 0) {
      numberStr = i;
    }

    numberStr += +doubleStr.slice(i + 1);
    doubleStr = doubleStr.substring(0, i);
  } else if (numberStr < 0) {
    numberStr = doubleStr.length;
  }

  for (i = 0; doubleStr.charCodeAt(i) === ZERO_CHAR; ) {
    ++i;
  }

  for (
    length = doubleStr.length;
    doubleStr.charCodeAt(length - 1) === ZERO_CHAR;

  ) {
    --length;
  }

  doubleStr = doubleStr.slice(i, length);

  if (doubleStr) {
    numberStr = numberStr - i - 1;
    length -= i;

    const base = Math.floor(numberStr / BASE_LOG);
    const numbers = [];

    i = (numberStr + 1) % BASE_LOG;

    if (numberStr < 0) {
      i += BASE_LOG;
    }

    if (i < length) {
      if (i) {
        numbers.push(+doubleStr.slice(0, i));
      }

      for (length -= BASE_LOG; i < length; ) {
        numbers.push(+doubleStr.slice(i, (i += BASE_LOG)));
      }

      doubleStr = doubleStr.slice(i);
      i = BASE_LOG - doubleStr.length;
    } else {
      i -= length;
    }

    for (; i--; ) {
      doubleStr += '0';
    }

    numbers.push(+doubleStr);

    if (base > BASE_MAX || base < -BASE_MAX) {
      throw Error('[DecimalError] Exponent out of range: ' + numberStr);
    }

    return { numbers, base, signed };
  } else {
    return ZERO_PROPS;
  }
}

function createDoubleFromNumber(value: number): DoubleProps {
  if (value * 0 !== 0) {
    throw Error('[DecimalError] Invalid argument: ' + value);
  }

  if (value === 0) {
    return ZERO_PROPS;
  }

  let signed = SIGNED_POSITIVE;

  if (value < 0) {
    value = -value;
    signed = SIGNED_NEGATIVE;
  }

  return parseDouble(signed, String(value));
}

function createDoubleFromString(value: string): DoubleProps {
  let signed = SIGNED_POSITIVE;

  if (value.charCodeAt(0) === NEGATIVE_CHAR) {
    value = value.slice(1);
    signed = SIGNED_NEGATIVE;
  }

  if (!DOUBLE_REGEX.test(value)) {
    throw Error('[DecimalError] Invalid argument: ' + value);
  }

  return parseDouble(signed, value);
}

function createDoublePropsFromValue(value: DoubleValue): DoubleProps {
  if (value instanceof Double) {
    return value.props();
  }

  if (typeof value === 'number') {
    return createDoubleFromNumber(value);
  }

  if (typeof value === 'string') {
    return createDoubleFromString(value);
  }

  return value;
}

function normalizeZero(double: Double): number[] {
  return (double.base === -1 ? [0] : []).concat(double.numbers);
}

function normalizeInteger(double: Double): number[] {
  const numbers = [...double.numbers];
  const length = double.base + 1;

  if (length > double.numbers.length) {
    for (let i = double.numbers.length; i < length; i++) {
      numbers.push(0);
    }
  }

  return numbers;
}

function removeZerosInNumbers(numbers: number[]): number[] {
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

function normalizeNumbers(numbers: number[], base: number) {
  const integers = numbers.slice(0, base);
  const decimals = numbers.slice(base).reverse();

  const _numbers = removeZerosInNumbers(integers);
  const _base = integers.length - _numbers.length;

  return {
    base: base - _base,
    numbers: [..._numbers, ...removeZerosInNumbers(decimals).reverse()]
  };
}

function doublePlus(double1: Double, double2: Double): Double {
  const base1 = double1.base;
  const base2 = double2.base;

  const numbers1 = double1.numbers;
  const numbers2 = double2.numbers;

  const integers1 = numbers1.slice(0, base1 + 1).reverse();
  const integers2 = numbers2.slice(0, base2 + 1).reverse();

  const decimals1 = numbers1.slice(base1 + 1).reverse();
  const decimals2 = numbers2.slice(base2 + 1).reverse();

  const integersLength =
    integers1.length > integers2.length ? integers1.length : integers2.length;

  const decimalsLength =
    decimals1.length > decimals2.length ? decimals1.length : decimals2.length;

  let base = double1.base > double2.base ? double1.base : double2.base;

  const numbers: number[] = [];
  let carry = 0;

  for (let i = 0; i < decimalsLength; i++) {
    const total = (decimals1[i] ?? 0) + (decimals2[i] ?? 0) + carry;

    if (total > 99999) {
      carry = 1;
      numbers.unshift(+String(total).slice(1));
    } else {
      carry = 0;
      numbers.unshift(total);
    }
  }

  for (let i = 0; i < integersLength; i++) {
    const total = (integers1[i] ?? 0) + (integers2[i] ?? 0) + carry;

    if (total > 99999) {
      carry = 1;
      numbers.unshift(+String(total).slice(1));
    } else {
      carry = 0;
      numbers.unshift(total);
    }
  }

  if (carry > 0) {
    numbers.unshift(carry);
    base++;
  }

  return Double.create({ base, numbers, signed: double1.signed });
}

function doubleMinus(double1: Double, double2: Double, signed: number): Double {
  const base1 = double1.base;
  const base2 = double2.base;

  const numbers1 = normalizeInteger(double1);
  const numbers2 = normalizeInteger(double2);

  const integers1 = numbers1.slice(0, base1 + 1).reverse();
  const integers2 = numbers2.slice(0, base2 + 1).reverse();

  const decimals1 = numbers1.slice(base1 + 1).reverse();
  const decimals2 = numbers2.slice(base2 + 1).reverse();

  const integersLength =
    integers1.length > integers2.length ? integers1.length : integers2.length;

  const decimalsLength =
    decimals1.length > decimals2.length ? decimals1.length : decimals2.length;

  const _base = double1.base > double2.base ? double1.base : double2.base;

  const _numbers: number[] = [];
  let carry = 0;

  for (let i = 0; i < decimalsLength; i++) {
    const total = (decimals1[i] ?? 0) - (decimals2[i] ?? 0) - carry;

    if (total < 0) {
      carry = 1;
      _numbers.unshift(100000 - Math.abs(total));
    } else {
      carry = 0;
      _numbers.unshift(total);
    }
  }

  for (let i = 0; i < integersLength; i++) {
    const total = (integers1[i] ?? 0) - (integers2[i] ?? 0) - carry;

    if (total < 0) {
      carry = 1;
      _numbers.unshift(100000 - Math.abs(total));
    } else {
      carry = 0;
      _numbers.unshift(total);
    }
  }

  const { numbers, base } = normalizeNumbers(_numbers, _base);

  return Double.create({ base, numbers, signed });
}

function operationMultiply(double1: Double, double2: Double): Double {
  if (double1.isZero() || double2.isZero()) {
    return Double.zero();
  }

  const signed = double1.signed * double2.signed;

  let index1, lengthTemp;
  let base = double1.base + double2.base;
  let numbers1 = [...double1.numbers];
  let numbers2 = [...double2.numbers];
  let numbersTemp = [];
  let length1 = numbers1.length;
  let length2 = numbers2.length;

  if (length1 < length2) {
    numbersTemp = numbers1;
    numbers1 = numbers2;
    numbers2 = numbersTemp;
    lengthTemp = length1;
    length1 = length2;
    length2 = lengthTemp;
  }

  numbersTemp = [];
  lengthTemp = length1 + length2;

  for (index1 = lengthTemp; index1--; ) {
    numbersTemp.push(0);
  }

  let carry, index2;

  for (index1 = length2; --index1 >= 0; ) {
    carry = 0;

    for (index2 = length1 + index1; index2 > index1; ) {
      const th: number =
        numbersTemp[index2] +
        numbers2[index1] * numbers1[index2 - index1 - 1] +
        carry;

      numbersTemp[index2--] = th % BASE | 0;

      carry = (th / BASE) | 0;
    }

    numbersTemp[index2] = (numbersTemp[index2] + carry) % BASE | 0;
  }

  for (; !numbersTemp[--lengthTemp]; ) numbersTemp.pop();

  if (carry) {
    ++base;
  } else {
    numbersTemp.shift();
  }

  return Double.create({ numbers: numbersTemp, base: base, signed });
}

function getFactorForDivider(denominator: Double): number {
  const deminals = denominator.numbers[denominator.base + 1] ?? 0;

  return Math.pow(10, String(deminals).replace(/0+$/, '').length);
}

function compare(
  numbers1: number[],
  numbers2: number[],
  length1: number,
  length2: number
): number {
  if (length1 != length2) {
    return length1 > length2 ? 1 : -1;
  }

  let result = 0;
  let i = 0;

  for (; i < length1; i++) {
    if (numbers1[i] != numbers2[i]) {
      result = numbers1[i] > numbers2[i] ? 1 : -1;
      break;
    }
  }

  return result;
}

function operationDivide(divider: DividerValue): Double {
  if (divider.denominator.isZero()) {
    throw Error('[DecimalError] Division by zero');
  }

  if (divider.numerator.isZero()) {
    return Double.zero();
  }

  const factor = getFactorForDivider(divider.denominator);

  const numerator =
    factor > 1 ? divider.numerator.multiply(factor) : divider.numerator;

  const denominator =
    factor > 1 ? divider.denominator.multiply(factor) : divider.denominator;

  const signed =
    numerator.signed == denominator.signed ? SIGNED_POSITIVE : SIGNED_NEGATIVE;

  let index1, index2, precTemp;
  let numbers1 = [...numerator.numbers];
  let numbers2 = [...denominator.numbers];
  const numbers: number[] = [];

  let length1 = numerator.numbers.length;
  let length2 = denominator.numbers.length;
  let base = numerator.base - denominator.base;

  for (index1 = 0; numbers2[index1] == (numbers1[index1] || 0); ) {
    ++index1;
  }

  if (numbers2[index1] > (numbers1[index1] || 0)) {
    --base;
  }

  if (!divider.precision) {
    precTemp = divider.precision = PRECISION;
  } else if (divider.places) {
    precTemp =
      divider.precision + (base10Exp(numerator) - base10Exp(denominator)) + 1;
  } else {
    precTemp = divider.precision;
  }

  if (precTemp < 0) {
    return Double.zero();
  }

  precTemp = (precTemp / BASE_LOG + 2) | 0;
  index1 = 0;

  if (length2 == 1) {
    const first2 = numbers2[0];
    index2 = 0;
    precTemp++;

    for (; (index1 < length1 || index2) && precTemp--; index1++) {
      const size: number = index2 * BASE + (numbers1[index1] || 0);

      numbers[index1] = (size / first2) | 0;
      index2 = size % first2 | 0;
    }
  } else {
    index2 = (BASE / (numbers2[0] + 1)) | 0;

    if (index2 > 1) {
      numbers2 = multiplyInteger(numbers2, index2);
      numbers1 = multiplyInteger(numbers1, index2);
      length2 = numbers2.length;
      length1 = numbers1.length;
    }

    let lengthTemp = length2;
    let redimDecimals = numbers1.slice(0, length2);
    let redimLength = redimDecimals.length;

    for (; redimLength < length2; ) {
      redimDecimals[redimLength++] = 0;
    }

    const resetDecimals = numbers2.slice();
    resetDecimals.unshift(0);
    let first2 = numbers2[0];

    if (denominator.numbers[1] >= BASE / 2) {
      ++first2;
    }

    do {
      index2 = 0;
      let result = compare(
        denominator.numbers,
        redimDecimals,
        length2,
        redimLength
      );

      if (result < 0) {
        let redimFirst = redimDecimals[0];

        if (length2 != redimLength) {
          redimFirst = redimFirst * BASE + (redimDecimals[1] || 0);
        }

        index2 = (redimFirst / first2) | 0;

        let multuply2, lengthMultiply;

        if (index2 > 1) {
          if (index2 >= BASE) {
            index2 = BASE - 1;
          }

          multuply2 = multiplyInteger(numbers2, index2);
          lengthMultiply = multuply2.length;
          redimLength = redimDecimals.length;

          result = compare(
            multuply2,
            redimDecimals,
            lengthMultiply,
            redimLength
          );

          if (result == 1) {
            index2--;

            subtract(
              multuply2,
              length2 < lengthMultiply ? resetDecimals : numbers2,
              lengthMultiply
            );
          }
        } else {
          if (index2 == 0) result = index2 = 1;
          multuply2 = numbers2.slice();
        }

        lengthMultiply = multuply2.length;

        if (lengthMultiply < redimLength) {
          multuply2.unshift(0);
        }

        subtract(redimDecimals, multuply2, redimLength);

        if (result == -1) {
          redimLength = redimDecimals.length;
          result = compare(numbers2, redimDecimals, length2, redimLength);

          if (result < 1) {
            index2++;
            subtract(
              redimDecimals,
              length2 < redimLength ? resetDecimals : numbers2,
              redimLength
            );
          }
        }

        redimLength = redimDecimals.length;
      } else if (result === 0) {
        index2++;
        redimDecimals = [0];
      }

      numbers[index1++] = index2;

      if (result && redimDecimals[0]) {
        redimDecimals[redimLength++] = numbers1[lengthTemp] || 0;
      } else {
        redimDecimals = [numbers1[lengthTemp]];
        redimLength = 1;
      }
    } while (
      (lengthTemp++ < length1 || redimDecimals[0] !== void 0) &&
      precTemp--
    );
  }

  if (!numbers[0]) {
    numbers.shift();
  }

  const result = Double.create({ numbers, base, signed });

  const precision = divider.places
    ? divider.precision + base10Exp(result) + 1
    : divider.precision;

  return round(result, precision);
}

function multiplyInteger(numbers: number[], size: number): number[] {
  let i = numbers.length;
  let carry = 0;
  let temp;

  for (numbers = numbers.slice(); i--; ) {
    temp = numbers[i] * size + carry;
    numbers[i] = temp % BASE | 0;
    carry = (temp / BASE) | 0;
  }

  if (carry) {
    numbers.unshift(carry);
  }

  return numbers;
}

function compareTo(double1: Double, double2: Double): number {
  if (double1.isZero() && double2.isZero()) {
    return 0;
  }

  if (double1.signed !== double2.signed) {
    return double1.signed - double2.signed;
  }

  const base1 = double1.base;
  const base2 = double2.base;

  if (base1 !== base2 && base1 >= 0 && base2 >= 0) {
    return base1 - base2;
  }

  const numbers1 = normalizeZero(double1);
  const numbers2 = normalizeZero(double2);

  const length1 = numbers1.length;

  for (let i = 0; i < length1; i++) {
    if (numbers1[i] !== numbers2[i]) {
      return (numbers1[i] - numbers2[i]) * double1.signed;
    }
  }

  const length2 = numbers2.length;
  const length = length1 > length2 ? length1 : length2;

  for (let i = 0; i < length - double1.base; i++) {
    if (!numbers2[i]) {
      return 1 * double1.signed;
    }

    if (!numbers1[i]) {
      return -1 * double1.signed;
    }

    if (numbers1[i] !== numbers2[i]) {
      return (numbers1[i] - numbers2[i]) * double1.signed;
    }
  }

  return 0;
}

function subtract(
  numbers1: number[],
  numbers2: number[],
  length: number
): void {
  for (let i = 0; length--; ) {
    numbers1[length] -= i;
    i = numbers1[length] < numbers2[length] ? 1 : 0;
    numbers1[length] = i * BASE + numbers1[length] - numbers2[length];
  }

  for (; !numbers1[0] && numbers1.length > 1; ) {
    numbers1.shift();
  }
}

function round(double: Double, precisionDef: number, rm?: any): Double {
  const numbers = [...double.numbers];
  let numberDigits = 1;

  for (let first = numbers[0]; first >= 10; first /= 10) {
    numberDigits++;
  }

  let length = precisionDef - numberDigits;
  let presicion;
  let roundNumber = numbers[0];
  let index = 0;

  if (length < 0) {
    presicion = precisionDef;
    length += BASE_LOG;
  } else {
    index = Math.ceil((length + 1) / BASE_LOG);

    if (index >= numbers.length) {
      return double.clone();
    }

    let word = (roundNumber = numbers[index]);

    for (numberDigits = 1; word >= 10; word /= 10) {
      numberDigits++;
    }

    length %= BASE_LOG;
    presicion = length - BASE_LOG + numberDigits;
  }

  let doRound;

  if (rm) {
    const pow = Math.pow(10, numberDigits - presicion - 1);

    const roundDigit = (roundNumber / pow) % 10 | 0;

    doRound =
      precisionDef < 0 || numbers[index + 1] !== void 0 || roundNumber % pow;

    doRound =
      rm < 4
        ? (roundDigit || doRound) &&
          (rm == 0 || rm == (double.signed < 0 ? 3 : 2))
        : roundDigit > 5 ||
          (roundDigit == 5 &&
            (rm == 4 ||
              doRound ||
              (rm == 6 &&
                (length > 0
                  ? presicion > 0
                    ? roundNumber / Math.pow(10, numberDigits - presicion)
                    : 0
                  : numbers[index - 1]) %
                  10 &
                  1) ||
              rm == (double.signed < 0 ? 8 : 7)));
  }

  if (precisionDef < 1 || !numbers[0]) {
    if (doRound) {
      const base10 = base10Exp(double);

      precisionDef = precisionDef - base10 - 1;

      const value = Math.pow(
        10,
        (BASE_LOG - (precisionDef % BASE_LOG)) % BASE_LOG
      );

      const base = Math.floor(-precisionDef / BASE_LOG) || 0;

      return Double.create({
        numbers: [value],
        base,
        signed: double.signed
      });
    } else {
      return Double.zero();
    }
  }

  let size = Math.pow(10, BASE_LOG - length);
  let base = double.base;
  const signed = double.signed;

  if (length == 0) {
    numbers.length = index;
    size = 1;
    index--;
  } else {
    numbers.length = index + 1;

    numbers[index] =
      presicion > 0
        ? ((roundNumber / Math.pow(10, numberDigits - presicion)) %
            Math.pow(10, presicion) |
            0) *
          size
        : 0;
  }

  if (doRound) {
    for (;;) {
      if (index == 0) {
        if ((numbers[0] += size) == BASE) {
          numbers[0] = 1;
          ++base;
        }

        break;
      } else {
        numbers[index] += size;

        if (numbers[index] != BASE) {
          break;
        }

        numbers[index--] = 0;
        size = 1;
      }
    }
  }

  for (length = numbers.length; numbers[--length] === 0; ) {
    numbers.pop();
  }

  if (double.base > BASE_MAX || double.base < -BASE_MAX) {
    throw Error('[DecimalError] Exponent out of range: ' + base10Exp(double));
  }

  return Double.create({ numbers, base, signed });
}

function numbersToString(numbers: number[]): string {
  const indexLastWord = numbers.length - 1;
  let str = '';
  let word = numbers[0];

  if (indexLastWord > 0) {
    let i = 1;
    let countZero;
    str += word;

    for (; i < indexLastWord; i++) {
      const numberString = numbers[i].toString();
      countZero = BASE_LOG - numberString.length;

      if (countZero) {
        str += padZeroString(countZero);
      }

      str += numberString;
    }

    word = numbers[i];
    countZero = BASE_LOG - word.toString().length;

    if (countZero) {
      str += padZeroString(countZero);
    }
  } else if (word === 0) {
    return '0';
  }

  for (; word % 10 === 0; ) {
    word /= 10;
  }

  return str + word;
}

function doubleToString(
  double: Double,
  isExponent: boolean,
  sd?: number
): string {
  let digits = numbersToString(double.numbers);
  const length = digits.length;
  const base = base10Exp(double);
  let countZero;

  if (isExponent) {
    if (sd && (countZero = sd - length) > 0) {
      digits =
        digits.charAt(0) + '.' + digits.slice(1) + padZeroString(countZero);
    } else if (length > 1) {
      digits = digits.charAt(0) + '.' + digits.slice(1);
    }

    digits = digits + (base < 0 ? 'e' : 'e+') + base;
  } else if (base < 0) {
    digits = '0.' + padZeroString(-base - 1) + digits;

    if (sd && (countZero = sd - length) > 0) {
      digits += padZeroString(countZero);
    }
  } else if (base >= length) {
    digits += padZeroString(base + 1 - length);

    if (sd && (countZero = sd - base - 1) > 0) {
      digits = digits + '.' + padZeroString(countZero);
    }
  } else {
    if ((countZero = base + 1) < length) {
      digits = digits.slice(0, countZero) + '.' + digits.slice(countZero);
    }

    if (sd && (countZero = sd - length) > 0) {
      if (base + 1 === length) {
        digits += '.';
      }

      digits += padZeroString(countZero);
    }
  }

  return double.isNegative() ? '-' + digits : digits;
}

function isExponent(exponent: number): boolean {
  return exponent <= BASE_NEGATIVE || exponent >= BASE_POSITIVE;
}

function base10Exp(decimal: Double): number {
  let base = decimal.base * BASE_LOG;
  let first = decimal.numbers[0];

  for (; first >= 10; first /= 10) {
    base++;
  }

  return base;
}

function padZeroString(size: number): string {
  let zeroString = '';

  for (; size--; ) {
    zeroString += '0';
  }

  return zeroString;
}

function checkInt32(i: number, min: number, max: number): void {
  if (i !== ~~i || i < min || i > max) {
    throw Error('[DecimalError] Invalid argument: ' + i);
  }
}
