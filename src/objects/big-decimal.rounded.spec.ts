import { bigDecimal } from './big-decimal';

describe('BigDecimal Class - Rounded Operations', () => {
  test.skip('', () => {
  });

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
    
    expect(bigDecimal(175848).round(-2).data).toBe(175800);
    expect(bigDecimal(302.23).round(-1).data).toBe(300);
    expect(bigDecimal(54821).round(-3).data).toBe(55000);
  });
});
