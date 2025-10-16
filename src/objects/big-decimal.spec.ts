import { bigDecimal } from './big-decimal';

describe('Decimal Class - Creation and Basic Properties', () => {
  test('should create from number and format string', () => {
    expect(bigDecimal(20000000).toString()).toBe('20000000');
    expect(bigDecimal(2984).toString()).toBe('2984');
    expect(bigDecimal(14500).toString()).toBe('14500');

    expect(bigDecimal(-1296833).toString()).toBe('-1296833');
    expect(bigDecimal(-733).toString()).toBe('-733');
    expect(bigDecimal(-62135).toString()).toBe('-62135');

    expect(bigDecimal(784532.0034).toString()).toBe('784532.0034');
    expect(bigDecimal(0).toString()).toBe('0');
    expect(bigDecimal(-0).toString()).toBe('0');
  });
});
