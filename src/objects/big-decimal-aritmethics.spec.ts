import { bigDecimal } from './big-decimal';

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
    expect(bigDecimal(5042.016806722689).plus(957.98).data).toBe(5999.996806722689);
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
    expect(bigDecimal(5042.016806722689).minus(957.98).data).toBe(4084.036806722689);
  });

  test('should resolve operation multiply successful', () => {
    expect(bigDecimal(0).multiply(0).data).toBe(0);
    expect(bigDecimal(331.5).multiply(0).data).toBe(0);
    expect(bigDecimal(0).multiply(10).data).toBe(0);
    expect(bigDecimal(-9431.4).multiply(0).data).toBe(0);
    expect(bigDecimal(0).multiply(-0.543).data).toBe(0);

    expect(bigDecimal(10).multiply(2).data).toBe(20);
    expect(bigDecimal(5).multiply(932).data).toBe(4660);

    expect(bigDecimal(95780).multiply(3.5).data).toBe(335230);
    expect(bigDecimal(3.25).multiply(741).data).toBe(2408.25);
    expect(bigDecimal(12975.15).multiply(973.38).data).toBe(12629751.507);

    expect(bigDecimal(-100).multiply(35).data).toBe(-3500);
    expect(bigDecimal(4).multiply(-613).data).toBe(-2452);

    expect(bigDecimal(95780).multiply(-3.5).data).toBe(-335230);
    expect(bigDecimal(-3.25).multiply(741).data).toBe(-2408.25);
    expect(bigDecimal(12975.15).multiply(-973.38).data).toBe(-12629751.507);

    expect(bigDecimal(-200).multiply(-65).data).toBe(13000);

    expect(bigDecimal(123.456).multiply(789.123).data).toBe(97421.969088);
    expect(bigDecimal(999.999).multiply(999.999).data).toBe(999998.000001);
    expect(bigDecimal(0.001).multiply(0.001).data).toBe(0.000001);
    expect(bigDecimal(-456.789).multiply(123.456).data).toBe(-56393.342784);
    expect(bigDecimal(-123.456).multiply(-789.123).data).toBe(97421.969088);
    expect(bigDecimal(1.0).multiply(2.0).data).toBe(2);
    expect(bigDecimal(1.5).multiply(2).data).toBe(3);
    expect(bigDecimal(0.01).multiply(0.1).data).toBe(0.001);
    expect(bigDecimal(3.0103).multiply(0.25).data).toBe(0.752575);
    expect(bigDecimal(0.25).multiply(1000000).data).toBe(250000);
    expect(bigDecimal(0.00001).multiply(1000000).data).toBe(10);
    expect(bigDecimal(0.000001).multiply(1040000).data).toBe(1.04);
    expect(bigDecimal(0.000001).multiply(1000000).data).toBe(1);
  });

  test('should resolve operation divide successful', () => {
    expect(bigDecimal(3.421).divide(3.421).data).toBe(1);
    expect(bigDecimal(10).divide(2).data).toBe(5);
    expect(bigDecimal(0).divide(10).data).toBe(0);
    expect(bigDecimal(0).divide(5.25).data).toBe(0);
    expect(bigDecimal(10).divide(10).data).toBe(1);
    expect(bigDecimal(156.5).divide(2).data).toBe(78.25);

    expect(bigDecimal(2062.5).divide(30.25).data).toBe(68.18181818181819);
    expect(bigDecimal(20625).divide(3.025).data).toBe(6818.181818181818);
    expect(bigDecimal(20625).divide(30.25).data).toBe(681.8181818181819);
    expect(bigDecimal(20625).divide(302.5).data).toBe(68.18181818181819);
    expect(bigDecimal(20625).divide(3025).data).toBe(6.8181818181818181);

    expect(bigDecimal(-99999999999999).divide(11111111111111).data).toBe(-9);
    expect(bigDecimal(-8).divide(2).data).toBe(-4);
    expect(bigDecimal(-13).divide(2.5).data).toBe(-5.2);
    expect(bigDecimal(0.5).divide(100).data).toBe(0.005);
    expect(bigDecimal(1).divide(-97).data).toBe(-0.010309278350515);

    expect(bigDecimal(1).divide(3).data).toBe(0.333333333333333);
    expect(bigDecimal(12.345).divide(6.789).data).toBe(1.8183826778612462);
    expect(bigDecimal(0.001).divide(0.002).data).toBe(0.5);
    expect(bigDecimal(123456.789).divide(987.654).data).toBe(
      125.00003948751284
    );
    expect(bigDecimal(15.75).divide(-3.5).data).toBe(-4.5);
  });

  test('should resolve operation percentage successful', () => {
    expect(bigDecimal(10000).percentage(19).data).toBe(1900);
    expect(bigDecimal(2.57).percentage(50).data).toBe(1.285);
  });
});
