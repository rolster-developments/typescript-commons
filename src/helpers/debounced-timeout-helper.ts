export interface DebouncedTimeout {
  cancel(): void;
  schedule(callback: () => void, delay?: number): void;
}

export function createDebouncedTimeout(delay?: number): DebouncedTimeout {
  let timeoutId: any = undefined;

  function cancel(): void {
    timeoutId && clearTimeout(timeoutId);
  }

  function schedule(callback: () => void, _delay?: number): void {
    cancel();

    timeoutId = setTimeout(callback, _delay || delay);
  }

  return { cancel, schedule };
}
