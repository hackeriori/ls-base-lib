import {describe, expect, test} from 'vitest';
import {vueGetParamFromQuery, VueInjectHelper, VueMixinMethods} from "./vueUtil";
import type {Equal, Expect} from "../toolTypes";

describe('测试从query中获取参数', () => {
  const query = {
    a: '111',
    b: ['222', '333'],
  };
  test('目标参数为字符串', () => {
    expect(vueGetParamFromQuery(query, 'a')).toBe('111');
  });
  test('目标参数为字符串数组', () => {
    expect(vueGetParamFromQuery(query, 'b')).toBe('222');
  });
  test('无目标参数', () => {
    expect(vueGetParamFromQuery(query, 'c')).toBeNull();
  });
})

describe('测试inject混合方法', () => {
  type ProvideType = {
    name: string,
    age: number,
    eat(): void
  }
  const injectHelper = new VueInjectHelper<ProvideType>();
  const inject = injectHelper.push('name').push('eat').getArray();
  test('inject为字符串数组', () => {
    expect(inject).toEqual(['name', 'eat']);
  });
  type cases = [
    Expect<Equal<typeof inject, ['name', 'eat']>>,
    Expect<Equal<VueMixinMethods<ProvideType, typeof inject>, Partial<Omit<ProvideType, 'age'>>>>
  ]
})
