import { ceil, floor, halfToEven,round } from './number-helper';

describe('NumberHelper', () => {
  it('should round remove all decimals', () => {
    expect(round(10.5)).toBe(11);
    expect(round(0)).toBe(0);
    expect(round(-20.75)).toBe(-21);
    expect(round(30)).toBe(30);
    expect(round(-40.25)).toBe(-40);
    expect(round(50.82)).toBe(51);
    expect(round(0.234)).toBe(0);
    expect(round(0.54)).toBe(1);
    expect(round(-0.133)).toBe(-0);
    expect(round(-0.743)).toBe(-1);
  });

  it('should round apply with decimals', () => {
    expect(round(80.755, 2)).toBe(80.76);
    expect(round(-35.542, 2)).toBe(-35.54);
    expect(round(20.15, 1)).toBe(20.2);
    expect(round(-64.315, 1)).toBe(-64.3);
  });

  it('should round apply by convert integer', () => {
    expect(round(80.755, -1)).toBe(80);
    expect(round(35.542, -1)).toBe(40);
    expect(round(22, -1)).toBe(20);
    expect(round(1264.315, -2)).toBe(1300);
  });

  it('should ceil remove all decimals', () => {
    expect(ceil(10.5)).toBe(11);
    expect(ceil(-20.75)).toBe(-20);
    expect(ceil(30)).toBe(30);
    expect(ceil(-40.25)).toBe(-40);
    expect(ceil(50.82)).toBe(51);
  });

  it('should ceil apply with decimals', () => {
    expect(ceil(80.755, 2)).toBe(80.76);
    expect(ceil(-35.542, 2)).toBe(-35.54);
    expect(ceil(20.15, 1)).toBe(20.2);
    expect(ceil(-64.315, 1)).toBe(-64.3);
  });

  it('should ceil apply by convert integer', () => {
    expect(ceil(80.755, -1)).toBe(90);
    expect(ceil(35.542, -1)).toBe(40);
    expect(ceil(22, -1)).toBe(30);
    expect(ceil(1264.315, -2)).toBe(1300);
  });

  it('should floor remove all decimals', () => {
    expect(floor(10.5)).toBe(10);
    expect(floor(0)).toBe(0);
    expect(floor(-20.75)).toBe(-21);
    expect(floor(30)).toBe(30);
    expect(floor(-40.25)).toBe(-41);
    expect(floor(50.82)).toBe(50);
    expect(floor(0.74)).toBe(0);
    expect(floor(-0.13)).toBe(-1);
    expect(floor(-0.94)).toBe(-1);
  });

  it('should floor apply with decimals', () => {
    expect(floor(80.755, 2)).toBe(80.75);
    expect(floor(-35.542, 2)).toBe(-35.55);
    expect(floor(20.15, 1)).toBe(20.1);
    expect(floor(-64.315, 1)).toBe(-64.4);
  });

  it('should floor apply by convert integer', () => {
    expect(floor(80.755, -1)).toBe(80);
    expect(floor(35.542, -1)).toBe(30);
    expect(floor(22, -1)).toBe(20);
    expect(floor(1264.315, -2)).toBe(1200);
  });

  it('should halfToEven remove all decimals', () => {
    expect(halfToEven(20.5)).toBe(20);
    expect(halfToEven(21.5)).toBe(22);
    expect(halfToEven(-20.75)).toBe(-21);
    expect(halfToEven(-20.5)).toBe(-20);
    expect(halfToEven(20)).toBe(20);
    expect(halfToEven(-20.25)).toBe(-20);
  });

  it('should halfToEven successful', () => {
    expect(halfToEven(0.5)).toBe(0);
    expect(halfToEven(1.5)).toBe(2);
    expect(halfToEven(2.5)).toBe(2);
    expect(halfToEven(3.5678, 2)).toBe(3.57);
    expect(halfToEven(4.7564, 1)).toBe(4.8);
    expect(halfToEven(35612.25, -2)).toBe(35600);
  });
});
