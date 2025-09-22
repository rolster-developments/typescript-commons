interface Currency {
  value: number;
  decimals?: number;
  symbol?: string;
}

export function currencyFormat(currency: Currency): string {
  const [integer, decimal] = Math.abs(currency.value).toString().split('.');

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

  if (!!currency.decimals && decimal) {
    result = `${result},${decimal.slice(0, currency.decimals)}`;
  }

  if (currency.value < 0) {
    result = `-${result}`;
  }

  return currency.symbol ? `${currency.symbol} ${result}` : result;
}
