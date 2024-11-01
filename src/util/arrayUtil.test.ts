import {describe, expect, test} from 'vitest';
import {arrGroupBy, arrRemove} from './arrayUtil';

describe("数组移除测试", () => {
  const smallMax = 100000;
  const arr1 = new Array(smallMax).fill(0).map((_item, index) => index);
  const arr2 = new Array(smallMax).fill(0).map((_item, index) => index);

  test("使用传统方法移除第一项，注意看时间", () => {
    for (let i = 0; i < smallMax; i++) {
      arr1.splice(0, 1);
    }
    expect(arr1.length).toBe(0);
  })
  test("使用无序移除方法移除第一项，注意看时间", () => {
    for (let i = 0; i < smallMax; i++) {
      arrRemove(arr2, 0);
    }
    expect(arr2.length).toBe(0);
  })
})

describe('数组分组测试', () => {
  const result = arrGroupBy([{
    name: '张三',
    age: 18,
    gender: '男'
  }, {
    name: '李四',
    age: 19,
    gender: '男'
  }, {
    name: '王五',
    age: 20,
    gender: '女'
  }], x => x.gender);
  test('分组正确性', () => {
    expect(result.get('女')?.length).toBe(1);
    expect(result.get('男')?.length).toBe(2);
    expect(result.get('女')![0].name).toBe('王五');
  })
})