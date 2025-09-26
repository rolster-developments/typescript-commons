interface DoubleProps {
  base: number;
  numbers: number[];
  signed: number;
}

type DoubleValue = string | number | Double | DoubleProps;

interface DividerValue {
  denominator: Double;
  numerator: Double;
  precision?: number;
  places?: boolean;
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
const ZERO_CHAR = 48;
const ZERO_PROPS: DoubleProps = { numbers: [0], base: 0, signed: 0 };
const PRECISION = 20;
const ROUNDING = 4;
const FIXED_DEFAULT = 2;
const SIGNED_POSITIVE = 1;
const SIGNED_NEUTRO = 0;
const SIGNED_NEGATIVE = -1;

export class Double {
  public readonly numbers;

  public readonly base;

  public readonly signed;

  protected constructor(value: DoubleValue) {
    const { numbers, base, signed } = createDoublePropsFromValue(value);

    this.numbers = numbers;
    this.base = base;
    this.signed = signed;
  }

  public get data(): number {
    return +this;
  }

  public get fixed(): number {
    return +this.format();
  }

  public plus(value: DoubleValue): Double {
    const double = createDouble(value);

    if (double.isZero()) {
      return this.clone();
    }

    return this.signed == double.signed
      ? operationPlus(this, double)
      : operationMinus(this, double.negative());
  }

  public minus(value: DoubleValue): Double {
    const double = createDouble(value);

    if (double.isZero()) {
      return this.clone();
    }

    if (this.isZero()) {
      return double.negative();
    }

    return this.signed == double.signed
      ? operationMinus(this, double)
      : operationPlus(this, double.negative());
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
    return compareTo(this, createDouble(value)) < 1;
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
      signed: -this.signed
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

  public format(numbers = FIXED_DEFAULT, roundMode = ROUNDING): string {
    checkInt32(numbers, 0, DIGITS_MAX);
    checkInt32(roundMode, 0, 8);

    const double = round(this, numbers + base10Exp(this) + 1, roundMode);

    const str = decimaltoString(
      double.abs(),
      false,
      numbers + base10Exp(double) + 1
    );

    return this.isNegative() && !this.isZero() ? `-${str}` : str;
  }

  public roundCeil(decimals = 0): Double {
    const position = this.base + 1;

    if (this.numbers.length === position) {
      return new Double({
        numbers: this.numbers,
        base: this.base,
        signed: this.signed
      });
    }

    if (decimals <= 0) {
      const numbers = this.numbers.slice(0, position);

      numbers[this.base] = this.numbers[this.base] + 1;

      return new Double({
        numbers,
        base: this.base,
        signed: this.signed
      });
    }

    const base = Math.floor(decimals / BASE_LOG);
    const size = decimals % BASE_LOG;

    const decimalsPos = this.base + base;

    const numbers = this.numbers.slice(0, decimalsPos + 1);

    if (size > 0) {
      const _number = this.numbers[decimalsPos + 1];

      if (_number) {
        const ceil = +String(_number).slice(0, size) + 1;
        numbers.push(+String(ceil).padEnd(BASE_LOG, '0'));
      }
    } else {
      numbers[decimalsPos] = this.numbers[decimalsPos] + 1;
    }

    return new Double({
      numbers,
      base: this.base,
      signed: this.signed
    });
  }

  public roundFloor(decimals = 0): Double {
    if (decimals <= 0) {
      return new Double({
        numbers: this.numbers.slice(0, this.base + 1),
        base: this.base,
        signed: this.signed
      });
    }

    const base = Math.floor(decimals / BASE_LOG);
    const size = decimals % BASE_LOG;

    const numbers = this.numbers.slice(0, this.base + base + 1);

    if (size > 0) {
      const _number = this.numbers[this.base + base + 1];

      if (_number) {
        const floor = String(_number).slice(0, size);
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
    return decimaltoString(this, isExponent(base10Exp(this)));
  }

  public static create(value: DoubleValue): Double {
    return new Double(value);
  }

  public static zero(): Double {
    return new Double(ZERO_PROPS);
  }
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

    let base = Math.floor(numberStr / BASE_LOG);
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

function createDouble(value: DoubleValue): Double {
  return value instanceof Double ? value : Double.create(value);
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

  return parseDouble(signed, value.toString());
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

function operationPlus(double1: Double, double2: Double): Double {
  if (double1.isZero() && double2.isZero()) {
    return Double.zero();
  }

  let carry = 0;
  let numbersTemp;
  let length;

  let numbers1 = [...double1.numbers].slice();
  let numbers2 = [...double2.numbers];

  let base1 = double1.base;
  let base2 = double2.base;
  let baseDiff = base1 - base2;

  if (baseDiff) {
    if (baseDiff < 0) {
      numbersTemp = numbers1;
      baseDiff = -baseDiff;
      length = numbers2.length;
    } else {
      numbersTemp = numbers2;
      base2 = base1;
      length = numbers1.length;
    }

    base1 = Math.ceil(PRECISION / BASE_LOG);
    length = base1 > length ? base1 + 1 : length + 1;

    if (baseDiff > length) {
      baseDiff = length;
      numbersTemp.length = 1;
    }

    numbersTemp.reverse();

    for (; baseDiff--; ) {
      numbersTemp.push(0);
    }

    numbersTemp.reverse();
  }

  length = numbers1.length;
  baseDiff = numbers2.length;

  if (length - baseDiff < 0) {
    baseDiff = length;
    numbersTemp = numbers2;
    numbers2 = numbers1;
    numbers1 = numbersTemp;
  }

  for (; baseDiff; ) {
    carry =
      ((numbers1[--baseDiff] =
        numbers1[baseDiff] + numbers2[baseDiff] + carry) /
        BASE) |
      0;
    numbers1[baseDiff] %= BASE;
  }

  if (carry) {
    numbers1.unshift(carry);
    ++base2;
  }

  for (length = numbers1.length; numbers1[--length] == 0; ) {
    numbers1.pop();
  }

  return Double.create({
    numbers: numbers1,
    base: base2,
    signed: double1.signed
  });
}

function operationMinus(double1: Double, double2: Double): Double {
  if (double1.isZero() && double2.isZero()) {
    return Double.zero();
  }

  let numbersTemp, index1, index2, length, verify;

  let numbers1 = [...double1.numbers].slice();
  let numbers2 = [...double2.numbers];

  let signed = double2.signed;
  let base1 = double1.base;
  let base2 = double2.base;
  let baseDiff = base1 - base2;

  if (baseDiff) {
    verify = baseDiff < 0;

    if (verify) {
      numbersTemp = numbers1;
      baseDiff = -baseDiff;
      length = numbers2.length;
    } else {
      numbersTemp = numbers2;
      base2 = base1;
      length = numbers1.length;
    }

    index1 = Math.max(Math.ceil(PRECISION / BASE_LOG), length) + 2;

    if (baseDiff > index1) {
      baseDiff = index1;
      numbersTemp.length = 1;
    }

    numbersTemp.reverse();

    for (index1 = baseDiff; index1--; ) {
      numbersTemp.push(0);
    }

    numbersTemp.reverse();
  } else {
    length = numbers2.length;
    index1 = numbers1.length;
    verify = index1 < length;

    if (verify) {
      length = index1;
    }

    for (index1 = 0; index1 < length; index1++) {
      if (numbers1[index1] != numbers2[index1]) {
        verify = numbers1[index1] < numbers2[index1];
        break;
      }
    }

    baseDiff = 0;
  }

  if (verify) {
    numbersTemp = numbers1;
    numbers1 = numbers2;
    numbers2 = numbersTemp;

    if (signed != 0) {
      signed = -signed;
    }
  }

  length = numbers1.length;

  for (index1 = numbers2.length - length; index1 > 0; --index1) {
    numbers1[length++] = 0;
  }

  for (index1 = numbers2.length; index1 > baseDiff; ) {
    if (numbers1[--index1] < numbers2[index1]) {
      for (index2 = index1; index2 && numbers1[--index2] === 0; ) {
        numbers1[index2] = BASE - 1;
      }

      --numbers1[index2];
      numbers1[index1] += BASE;
    }

    numbers1[index1] -= numbers2[index1];
  }

  for (; numbers1[--length] === 0; ) {
    numbers1.pop();
  }

  for (; numbers1[0] === 0; numbers1.shift()) {
    --base2;
  }

  if (!numbers1[0]) {
    return Double.zero();
  }

  return Double.create({ numbers: numbers1, base: base2, signed });
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

function operationDivide(divider: DividerValue): Double {
  if (divider.denominator.isZero()) {
    throw Error('[DecimalError] Division by zero');
  }

  if (divider.numerator.isZero()) {
    return Double.zero();
  }

  const factor = getFactorForDivider(divider.denominator);

  let numerator =
    factor > 1 ? divider.numerator.multiply(factor) : divider.numerator;

  let denominator =
    factor > 1 ? divider.denominator.multiply(factor) : divider.denominator;

  const signed =
    numerator.signed == denominator.signed ? SIGNED_POSITIVE : SIGNED_NEGATIVE;

  let index1, index2, precTemp;
  let numbers1 = [...numerator.numbers];
  let numbers2 = [...denominator.numbers];
  let numbers: number[] = [];

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

    let resetDecimals = numbers2.slice();
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

function compareTo(number1: Double, number2: Double): number {
  if (number1.signed !== number2.signed) {
    return number1.signed || -number2.signed;
  }

  if (number1.base !== number2.base) {
    return number1.base > number2.base !== number1.signed < 0 ? 1 : -1;
  }

  const numbers1 = number1.numbers;
  const numbers2 = number2.numbers;
  const length1 = numbers1.length;
  const length2 = numbers2.length;

  for (let i = 0, j = length1 < length2 ? length1 : length2; i < j; ++i) {
    if (numbers1[i] !== numbers2[i]) {
      return numbers1[i] > numbers2[i] !== number1.signed < 0 ? 1 : -1;
    }
  }

  return length1 === length2
    ? 0
    : length1 > length2 !== number1.signed < 0
    ? 1
    : -1;
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

    let roundDigit = (roundNumber / pow) % 10 | 0;

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
  let signed = double.signed;

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

  return Double.create({ numbers, base: base, signed });
}

function decimaltoString(
  double: Double,
  isExponent: boolean,
  sd?: number
): string {
  let digits = digitsToString(double.numbers);
  let length = digits.length;
  let base = base10Exp(double);
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

  return double.signed < 0 ? '-' + digits : digits;
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

function digitsToString(numbers: number[]): string {
  let indexLastWord = numbers.length - 1;
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
