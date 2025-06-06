interface Currency {
  value: number;
  decimals?: number;
  symbol?: string;
}

export function currencyFormat(currency: Currency): string {
  const { value, decimals, symbol } = currency;

  const [integer, decimal] = Math.abs(value).toString().split('.');

  let result = '';
  let count = 0;

  for (let i = 1; i <= integer.length; i++) {
    const index = integer.length - i;

    if (count === 3) {
      count = 0;
      result = `.${result}`;
    }

    count++;
    result = `${integer.charAt(index)}${result}`;
  }

  if (!!decimals && decimal) {
    result = `${result},${decimal.slice(0, decimals)}`;
  }

  if (value < 0) {
    result = `-${result}`;
  }

  return symbol ? `${symbol} ${result}` : result;
}
