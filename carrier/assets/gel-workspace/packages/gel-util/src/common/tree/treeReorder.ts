/**
 * 树形结构排序操作工具函数
 * 提供节点重排序、移动等操作方法
 */

import type { TreeNode } from './treeTypes'

/**
 * 重排序变更记录
 */
export interface TreeReorderChange {
  nodeId: string
  oldIndex: number
  newIndex: number
}

/**
 * 重排序操作结果
 */
export interface TreeReorderResult<T> {
  nodes: T[]
  changes: TreeReorderChange[]
}

/**
 * 浅克隆节点数组（保持子节点引用）
 */
const cloneNodesShallow = <T extends TreeNode<T>>(nodes: T[], childrenKey: keyof T = 'children' as keyof T): T[] =>
  nodes.map((node) => ({
    ...node,
    [childrenKey]: node[childrenKey] ? [...(node[childrenKey] as T[])] : undefined,
  }))

/**
 * 在同级节点间移动位置
 *
 * @template T 节点数据类型
 * @param nodes 同级节点数组
 * @param fromIndex 源位置索引
 * @param toIndex 目标位置索引
 * @param getNodeId 获取节点ID的函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 重排序结果，包含更新后的节点数组和变更记录
 *
 * @example
 * ```typescript
 * const result = moveSiblingNode(chapters, 0, 2, node => node.id)
 * // 将索引0的节点移动到索引2的位置
 * ```
 */
export const moveSiblingNode = <T extends TreeNode<T>>(
  nodes: T[],
  fromIndex: number,
  toIndex: number,
  getNodeId: (node: T) => string,
  childrenKey: keyof T = 'children' as keyof T
): TreeReorderResult<T> => {
  try {
    if (fromIndex === toIndex) {
      return { nodes: [...nodes], changes: [] }
    }

    const updated = cloneNodesShallow(nodes, childrenKey)
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)

    return {
      nodes: updated,
      changes: [
        {
          nodeId: getNodeId(moved),
          oldIndex: fromIndex,
          newIndex: toIndex,
        },
      ],
    }
  } catch (error) {
    console.error('Error moving sibling node:', error)
    return { nodes: [...nodes], changes: [] }
  }
}

/**
 * 在同级节点列表中插入新节点
 *
 * @template T 节点数据类型
 * @param nodes 同级节点数组
 * @param index 插入位置索引
 * @param newNode 要插入的新节点
 * @param getNodeId 获取节点ID的函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 重排序结果，包含更新后的节点数组和变更记录
 *
 * @example
 * ```typescript
 * const result = insertSiblingNode(chapters, 1, newChapter, node => node.id)
 * // 在索引1的位置插入新节点
 * ```
 */
export const insertSiblingNode = <T extends TreeNode<T>>(
  nodes: T[],
  index: number,
  newNode: T,
  getNodeId: (node: T) => string,
  childrenKey: keyof T = 'children' as keyof T
): TreeReorderResult<T> => {
  try {
    const updated = cloneNodesShallow(nodes, childrenKey)
    updated.splice(index, 0, newNode)

    return {
      nodes: updated,
      changes: [
        {
          nodeId: getNodeId(newNode),
          oldIndex: -1,
          newIndex: index,
        },
      ],
    }
  } catch (error) {
    console.error('Error inserting sibling node:', error)
    return { nodes: [...nodes], changes: [] }
  }
}

/**
 * 从同级节点列表中移除节点
 *
 * @template T 节点数据类型
 * @param nodes 同级节点数组
 * @param index 要移除的节点索引
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 移除结果，包含更新后的节点数组和被移除的节点
 *
 * @example
 * ```typescript
 * const result = removeSiblingNode(chapters, 1)
 * // 移除索引1的节点
 * ```
 */
export const removeSiblingNode = <T extends TreeNode<T>>(
  nodes: T[],
  index: number,
  childrenKey: keyof T = 'children' as keyof T
): { nodes: T[]; removed?: T } => {
  try {
    const updated = cloneNodesShallow(nodes, childrenKey)
    if (index < 0 || index >= updated.length) {
      return { nodes: updated }
    }

    const [removed] = updated.splice(index, 1)
    return { nodes: updated, removed }
  } catch (error) {
    console.error('Error removing sibling node:', error)
    return { nodes: [...nodes] }
  }
}

/**
 * 批量重排序节点
 *
 * @template T 节点数据类型
 * @param nodes 同级节点数组
 * @param newOrder 新的节点顺序（节点ID数组）
 * @param getNodeId 获取节点ID的函数
 * @param _childrenKey 子节点属性名，默认为 'children'
 * @returns 重排序结果，包含更新后的节点数组和变更记录
 *
 * @example
 * ```typescript
 * const result = reorderNodes(chapters, ['id3', 'id1', 'id2'], node => node.id)
 * // 按照指定的ID顺序重新排列节点
 * ```
 */
export const reorderNodes = <T extends TreeNode<T>>(
  nodes: T[],
  newOrder: string[],
  getNodeId: (node: T) => string,
  _childrenKey: keyof T = 'children' as keyof T
): TreeReorderResult<T> => {
  try {
    const nodeMap = new Map<string, T>()
    const changes: TreeReorderChange[] = []

    // 建立ID到节点的映射
    nodes.forEach((node, _index) => {
      const id = getNodeId(node)
      nodeMap.set(id, node)
    })

    // 按新顺序重排节点
    const reorderedNodes: T[] = []
    newOrder.forEach((id, newIndex) => {
      const node = nodeMap.get(id)
      if (node) {
        const oldIndex = nodes.findIndex((n) => getNodeId(n) === id)
        if (oldIndex !== newIndex) {
          changes.push({
            nodeId: id,
            oldIndex,
            newIndex,
          })
        }
        reorderedNodes.push(node)
      }
    })

    // 添加不在新顺序中的节点
    nodes.forEach((node) => {
      const id = getNodeId(node)
      if (!newOrder.includes(id)) {
        reorderedNodes.push(node)
      }
    })

    return {
      nodes: reorderedNodes,
      changes,
    }
  } catch (error) {
    console.error('Error reordering nodes:', error)
    return { nodes: [...nodes], changes: [] }
  }
}
