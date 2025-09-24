import {describe, expect, test} from 'vitest';
import {treeFind, treeForEach, treeMap} from "./treeUtil";

interface TreeNodeA {
  id: number,
  name: string,
  children: TreeNodeA[] | null,
}

interface TreeNodeB {
  key: string,
  name: string,
  list: TreeNodeB[] | null | undefined,
}

interface TreeNodeC extends TreeNodeA {
  parentID?: number,
}

describe('树测试', () => {
  const treeDataA: TreeNodeA[] = [
    {
      id: 1, name: '1', children: [
        {id: 2, name: '2', children: null},
        {id: 3, name: '3', children: null}
      ]
    },
    {
      id: 4, name: '4', children: [
        {id: 5, name: '5', children: null},
        {id: 6, name: '6', children: null}
      ]
    }
  ]
  const treeDataB: TreeNodeB[] = [
    {
      key: '1', name: '1', list: [
        {key: '2', name: '2', list: null}
      ]
    }, {
      key: '3', name: '3', list: [
        {key: '4', name: '4', list: null},
        {
          key: '5', name: '5', list: [
            {key: '6', name: '6', list: null},
            {key: '7', name: '7', list: null}
          ]
        }
      ]
    }
  ]

  test('查找id3', () => {
    expect(treeFind(treeDataA, x => x.id === 3 && !x.children)).toHaveProperty('name', '3');
  });
  test('查找顶层id3', () => {
    expect(treeFind(treeDataA, (x, y) => x.id === 3 && !y)).toBeUndefined();
  });
  test('查找id7', () => {
    expect(treeFind(treeDataB, x => x.key === '7', 'list')).toHaveProperty('name', '7');
  })
  test('查找不到', () => {
    expect(treeFind(treeDataB, x => x.key === '8', 'list')).toBeUndefined();
  });

  test('树遍历', () => {
    expect((() => {
      let count = 0;
      treeForEach(treeDataA, x => count += x.id);
      return count
    })()).toBe(21)
  })

  test('树遍历，并返回新树', () => {
    expect(treeMap(treeDataA, (node, parent) => {
      return {
        ...node,
        parentID: parent?.id
      } as TreeNodeC
    })).toContainEqual({
      "children": [{
        "children": null,
        "id": 2,
        "name": "2",
        "parentID": 1
      }, {
        "children": null,
        "id": 3,
        "name": "3",
        "parentID": 1
      }],
      "id": 1,
      "name": "1",
      "parentID": undefined
    })
  })

  test('树遍历，children 转换为 list', () => {
    const mapped = treeMap<TreeNodeA, TreeNodeB, 'children', 'list'>(
      treeDataA,
      (node) => ({
        key: String(node.id),
        name: node.name,
        list: undefined
      }),
      'children', // 源树的子节点 key
      'list'      // 新树的子节点 key
    )

    expect(mapped[0]).toMatchObject({
      key: '1',
      name: '1',
      list: [
        {key: '2', name: '2', list: null},
        {key: '3', name: '3', list: null}
      ]
    })
  })
})