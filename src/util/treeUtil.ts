import type {NodeType} from './types';

/**
 * 在树形结构中查找符合条件的节点。
 *
 * @param nodes - 要搜索的节点数组。
 * @param predicate - 用于判断节点是否符合条件的函数。接收当前节点和父节点作为参数，返回布尔值。
 * @param childKey - 子节点的键名，默认为 'children'。
 * @returns 符合条件的第一个节点，如果没有找到则返回 undefined。
 *
 * @example
 * ```typescript
 * const nodes = [
 *   { id: 1, name: 'Node 1', children: [] },
 *   { id: 2, name: 'Node 2', children: [
 *     { id: 3, name: 'Node 2-1', children: [] }
 *   ]}
 * ];
 *
 * const result = treeFind(nodes, (node) => node.id === 3);
 * console.log(result); // 输出: { id: 3, name: 'Node 2-1', children: [] }
 * ```
 */
export function treeFind<T extends NodeType<T, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], predicate: (node: T, parent?: T) => boolean, childKey = 'children' as ChildKey): T | undefined {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (predicate(node))
      return node;
    else {
      const childNodes = node[childKey];
      if (childNodes) {
        const result = _treeFind(childNodes, predicate, node, childKey);
        if (result)
          return result
      }
    }
  }
}



/**
 * 在树形结构中查找符合条件的节点（递归实现）。
 *
 * @param nodes - 要搜索的节点数组。
 * @param predicate - 用于判断节点是否符合条件的函数。接收当前节点和父节点作为参数，返回布尔值。
 * @param parent - 当前节点的父节点。
 * @param childKey - 子节点的键名，默认为 'children'。
 * @returns 符合条件的第一个节点，如果没有找到则返回 undefined。
 */
function _treeFind<T extends NodeType<T, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], predicate: (node: T, parent?: T) => boolean, parent?: T, childKey = 'children' as ChildKey): T | undefined {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (predicate(node, parent))
      return node;
    else {
      const childNodes = node[childKey];
      if (childNodes) {
        const result = _treeFind(childNodes, predicate, node, childKey);
        if (result)
          return result
      }
    }
  }
}

/**
 * 遍历树形结构中的每个节点。
 *
 * @param nodes - 要遍历的根节点数组。
 * @param callback - 每个节点都会调用的回调函数，可以访问当前节点和父节点（如果有的话）。
 * @param childKey - 表示子节点的属性名，默认为 'children'。
 *
 * @example
 * const data = [
 *   {
 *     id: 1,
 *     children: [
 *       { id: 2 },
 *       { id: 3 }
 *     ]
 *   }
 * ];
 *
 * treeForEach(data, node => {
 *   console.log(node.id);
 * });
 */
export function treeForEach<T extends NodeType<T, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => void, childKey = 'children' as ChildKey) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    callback(node);
    const childNodes = node[childKey];
    if (childNodes)
      _treeForEach(childNodes, callback, node, childKey)
  }
}

/**
 * 内部递归函数，用于遍历树形结构。
 *
 * @param nodes - 要遍历的根节点数组。
 * @param callback - 每个节点都会调用的回调函数，可以访问当前节点和父节点（如果有的话）。
 * @param parent - 当前节点的父节点。
 * @param childKey - 表示子节点的属性名，默认为 'children'。
 */
function _treeForEach<T extends NodeType<T, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => void, parent?: T, childKey = 'children' as ChildKey) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    callback(node, parent);
    const childNodes = node[childKey];
    if (childNodes)
      _treeForEach(childNodes, callback, node, childKey)
  }
}

/**
 * 将树形结构中的每个节点转换为新的类型。
 *
 * @param nodes - 要转换的节点数组。
 * @param callback - 回调函数，用于定义如何将每个节点转换为新类型。
 * @param childKey - 子节点键，默认为 'children'。
 * @returns 转换后的节点数组。
 *
 * @example
 * const nodes = [
 *   {
 *     name: 'Root',
 *     children: [
 *       { name: 'Child1' },
 *       { name: 'Child2' }
 *     ]
 *   }
 * ];
 *
 * const mappedNodes = treeMap(nodes, node => ({
 *   nickname: node.name.toUpperCase()
 * }));
 *
 * console.log(mappedNodes);
 * // 输出:
 * // [
 * //   {
 * //     nickname: 'ROOT',
 * //     children: [
 * //       { nickname: 'CHILD1' },
 * //       { nickname: 'CHILD2' }
 * //     ]
 * //   }
 * // ]
 */
export function treeMap<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => R, childKey = 'children' as ChildKey): R[] {
  const results: R[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const childNodes = node[childKey];
    const result = callback(node);
    let resultChild: R[ChildKey]
    if (childNodes)
      resultChild = _treeMap(childNodes, callback, node, childKey) as any;
    else
      resultChild = childNodes as any;
    result[childKey] = resultChild;
    results.push(result);
  }
  return results;
}

/**
 * 内部函数，用于递归地将树形结构中的每个节点转换为新的类型。
 *
 * @param nodes - 要转换的节点数组。
 * @param callback - 回调函数，用于定义如何将每个节点转换为新类型。
 * @param parent - 父节点，默认为 undefined。
 * @param childKey - 子节点键，默认为 'children'。
 * @returns 转换后的节点数组。
 */
function _treeMap<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => R, parent?: T, childKey = 'children' as ChildKey): R[] {
  const results: R[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const childNodes = node[childKey];
    const result = callback(node, parent);
    let resultChild: R[ChildKey]
    if (childNodes)
      resultChild = _treeMap(childNodes, callback, node, childKey) as any;
    else
      resultChild = childNodes as any;
    result[childKey] = resultChild;
    results.push(result);
  }
  return results;
}