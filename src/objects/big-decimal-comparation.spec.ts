import { BigDecimal, bigDecimal } from './big-decimal';

describe('BigDecimal Class - Comparison Operations', () => {
  test('should verify zero successful', () => {
    expect(bigDecimal(5.12345).greaterThan(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(-105.7).greaterThan(0)).toBe(false);
    expect(bigDecimal(0).greaterThanOrEqualTo(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(20).greaterThanOrEqualTo(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(-20.5).greaterThanOrEqualTo(0)).toBe(false);

    expect(bigDecimal(9.531).equals(BigDecimal.zero())).toBe(false);
    expect(bigDecimal(-9832).equals(0)).toBe(false);
    expect(bigDecimal(0).equals(BigDecimal.zero())).toBe(true);

    expect(bigDecimal(-0.342).lessThan(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(6782).lessThan(0)).toBe(false);
    expect(bigDecimal(0).lessThanOrEqualTo(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(-453.54).lessThanOrEqualTo(BigDecimal.zero())).toBe(true);
    expect(bigDecimal(23.13).lessThanOrEqualTo(0)).toBe(false);
  });

  test('should equals numbers successful', () => {
    expect(bigDecimal(731.23).equals(731.23)).toBe(true);
    expect(bigDecimal(100).equals(100)).toBe(true);
    expect(bigDecimal(3.25).equals(3.25)).toBe(true);
    expect(bigDecimal(0.0025).equals(0.0025)).toBe(true);
    expect(bigDecimal(14.00725).equals(14.00725)).toBe(true);

    expect(bigDecimal(-981.45).equals(-981.45)).toBe(true);
    expect(bigDecimal(-200).equals(-200)).toBe(true);
    expect(bigDecimal(-6.98).equals(-6.98)).toBe(true);
    expect(bigDecimal(-0.00829).equals(-0.00829)).toBe(true);
  });

  test('should greaterThan and greaterThanOrEqualTo numbers successful', () => {
    expect(bigDecimal(20).greaterThan(2)).toBe(true);
    expect(bigDecimal(8).greaterThanOrEqualTo(6)).toBe(true);
    expect(bigDecimal(5.12).greaterThan(3.24)).toBe(true);
    expect(bigDecimal(3428842).greaterThanOrEqualTo(148736)).toBe(true);
    expect(bigDecimal(958793).greaterThan(938793)).toBe(true);
    expect(bigDecimal(998.23).greaterThanOrEqualTo(453.1443)).toBe(true);
    expect(bigDecimal(5843.321).greaterThan(5843.212)).toBe(true);
    expect(bigDecimal(0.000017383).greaterThanOrEqualTo(0.0000137)).toBe(true);

    expect(bigDecimal(-20).greaterThan(-25)).toBe(true);
    expect(bigDecimal(-5).greaterThanOrEqualTo(-9)).toBe(true);
    expect(bigDecimal(-2498594).greaterThan(-59983893)).toBe(true);
    expect(bigDecimal(-0.213).greaterThanOrEqualTo(-0.243)).toBe(true);
    expect(bigDecimal(-0.948).greaterThan(-3.243)).toBe(true);
    expect(bigDecimal(-1.554).greaterThanOrEqualTo(-1.554)).toBe(true);
  });

  test('should lessThan and lessThanOrEqualTo numbers successful', () => {
    expect(bigDecimal(753).lessThan(2754)).toBe(true);
    expect(bigDecimal(3).lessThanOrEqualTo(8)).toBe(true);
    expect(bigDecimal(21.6653).lessThan(3210)).toBe(true);
    expect(bigDecimal(31294).lessThanOrEqualTo(69885)).toBe(true);
    expect(bigDecimal(938793).lessThan(958793)).toBe(true);
    expect(bigDecimal(475.23).lessThanOrEqualTo(9543.1443)).toBe(true);
    expect(bigDecimal(5843.194).lessThan(5843.754)).toBe(true);
    expect(bigDecimal(0.000047383).lessThanOrEqualTo(0.000237383)).toBe(true);

    expect(bigDecimal(-25).lessThan(-12)).toBe(true);
    expect(bigDecimal(-9).lessThanOrEqualTo(-4)).toBe(true);
    expect(bigDecimal(-455443).lessThan(-344322)).toBe(true);
    expect(bigDecimal(-0.243).lessThanOrEqualTo(-0.143)).toBe(true);
    expect(bigDecimal(-10.54).lessThan(-0.874)).toBe(true);
    expect(bigDecimal(-1.554).lessThanOrEqualTo(-1.554)).toBe(true);
  });
});
