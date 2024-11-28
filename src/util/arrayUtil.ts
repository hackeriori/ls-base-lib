/**
 * 快速移除数组中的指定元素。（注意：数组必须是无序数组，移除操作会破坏数组原有的排序）
 *
 * @param array - 需要操作的数组。
 * @param index - 要移除元素的位置索引。
 * @returns 无返回值，直接在原数组上修改。
 *
 * @example
 * let arr = [1, 2, 3, 4];
 * arrRemove(arr, 1); // 移除索引为1的元素（2）
 * console.log(arr); // 输出: [1, 4, 3]
 */
export function arrRemove(array: any[], index: number): void {
  array[index] = array[array.length - 1];
  array.pop();
}

/**
 * 根据指定的键选择器，对数组进行分组。
 *
 * @template K - 分组键的类型。
 * @template T - 数组元素的类型。
 * @param items - 待分组的数组。
 * @param keySelector - 用于选择分组键的函数。
 * @returns 包含分组结果的 Map，其中键是分组键，值是具有相同键的元素数组。
 *
 * @example
 * const items = [
 *   { id: 1, category: 'fruit' },
 *   { id: 2, category: 'vegetable' },
 *   { id: 3, category: 'fruit' }
 * ];
 *
 * const groupedItems = arrGroupBy(items, item => item.category);
 * console.log(groupedItems);
 * // 输出:
 * // Map {
 * //   'fruit' => [ { id: 1, category: 'fruit' }, { id: 3, category: 'fruit' } ],
 * //   'vegetable' => [ { id: 2, category: 'vegetable' } ]
 * // }
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