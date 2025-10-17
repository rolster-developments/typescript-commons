import { bigDecimal } from './big-decimal';

describe('Decimal Class - Creation and Basic Properties', () => {
  test('should create from number and format string', () => {
    expect(bigDecimal(20000000).data).toBe(20000000);
    expect(bigDecimal(2984).data).toBe(2984);
    expect(bigDecimal(14500).data).toBe(14500);

    expect(bigDecimal(-1296833).data).toBe(-1296833);
    expect(bigDecimal(-733).data).toBe(-733);
    expect(bigDecimal(-62135).data).toBe(-62135);

    expect(bigDecimal(12.038).data).toBe(12.038);
    expect(bigDecimal(784532.0034).data).toBe(784532.0034);
    expect(bigDecimal(4325.00816).data).toBe(4325.00816);
    expect(bigDecimal(0).data).toBe(0);
    expect(bigDecimal(-0).data).toBe(0);
    expect(bigDecimal(12.0388199223830001).data).toBe(12.0388199223830001);
    expect(bigDecimal(5412.03881900000).data).toBe(5412.038819);
  });
});
