import { round, roundCeil, roundFloor, roundHalfToEven } from './number-helper';

describe('NumberHelper', () => {
  it('should round remove all decimals', () => {
    expect(round(10.5)).toBe(11);
    expect(round(-20.75)).toBe(-21);
    expect(round(30)).toBe(30);
    expect(round(-40.25)).toBe(-40);
    expect(round(50.82)).toBe(51);
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
    expect(roundCeil(10.5)).toBe(11);
    expect(roundCeil(-20.75)).toBe(-20);
    expect(roundCeil(30)).toBe(30);
    expect(roundCeil(-40.25)).toBe(-40);
    expect(roundCeil(50.82)).toBe(51);
  });

  it('should ceil apply with decimals', () => {
    expect(roundCeil(80.755, 2)).toBe(80.76);
    expect(roundCeil(-35.542, 2)).toBe(-35.54);
    expect(roundCeil(20.15, 1)).toBe(20.2);
    expect(roundCeil(-64.315, 1)).toBe(-64.3);
  });

  it('should ceil apply by convert integer', () => {
    expect(roundCeil(80.755, -1)).toBe(90);
    expect(roundCeil(35.542, -1)).toBe(40);
    expect(roundCeil(22, -1)).toBe(30);
    expect(roundCeil(1264.315, -2)).toBe(1300);
  });

  it('should floor remove all decimals', () => {
    expect(roundFloor(10.5)).toBe(10);
    expect(roundFloor(-20.75)).toBe(-21);
    expect(roundFloor(30)).toBe(30);
    expect(roundFloor(-40.25)).toBe(-41);
    expect(roundFloor(50.82)).toBe(50);
  });

  it('should floor apply with decimals', () => {
    expect(roundFloor(80.755, 2)).toBe(80.75);
    expect(roundFloor(-35.542, 2)).toBe(-35.55);
    expect(roundFloor(20.15, 1)).toBe(20.1);
    expect(roundFloor(-64.315, 1)).toBe(-64.4);
  });

  it('should floor apply by convert integer', () => {
    expect(roundFloor(80.755, -1)).toBe(80);
    expect(roundFloor(35.542, -1)).toBe(30);
    expect(roundFloor(22, -1)).toBe(20);
    expect(roundFloor(1264.315, -2)).toBe(1200);
  });

  it('should halfToEven remove all decimals', () => {
    expect(roundHalfToEven(20.5)).toBe(20);
    expect(roundHalfToEven(21.5)).toBe(22);
    expect(roundHalfToEven(-20.75)).toBe(-21);
    expect(roundHalfToEven(-20.5)).toBe(-20);
    expect(roundHalfToEven(20)).toBe(20);
    expect(roundHalfToEven(-20.25)).toBe(-20);
  });

  it('should halfToEven successful', () => {
    expect(roundHalfToEven(0.5)).toBe(0);
    expect(roundHalfToEven(1.5)).toBe(2);
    expect(roundHalfToEven(2.5)).toBe(2);
    expect(roundHalfToEven(3.5678, 2)).toBe(3.57);
    expect(roundHalfToEven(4.7564, 1)).toBe(4.8);
    expect(roundHalfToEven(35612.25, -2)).toBe(35600);
  });
});
