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

A grab-bag of building blocks grouped in five families: **helpers**,
**objects**, **promises**, **result types** and **DOM helpers** (the latter
under the `@rolster/commons/dom` subpath).

### Helpers

General purpose value helpers:

```typescript
import {
  valueIsDefined,
  valueIsUndefined,
  parseBoolean,
  parse,
  evalValueOrFunction,
  callback,
  normalizeJson,
  clone,
  setCloneStrategy,
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

evalValueOrFunction(10); // 10
evalValueOrFunction(() => 10); // 10 (unwraps a ValueOrFunction<T>)

callback(onChange, value); // invokes onChange(value) when it is a function, otherwise undefined

normalizeJson({ name: 'Daniel', age: undefined, city: null }); // { name: 'Daniel' } (drops null/undefined fields recursively)

clone(user); // deep clone (with optional field overrides)
clone(user, { name: 'Andrés' }); // deep clone + override

setCloneStrategy((_, key) => key !== 'password'); // fields skipped by every clone (CloneStrategy)

freeze(config); // deep Object.freeze
seal(config); // deep Object.seal

round(3.14159, 2); // 3.14 (also: ceil, floor, halfToEven)
```

`currencyFormat` formats a number using thousands separators (`.`) and an
optional symbol and decimal places. It receives an object with the shape
`{ value: number; decimals?: number; symbol?: string }`:

```typescript
currencyFormat({ value: 1234567.89, decimals: 2, symbol: '$' });
// '$ 1.234.567,89'
```

`createDebouncedTimeout` returns a reusable debouncer (`DebouncedTimeout`) —
each `schedule` cancels the pending callback and restarts the timer:

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
import { bigDecimal, roundStrategy } from '@rolster/commons';

const price = bigDecimal('0.1').plus('0.2');
price.toString(); // '0.3'
price.data; // 0.3 (as native number)

bigDecimal(1500).percentage(19).data; // IVA: 285
bigDecimal('10').divide(3, 4).toString(); // '3.3333' (second argument: precision, default 15)

const total = bigDecimal('99.99').multiply(3);
total.greaterThan(250); // true
total.round(0).toString(); // '300'

roundStrategy({ precision: 2, roundMode: 'half-to-even' }); // default strategy used by `rounded`
bigDecimal('3.14159').rounded; // 3.14
```

Available operations: `plus`, `minus`, `multiply`, `divide`, `percentage`,
`abs`, `negative`; rounding: `round`, `ceil`, `floor`, `halfToEven`,
`roundWith(strategy)` and the `rounded` getter (both return a native number);
comparisons: `equals`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`,
`lessThanOrEqualTo`, `isZero`, `isPositive`, `isNegative`. The `roundMode` of
a strategy is one of `'round' | 'ceil' | 'floor' | 'half-to-even'`.

### Observable

A tiny synchronous observable to broadcast values to multiple subscribers. Use
`subscribe` to also receive the current value immediately, or `listen` to only
receive future values. Values are deep-frozen before being emitted, so every
`Observer<T>` receives a `Readonly<T>`.

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
import {
  Queque,
  SecureMap,
  Criteria,
  Criterias,
  SelectionSet
} from '@rolster/commons';

// FIFO queue (linked list)
const queue = Queque.fromArray([1, 2, 3]);
queue.enqueue(4);
queue.dequeue(); // 1
queue.length; // 3

// Map that lazily builds a default value when a key is missing
const groups = new SecureMap<string[]>(() => []);
groups.request('admins').push('Daniel');

// Comparable set of key/value criteria
const filter = Criterias.fromLiteralObject({
  status: 'active',
  city: 'Bogotá'
});
filter.value('status'); // 'active'
filter.toLiteralObject(); // { status: 'active', city: 'Bogotá' }

// Criterias can also be built one by one, from a key/value pair or from a
// `Criteria` (any `AbstractCriteria` implementation with its own `equals`)
const other = new Criterias<{ status: string; city: string }>()
  .append('status', 'active')
  .append(new Criteria('city', 'Bogotá'));

other.request('status')?.equals('active'); // true
other.equals(filter); // true (same keys and equal values)

// Immutable selection of any kind of value; every command returns a new
// instance, or the same one when the operation changes nothing
const tags = new SelectionSet(['pending']); // default comparator: ===
tags.toggle('urgent').values; // ['pending', 'urgent']

const articles = new SelectionSet<Article>([], (a, b) => a.uuid === b.uuid);
articles.select(article).contains({ ...article, name: 'Changed' }); // true

articles.containsAll(page); // every value of the page is selected
articles.containsAny(page); // for the indeterminate state of a checkbox
articles.toggleAll(page); // selects the pending ones, or unselects them all
articles.refresh(page); // retains only what is still present
articles.clear(); // discards everything
```

### Promises

```typescript
import {
  delayPromise,
  fromPromise,
  rethrow,
  silence,
  unawaited,
  zipPromise
} from '@rolster/commons';

await delayPromise(() => 'done', 1000); // resolves with 'done' after 1s (the factory may also return a promise)

fromPromise(42); // Promise<number> (wraps a value or passes a promise through)

await rethrow(request(), (err) => log(err)); // reports the error, then throws it again
await silence(request(), (err) => log(err)); // reports the error and resolves with undefined
await unawaited(request()); // the value, or undefined when the promise rejects

// Runs the factories one after another and collects the results as a tuple
const [user, orders] = await zipPromise([
  () => findUser(id),
  () => findOrders(id)
]);

await zipPromise([() => findUser(id), () => findOrders(id)], {
  continueOnError: true,
  errorValue: null
}); // a rejected factory yields `errorValue` instead of aborting the whole zip
```

`securePromise` builds a lazy, memoized promise (`SecurePromise<T>`): the
callback runs on the first `resolve()` and the same promise is reused until
`reset()` or `refresh()`. A rejected callback is not memoized, so the next
`resolve()` executes it again; the optional `catchError` may return a fallback
value to resolve with instead of rethrowing.

```typescript
import { securePromise, securePromiseOfValue } from '@rolster/commons';

const session = securePromise(
  () => fetchSession(),
  (err) => {
    log(err);
    return undefined; // return a value here to resolve with it
  }
);

await session.resolve(); // executes fetchSession()
await session.resolve(); // reuses the previous result

session.isInstanced(); // true once resolve() has been called
session.isRequesting(); // true while the callback is pending
session.isResolved(); // true
session.isError(); // false

session.reset(); // forgets the promise, the next resolve() executes again
await session.refresh(); // reset() + resolve()

securePromiseOfValue(42).resolve(); // Promise<number>
```

### Streams

`stream` wraps a promise into an observable of `Stream` states
(`loading` → `success` | `failure`). `Stream` is a `SealedPartial`, so `when`
receives a partial resolver and `is(key)` checks the current phase.
`streamValue` subscribes with the resolver directly and `streamStatus` emits a
plain status object.

```typescript
import { stream, streamValue, streamStatus } from '@rolster/commons';

stream(findUsers()).subscribe((state) => {
  state.when({
    loading: () => showSpinner(),
    success: ({ response, responseTime }) => render(response, responseTime),
    failure: (error) => showError(error)
  });
});

streamValue(findUsers()).subscribe({
  success: ({ response }) => render(response)
});

streamStatus(findUsers()).subscribe((status) => {
  status.isLoading; // boolean
  status.isSuccessful; // boolean
  status.isError; // boolean
  status.value; // the response when successful
  status.error; // the error when failed
});
```

### Result types

Expressive alternatives to throwing or returning `null`.

**Optional** — model a possibly-absent value:

```typescript
import { Optional } from '@rolster/commons';

const user = Optional.build(findUser(id)); // present unless the value is null/undefined

Optional.of(value); // always present, throws when value is null/undefined
Optional.empty<User>(); // always empty

user.when(
  (value) => render(value), // present
  () => renderNotFound() // empty
);

user.present((value) => log(value));
user.empty(() => renderNotFound());

user.isPresent();
user.isEmpty();
user.get(); // the value, throws when empty
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

**Sealed** — base classes to build your own tagged states. A sealed value holds
a key and an optional payload; `when(resolver)` runs the handler registered for
that key and `is(key)` checks it. The resolver is a `SealedState<R>` (a record
of handlers returning `R`). `Sealed.when` requires a handler for every key and
throws when the current one is missing; `SealedPartial.when` accepts a partial
resolver and returns `undefined` instead. Both constructors are protected, so
they are meant to be extended through static factories, as `ViewState` and
`Stream` do.

**ViewState / ReportState** — ready-made `Sealed` states for UI rendering.
`ViewState` covers `loading`, `success`, `empty` and `failure`; `ReportState`
adds a `welcome` phase. Each static factory receives the payload of its phase:

```typescript
import { ViewState } from '@rolster/commons';

let state: ViewState<void, User[], void, Error> = ViewState.loading();

findUsers()
  .then((users) => {
    state = users.length ? ViewState.success(users) : ViewState.empty();
  })
  .catch((error) => {
    state = ViewState.failure(error);
  });

state.when({
  loading: () => renderSpinner(),
  success: (users) => renderList(users),
  empty: () => renderEmpty(),
  failure: (error) => renderError(error)
});

state.is('success'); // boolean
```

### DOM helpers

Browser-only utilities, exported from the `@rolster/commons/dom` subpath:

```typescript
import {
  base64ToBlob,
  downloadBlob,
  ScrollerElement
} from '@rolster/commons/dom';

const blob = base64ToBlob(data64, 'application/pdf'); // accepts plain base64 or a data URI
downloadBlob(blob, 'report.pdf'); // triggers a browser download of the blob

const scroller = new ScrollerElement(element, 2); // second argument: tolerance in px for the *End getters
scroller.verticalEnd; // true when scrolled to the bottom
scroller.horizontalStart; // true when scrollLeft is 0
```

`ScrollerElement` wraps an `HTMLElement` and exposes read-only getters:
`scrollWidth`, `scrollHeight`, `scrollLeft`, `scrollTop`, `clientWidth`,
`clientHeight`, `verticalStart`, `verticalEnd`, `verticalPercentage`,
`horizontalStart`, `horizontalEnd` and `horizontalPercentage`.

### Types

Exported types that appear in the public signatures:

| Type                                   | Used by                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `CloneStrategy<T>`, `CloneOverride<T>` | `setCloneStrategy(strategy)` and the `overrides` argument of `clone`    |
| `DebouncedTimeout`                     | Return type of `createDebouncedTimeout`                                 |
| `Observer<T>`, `Observable<T>`         | `observable(value)` and its `subscribe` / `listen` callbacks            |
| `SelectionEquals<T>`                   | Comparator of `SelectionSet`                                            |
| `AbstractCriteria<T, O>`               | Contract accepted by `Criterias.append`; implemented by `Criteria`      |
| `CriteriaKey`, `CriteriaCallback`      | `Criteria.assign(callback)`                                             |
| `SecurePromise<T>`                     | Return type of `securePromise` and `securePromiseOfValue`               |
| `SealedState<R>`                       | Resolver shape of `Sealed`, `SealedPartial`, `ViewState`, `ReportState` |

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:
