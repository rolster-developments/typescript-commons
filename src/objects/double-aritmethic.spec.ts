import { double } from './double';

describe.skip('Double Class - Aritmethic Operations', () => {
  test('should resolve operation plus successful', () => {
    expect(double(0).plus(double(0)).data).toBe(0);
    expect(double(0).plus(double(34.8)).data).toBe(34.8);
    expect(double(0).plus(double(-12.59)).data).toBe(-12.59);
    expect(double(20).plus(double(0)).data).toBe(20);
    expect(double(-68.1).plus(double(0)).data).toBe(-68.1);

    expect(double(10).plus(double(20)).data).toBe(30);
    expect(double(4).plus(double(8)).data).toBe(12);
    expect(double(1040234).plus(double(2048)).data).toBe(1042282);
    expect(double(5490).plus(double(7135)).data).toBe(12625);
    expect(double(135945).plus(double(280523)).data).toBe(416468);

    expect(double(1.5).plus(double(3.25)).data).toBe(4.75);
    expect(double(4.0028).plus(double(10.132)).data).toBe(14.1348);
    expect(double(0.01).plus(double(0.02)).data).toBe(0.03);
    expect(double(0.00031).plus(double(23.76)).data).toBe(23.76031);

    expect(double(-10).plus(double(-20)).data).toBe(-30);
    expect(double(-1040234).plus(double(-2048)).data).toBe(-1042282);
    expect(double(-135945).plus(double(-280523)).data).toBe(-416468);
    expect(double(-4.0028).plus(double(-10.132)).data).toBe(-14.1348);
    expect(double(-0.00031).plus(double(-23.76)).data).toBe(-23.76031);

    expect(double(12).plus(double(-74)).data).toBe(-62);
    expect(double(2594).plus(double(-2000)).data).toBe(594);
    expect(double(-0.00031).plus(double(23.76)).data).toBe(23.75969);
  });

  test('should resolve operation minus successful', () => {
    expect(double(0).minus(double(0)).data).toBe(0);
    expect(double(0).minus(double(34.8)).data).toBe(-34.8);
    expect(double(20).minus(double(0)).data).toBe(20);
    expect(double(125).minus(double(125)).data).toBe(0);
    expect(double(-472).minus(double(-472)).data).toBe(0);

    expect(double(20).minus(double(10)).data).toBe(10);
    expect(double(9).minus(double(3)).data).toBe(6);
    expect(double(104023.4).minus(double(204.8)).data).toBe(103818.6);
    expect(double(2045000).minus(double(50000)).data).toBe(1995000);
    expect(double(10000000).minus(double(19000)).data).toBe(9981000);

    expect(double(74935112).minus(double(74937112)).data).toBe(-2000);

    expect(double(0.00031).minus(double(-23.76)).data).toBe(23.76031);
    expect(double(-150).minus(double(932.24)).data).toBe(-1082.24);
    expect(double(74937112.89).minus(double(74935112.89)).data).toBe(2000);
  });
});
