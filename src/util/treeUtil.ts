type NodeType<T, ChildKey extends keyof T> = {
  [key in ChildKey]: T[] | null | undefined
}

/**
 * 查找树上的节点
 * @param nodes 树
 * @param predicate
 * @param childKey 子节点键名（默认children）
 */
export function treeFind<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], predicate: (node: T, parent?: T) => boolean, childKey = 'children' as ChildKey): T | undefined {
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
 * 查找树上的节点（内部子方法，实现回调中返回父节点）
 * @param nodes 树
 * @param predicate
 * @param parent
 * @param childKey 子节点键名（默认children）
 */
function _treeFind<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], predicate: (node: T, parent?: T) => boolean, parent?: T, childKey = 'children' as ChildKey): T | undefined {
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
 * 遍历树上的节点
 * @param nodes 树
 * @param callback 遍历节点的回调方法
 * @param childKey 子节点键名（默认children）
 */
export function treeForEach<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => void, childKey = 'children' as ChildKey) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    callback(node);
    const childNodes = node[childKey];
    if (childNodes)
      _treeForEach(childNodes, callback, node, childKey)
  }
}

/**
 * 遍历树上的节点（内部子方法，实现回调中返回父节点）
 * @param nodes 树
 * @param callback 遍历节点的回调方法
 * @param parent 节点的父节点
 * @param childKey 子节点键名（默认children）
 */
function _treeForEach<T extends NodeType<T, ChildKey>, R extends NodeType<R, ChildKey>, ChildKey extends string = 'children'>(nodes: T[], callback: (node: T, parent?: T) => void, parent?: T, childKey = 'children' as ChildKey) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    callback(node, parent);
    const childNodes = node[childKey];
    if (childNodes)
      _treeForEach(childNodes, callback, node, childKey)
  }
}

/**
 * 遍历树上的节点，并返回新的树
 * @param nodes 树
 * @param callback 遍历节点的回调方法
 * @param childKey 子节点键名（默认children）
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
 * 遍历树上的节点，并返回新的树（内部子方法，实现回调中返回父节点）
 * @param nodes 树
 * @param callback 遍历节点的回调方法
 * @param parent 节点的父节点
 * @param childKey 子节点键名（默认children）
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