export class SecureMap<V = any, K = string> extends Map<K, V> {
  constructor(private factory: () => V) {
    super();
  }

  public request(key: K, value?: V): V {
    let _value = this.get(key);

    if (!_value) {
      _value = value ?? this.factory();

      this.set(key, _value);
    }

    return _value;
  }
}
