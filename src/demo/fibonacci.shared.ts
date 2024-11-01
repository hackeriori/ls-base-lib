export function fibonacci(n: number): number {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export interface MessageType {
  taskNumber: number,
  fibonacciNumber: number
}