import { bigDecimal } from './big-decimal';

describe('BigDecimal Class - Rounded Operations', () => {
  test('should verify rounded standard successful', () => {
    expect(bigDecimal(25).round().data).toBe(25);
    expect(bigDecimal(0).round().data).toBe(0);
    expect(bigDecimal(-20).round().data).toBe(-20);

    expect(bigDecimal(0.124).round().data).toBe(0);
    expect(bigDecimal(-40.48).round().data).toBe(-40);
    expect(bigDecimal(10.4).round().data).toBe(10);
    expect(bigDecimal(-0.054).round().data).toBe(0);

    expect(bigDecimal(99999.95).round().data).toBe(100000);
    expect(bigDecimal(0.652).round().data).toBe(1);
    expect(bigDecimal(50.82).round().data).toBe(51);
    expect(bigDecimal(-0.71).round().data).toBe(-1);
    expect(bigDecimal(-741.7).round().data).toBe(-742);

    expect(bigDecimal(23765).round(3).data).toBe(23765);
    expect(bigDecimal(197.876).round(2).data).toBe(197.88);
    expect(bigDecimal(9999.98).round(1).data).toBe(10000);
    expect(bigDecimal(-0.879).round(3).data).toBe(-0.879);

    expect(bigDecimal(912.323).round(2).data).toBe(912.32);
    expect(bigDecimal(9999.91).round(1).data).toBe(9999.9);

    expect(bigDecimal(175848).round(-2).data).toBe(175800);
    expect(bigDecimal(302.23).round(-1).data).toBe(300);
    expect(bigDecimal(54821).round(-3).data).toBe(55000);
    expect(bigDecimal(96).round(-3).data).toBe(0);
    expect(bigDecimal(565).round(-3).data).toBe(0);
  });

  test('should verify rounded ceil successful', () => {
    expect(bigDecimal(25).ceil().data).toBe(25);
    expect(bigDecimal(0).ceil().data).toBe(0);
    expect(bigDecimal(-20).ceil().data).toBe(-20);

    expect(bigDecimal(0.124).ceil().data).toBe(1);
    expect(bigDecimal(-40.48).ceil().data).toBe(-41);
    expect(bigDecimal(10.4).ceil().data).toBe(11);
    expect(bigDecimal(-0.054).ceil().data).toBe(-1);

    expect(bigDecimal(99999.95).ceil().data).toBe(100000);
    expect(bigDecimal(0.652).ceil().data).toBe(1);
    expect(bigDecimal(50.82).ceil().data).toBe(51);
    expect(bigDecimal(-0.71).ceil().data).toBe(-1);
    expect(bigDecimal(-741.7).ceil().data).toBe(-742);

    expect(bigDecimal(23765).ceil(3).data).toBe(23765);
    expect(bigDecimal(197.876).ceil(2).data).toBe(197.88);
    expect(bigDecimal(9999.98).ceil(1).data).toBe(10000);
    expect(bigDecimal(53.322).ceil(2).data).toBe(53.33);
    expect(bigDecimal(-0.879).ceil(3).data).toBe(-0.879);

    expect(bigDecimal(912.323).ceil(2).data).toBe(912.33);
    expect(bigDecimal(9999.91).ceil(1).data).toBe(10000);

    expect(bigDecimal(175848).ceil(-2).data).toBe(175900);
    expect(bigDecimal(302.23).ceil(-1).data).toBe(310);
    expect(bigDecimal(54121).ceil(-3).data).toBe(55000);
    expect(bigDecimal(96).ceil(-3).data).toBe(0);
    expect(bigDecimal(565).ceil(-3).data).toBe(0);
  });

  test('should verify rounded floor successful', () => {
    expect(bigDecimal(25).floor().data).toBe(25);
    expect(bigDecimal(0).floor().data).toBe(0);
    expect(bigDecimal(-20).floor().data).toBe(-20);

    expect(bigDecimal(0.124).floor().data).toBe(0);
    expect(bigDecimal(-40.48).floor().data).toBe(-40);
    expect(bigDecimal(10.4).floor().data).toBe(10);
    expect(bigDecimal(-0.054).floor().data).toBe(0);

    expect(bigDecimal(99999.95).floor().data).toBe(99999);
    expect(bigDecimal(0.652).floor().data).toBe(0);
    expect(bigDecimal(50.82).floor().data).toBe(50);
    expect(bigDecimal(-0.71).floor().data).toBe(0);
    expect(bigDecimal(-741.7).floor().data).toBe(-741);

    expect(bigDecimal(23765).floor(3).data).toBe(23765);
    expect(bigDecimal(197.876).floor(2).data).toBe(197.87);
    expect(bigDecimal(9999.98).floor(1).data).toBe(9999.9);
    expect(bigDecimal(53.322).floor(2).data).toBe(53.32);
    expect(bigDecimal(-0.879).floor(3).data).toBe(-0.879);

    expect(bigDecimal(912.323).floor(2).data).toBe(912.32);
    expect(bigDecimal(9999.91).floor(1).data).toBe(9999.9);

    expect(bigDecimal(175848).floor(-2).data).toBe(175800);
    expect(bigDecimal(302.23).floor(-1).data).toBe(300);
    expect(bigDecimal(54121).floor(-3).data).toBe(54000);
    expect(bigDecimal(96).floor(-3).data).toBe(0);
    expect(bigDecimal(565).floor(-3).data).toBe(0);
  });

  test('should verify rounded half-to-even successful', () => {
    expect(bigDecimal(25).halfToEven().data).toBe(25);
    expect(bigDecimal(0).halfToEven().data).toBe(0);
    expect(bigDecimal(-20).halfToEven().data).toBe(-20);

    expect(bigDecimal(0.124).halfToEven().data).toBe(0);
    expect(bigDecimal(-40.48).halfToEven().data).toBe(-40);
    expect(bigDecimal(10.4).halfToEven().data).toBe(10);
    expect(bigDecimal(-0.054).halfToEven().data).toBe(0);

    expect(bigDecimal(99999.95).halfToEven().data).toBe(100000);
    expect(bigDecimal(0.652).halfToEven().data).toBe(1);
    expect(bigDecimal(50.82).halfToEven().data).toBe(51);
    expect(bigDecimal(-0.71).halfToEven().data).toBe(-1);
    expect(bigDecimal(-741.7).halfToEven().data).toBe(-742);

    expect(bigDecimal(23765).halfToEven(3).data).toBe(23765);
    expect(bigDecimal(197.876).halfToEven(2).data).toBe(197.88);
    expect(bigDecimal(9999.98).halfToEven(1).data).toBe(10000);
    expect(bigDecimal(-0.879).halfToEven(3).data).toBe(-0.879);

    expect(bigDecimal(912.323).halfToEven(2).data).toBe(912.32);
    expect(bigDecimal(9999.91).halfToEven(1).data).toBe(9999.9);
    expect(bigDecimal(4563.57).halfToEven(2).data).toBe(4563.57);

    expect(bigDecimal(175848).halfToEven(-2).data).toBe(175800);
    expect(bigDecimal(302.23).halfToEven(-1).data).toBe(300);
    expect(bigDecimal(54821).halfToEven(-3).data).toBe(55000);
    expect(bigDecimal(96).halfToEven(-3).data).toBe(0);
    expect(bigDecimal(565).halfToEven(-3).data).toBe(0);

    expect(bigDecimal(22.591).halfToEven().data).toBe(22);
    expect(bigDecimal(77.578).halfToEven().data).toBe(78);
    expect(bigDecimal(-8964.512).halfToEven().data).toBe(-8964);
    expect(bigDecimal(-413.556).halfToEven().data).toBe(-414);
  });
});
