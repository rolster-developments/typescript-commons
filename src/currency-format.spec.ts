import { currencyFormat } from './currency-format';

describe('CurrencyFormat', () => {
  it('should generate format only value successful', () => {
    expect(currencyFormat({ value: 4609766 })).toBe('4.609.766');
    expect(currencyFormat({ value: 243 })).toBe('243');
    expect(currencyFormat({ value: 10247 })).toBe('10.247');
  });

  it('should generate format only value and symbol successful', () => {
    expect(currencyFormat({ value: 10247, symbol: '$' })).toBe('$ 10.247');
    expect(currencyFormat({ value: 243, symbol: 'USD' })).toBe('USD 243');
    expect(currencyFormat({ value: 5124, symbol: '€' })).toBe('€ 5.124');
  });

  it('should generate format only value and decimals successful', () => {
    expect(currencyFormat({ value: 46097.66, decimals: 2 })).toBe(
      '46.097,66'
    );
    expect(currencyFormat({ value: 10.7, decimals: 2 })).toBe('10,7');
    expect(currencyFormat({ value: 2351245.7, decimals: 2 })).toBe(
      '2.351.245,7'
    );
    expect(currencyFormat({ value: 30.541, decimals: 2 })).toBe('30,54');
  });

  it('should generate format complet successful', () => {
    expect(
      currencyFormat({ value: 10247.5, symbol: '$', decimals: 2 })
    ).toBe('$ 10.247,5');
    expect(
      currencyFormat({ value: 243.06, symbol: 'USD', decimals: 2 })
    ).toBe('USD 243,06');
    expect(
      currencyFormat({ value: 5124.431, symbol: '€', decimals: 3 })
    ).toBe('€ 5.124,431');
  });

  it('should generate format only negative value successful', () => {
    expect(currencyFormat({ value: -4609766 })).toBe('-4.609.766');
    expect(currencyFormat({ value: -243 })).toBe('-243');
    expect(currencyFormat({ value: -10247 })).toBe('-10.247');
  });
});
