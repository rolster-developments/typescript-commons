# Rolster Commons

Advanced utilities package compatible with Typescript projects.

## Installation

```
npm i @rolster/commons
```

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Features

A grab-bag of building blocks grouped in four families: **helpers**,
**objects**, **promises** and **result types**.

### Helpers

General purpose value helpers:

```typescript
import {
  valueIsDefined,
  valueIsUndefined,
  parseBoolean,
  parse,
  clone,
  freeze,
  seal,
  round,
  currencyFormat,
  createDebouncedTimeout
} from '@rolster/commons';

valueIsDefined(0); // true  (only null/undefined are "undefined")
valueIsUndefined(null); // true

parseBoolean('false'); // false
parseBoolean('1'); // true

parse<number[]>('[1,2,3]'); // [1, 2, 3] (safe JSON.parse, returns the raw string on error)

clone(user); // deep clone (with optional field overrides)
clone(user, { name: 'Andrés' }); // deep clone + override

freeze(config); // deep Object.freeze
seal(config); // deep Object.seal

round(3.14159, 2); // 3.14 (also: ceil, floor, halfToEven)
```

`currencyFormat` formats a number using thousands separators (`.`) and an
optional symbol and decimal places:

```typescript
currencyFormat({ value: 1234567.89, decimals: 2, symbol: '$' });
// '$ 1.234.567,89'
```

`createDebouncedTimeout` returns a reusable debouncer — each `schedule` cancels
the pending callback and restarts the timer:

```typescript
const debounced = createDebouncedTimeout(300);

input.addEventListener('keyup', () => {
  debounced.schedule(() => search(input.value)); // fires 300ms after the last keystroke
});

debounced.cancel(); // abort a pending callback
```

### BigDecimal

Arbitrary precision decimal arithmetic that avoids floating point errors
(`0.1 + 0.2 === 0.30000000000000004`). Instances are immutable; every
operation returns a new `BigDecimal`.

```typescript
import { bigDecimal } from '@rolster/commons';

const price = bigDecimal('0.1').plus('0.2');
price.toString(); // '0.3'
price.data; // 0.3 (as native number)

bigDecimal(1500).percentage(19); // IVA: 285
bigDecimal('10').divide(3, 4); // '3.3333'

const total = bigDecimal('99.99').multiply(3);
total.greaterThan(250); // true
total.round(0).toString(); // '300'
```

Available operations: `plus`, `minus`, `multiply`, `divide`, `percentage`,
`abs`, `negative`; rounding: `round`, `ceil`, `floor`, `halfToEven`;
comparisons: `equals`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`,
`lessThanOrEqualTo`, `isZero`, `isPositive`, `isNegative`.

### Observable

A tiny synchronous observable to broadcast values to multiple subscribers. Use
`subscribe` to also receive the current value immediately, or `listen` to only
receive future values.

```typescript
import { observable } from '@rolster/commons';

const counter = observable(0);

const unsubscribe = counter.subscribe((value) => console.log(value)); // logs 0

counter.next(1); // logs 1
counter.next(2); // logs 2

counter.value; // 2

unsubscribe();
counter.close(); // removes every observer
```

### Collections & criteria

```typescript
import { Queque, SecureMap, Criterias } from '@rolster/commons';

// FIFO queue (linked list)
const queue = Queque.fromArray([1, 2, 3]);
queue.enqueue(4);
queue.dequeue(); // 1
queue.length; // 3

// Map that lazily builds a default value when a key is missing
const groups = new SecureMap<string[]>(() => []);
groups.request('admins').push('Daniel');

// Comparable set of key/value criteria
const filter = Criterias.fromLiteralObject({ status: 'active', city: 'Bogotá' });
filter.value('status'); // 'active'
filter.toLiteralObject(); // { status: 'active', city: 'Bogotá' }
```

### Promises

```typescript
import { delayPromise, securePromise, fromPromise } from '@rolster/commons';

await delayPromise(1000, 'done'); // resolves with 'done' after 1s

fromPromise(42); // Promise<number> (wraps a value or passes a promise through)

// A promise you can resolve/reject from the outside
const secure = securePromise<string>();
secure.then((value) => console.log(value));
secure.resolve('later');
```

### Result types

Expressive alternatives to throwing or returning `null`.

**Optional** — model a possibly-absent value:

```typescript
import { Optional } from '@rolster/commons';

const user = Optional.build(findUser(id));

user.when(
  (value) => render(value), // present
  () => renderNotFound() // empty
);

user.present((value) => log(value));
user.isPresent();
```

**Either** — model a success/failure branch:

```typescript
import { Either } from '@rolster/commons';

function parseAge(value: string): Either<number, string> {
  const age = Number(value);
  return isNaN(age) ? Either.failure('Invalid age') : Either.success(age);
}

parseAge('42').when({
  success: (age) => `Age is ${age}`,
  failure: (error) => `Error: ${error}`
});
```

**Result** — a serializable success/failure object:

```typescript
import { ResultFactory } from '@rolster/commons';

const result = ok ? ResultFactory.success(data) : ResultFactory.failure('Boom');

if (result.isSuccess) {
  console.log(result.value);
}
```

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
