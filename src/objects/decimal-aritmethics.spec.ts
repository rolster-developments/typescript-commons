import { bigDecimal } from './decimal';

describe('BigDecimal Class - Aritmethic Operations', () => {
  test('should resolve operation plus successful', () => {
    expect(bigDecimal(0).plus(bigDecimal(0)).data).toBe(0);
    expect(bigDecimal(0).plus(bigDecimal(34.8)).data).toBe(34.8);
    expect(bigDecimal(0).plus(bigDecimal(-12.59)).data).toBe(-12.59);
    expect(bigDecimal(20).plus(bigDecimal(0)).data).toBe(20);
    expect(bigDecimal(-68.1).plus(bigDecimal(0)).data).toBe(-68.1);

    expect(bigDecimal(10).plus(bigDecimal(20)).data).toBe(30);
    expect(bigDecimal(4).plus(bigDecimal(8)).data).toBe(12);
    expect(bigDecimal(1040234).plus(bigDecimal(2048)).data).toBe(1042282);
    expect(bigDecimal(5490).plus(bigDecimal(7135)).data).toBe(12625);
    expect(bigDecimal(135945).plus(bigDecimal(280523)).data).toBe(416468);

    expect(bigDecimal(1.5).plus(bigDecimal(3.25)).data).toBe(4.75);
    expect(bigDecimal(4.0028).plus(bigDecimal(10.132)).data).toBe(14.1348);
    expect(bigDecimal(0.01).plus(bigDecimal(0.02)).data).toBe(0.03);
    expect(bigDecimal(0.00031).plus(bigDecimal(23.76)).data).toBe(23.76031);

    expect(bigDecimal(-10).plus(bigDecimal(-20)).data).toBe(-30);
    expect(bigDecimal(-1040234).plus(bigDecimal(-2048)).data).toBe(-1042282);
    expect(bigDecimal(-135945).plus(bigDecimal(-280523)).data).toBe(-416468);
    expect(bigDecimal(-4.0028).plus(bigDecimal(-10.132)).data).toBe(-14.1348);
    expect(bigDecimal(-0.00031).plus(bigDecimal(-23.76)).data).toBe(-23.76031);

    expect(bigDecimal(12).plus(bigDecimal(-74)).data).toBe(-62);
    expect(bigDecimal(2594).plus(bigDecimal(-2000)).data).toBe(594);
    expect(bigDecimal(-0.00031).plus(bigDecimal(23.76)).data).toBe(23.75969);
  });

  test('should resolve operation minus successful', () => {
    expect(bigDecimal(0).minus(bigDecimal(0)).data).toBe(0);
    expect(bigDecimal(0).minus(bigDecimal(34.8)).data).toBe(-34.8);
    expect(bigDecimal(20).minus(bigDecimal(0)).data).toBe(20);
    expect(bigDecimal(125).minus(bigDecimal(125)).data).toBe(0);
    expect(bigDecimal(-472).minus(bigDecimal(-472)).data).toBe(0);

    expect(bigDecimal(20).minus(bigDecimal(10)).data).toBe(10);
    expect(bigDecimal(9).minus(bigDecimal(3)).data).toBe(6);
    expect(bigDecimal(2045000).minus(bigDecimal(50000)).data).toBe(1995000);
    expect(bigDecimal(10000000).minus(bigDecimal(19000)).data).toBe(9981000);
    expect(bigDecimal(104023.4).minus(bigDecimal(204.8)).data).toBe(103818.6);

    expect(bigDecimal(737112.89).minus(bigDecimal(735112.89)).data).toBe(2000);
    expect(bigDecimal(74935112).minus(bigDecimal(74937112)).data).toBe(-2000);

    expect(bigDecimal(0.00031).minus(bigDecimal(-23.76)).data).toBe(23.76031);
    expect(bigDecimal(100).minus(bigDecimal(-85.7)).data).toBe(185.7);

    expect(bigDecimal(-150).minus(bigDecimal(932.24)).data).toBe(-1082.24);
    expect(bigDecimal(-80.91).minus(bigDecimal(149.2)).data).toBe(-230.11);

    expect(bigDecimal(-25.2).minus(bigDecimal(-10)).data).toBe(-15.2);
    expect(bigDecimal(-6352.1).minus(bigDecimal(-964272)).data).toBe(957919.9);
  });
});
