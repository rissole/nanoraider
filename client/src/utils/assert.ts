export function invariant(condition: unknown, message: string): asserts condition {
  if (condition == false) {
    throw new Error(message);
  }
}

export function assertExhausted(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}