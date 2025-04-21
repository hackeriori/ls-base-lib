import {numFixed} from './numUtil';
import {describe, expect, test} from 'vitest';

describe('numFixed', () => {
  test('正常情况：保留两位小数', () => {
    expect(numFixed(3.14159)).toBe(3.14);
  });

  test('正常情况：保留三位小数', () => {
    expect(numFixed(3.14159, 3)).toBe(3.142);
  });

  test('边界情况：整数输入', () => {
    expect(numFixed(10)).toBe(10);
  });

  test('边界情况：有浮点误差', () => {
    const number = numFixed(1.005);
    expect(number).toBe(1.01);
    expect(number).not.toEqual(Math.round(1.005 * 100) / 100);
  });

  test('边界情况：有浮点误差', () => {
    const number = numFixed(-1.005);
    expect(number).toBe(-1.01);
    expect(number).not.toEqual(Math.round(-1.005 * 100) / 100);
  });
});