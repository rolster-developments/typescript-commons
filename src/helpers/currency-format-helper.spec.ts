import { currencyFormat } from './currency-format-helper';

describe('currencyFormat', () => {
  it('should format a positive number', () => {
    expect(currencyFormat({ value: 1234567 })).toBe('1.234.567');
  });

  it('should format a negative number', () => {
    expect(currencyFormat({ value: -1234567 })).toBe('-1.234.567');
  });

  it('should format with decimals', () => {
    expect(
      currencyFormat({ value: 1234.5678, decimals: 2 })
    ).toBe('1.234,56');
  });

  it('should format with symbol', () => {
    expect(
      currencyFormat({ value: 1234567, symbol: '$' })
    ).toBe('$ 1.234.567');
  });

  it('should format with decimals and symbol', () => {
    expect(
      currencyFormat({ value: 1234.56, decimals: 2, symbol: '€' })
    ).toBe('€ 1.234,56');
  });

  it('should format zero', () => {
    expect(currencyFormat({ value: 0 })).toBe('0');
  });

  it('should handle small numbers', () => {
    expect(currencyFormat({ value: 12 })).toBe('12');
  });

  it('should handle hundreds', () => {
    expect(currencyFormat({ value: 123 })).toBe('123');
  });

  it('should handle thousands', () => {
    expect(currencyFormat({ value: 1234 })).toBe('1.234');
  });

  it('should handle negative with decimals and symbol', () => {
    expect(
      currencyFormat({ value: -9876.54, decimals: 1, symbol: 'R$' })
    ).toBe('R$ -9.876,5');
  });
});
