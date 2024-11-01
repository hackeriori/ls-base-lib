/**
 * 从数组中移除一项，注意数组必须是无序数组
 * @param array 数组
 * @param index 移除项的序号
 */
export function arrRemove(array: any[], index: number) {
  array[index] = array[array.length - 1];
  array.pop();
}

/**
 * 数组分组，将一个数组转换为Map对象
 * @param items 待分组的数组
 * @param keySelector 分组的回调方法，返回Map的key
 */
export function arrGroupBy<K, T>(items: T[], keySelector: (item: T, index: number) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (let i = 0; i < items.length; i++) {
    const key = keySelector(items[i], i);
    const value = map.get(key)
    if (value) {
      value.push(items[i]);
    } else {
      map.set(key, [items[i]]);
    }
  }
  return map;
}