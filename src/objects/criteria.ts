type CriteriaKey = string | number | symbol;
type CallbackCriteria = (key: CriteriaKey, value: any) => void;

export interface AbstractCriteria<
  T = any,
  O extends LiteralObject = LiteralObject
> {
  assign(callback: CallbackCriteria): void;
  equals(value: T): boolean;
  key: keyof O;
  value: T;
}

export class Criteria<T = any, O extends LiteralObject = LiteralObject>
  implements AbstractCriteria<T, O>
{
  constructor(
    public readonly key: keyof O,
    public readonly value: T
  ) {}

  public assign(callback: CallbackCriteria): void {
    callback(this.key, this.value);
  }

  public equals(value: T): boolean {
    return this.value === value;
  }
}

export class Criterias<O extends LiteralObject = LiteralObject> {
  private collection: Map<string | number | symbol, AbstractCriteria<any, O>>;

  constructor() {
    this.collection = new Map();
  }

  public append<T = any>(criteria: AbstractCriteria<T>): this;
  public append<T = any>(key: keyof O, value: T): this;
  public append<T = any>(
    data: keyof O | AbstractCriteria<T, O>,
    value?: T
  ): this {
    if (
      typeof data === 'string' ||
      typeof data === 'number' ||
      typeof data === 'symbol'
    ) {
      this.collection.set(data, new Criteria<any, O>(data, value));
    } else {
      this.collection.set(data.key, data);
    }

    return this;
  }

  public request<T = any>(key: keyof O): Undefined<AbstractCriteria<T>> {
    return this.collection.get(key);
  }

  public value<T = any>(key: keyof O): Undefined<T> {
    return this.request(key)?.value;
  }

  public equals({ collection }: Criterias<O>): boolean {
    if (this.collection.size !== collection.size) {
      return false;
    }

    const criterias = Array.from(collection.values());

    let equals = true;
    let index = 0;

    while (equals && index < criterias.length) {
      const { key, value } = criterias[index];

      const criteria = this.request(key);

      equals = equals && !!criteria && criteria.equals(value);

      index++;
    }

    return equals;
  }

  public toLiteralObject(): LiteralObject {
    const payload: LiteralObject = {};

    function assign(key: keyof O, value: any) {
      payload[key] = value;
    }

    this.collection.forEach((criteria) => {
      criteria.assign(assign);
    });

    return payload;
  }

  public static fromLiteralObject<O extends LiteralObject>(
    object: O
  ): Criterias<O> {
    const criterias = new Criterias<O>();

    Object.entries(object).forEach(([key, value]) => {
      criterias.append(key, value);
    });

    return criterias;
  }
}
