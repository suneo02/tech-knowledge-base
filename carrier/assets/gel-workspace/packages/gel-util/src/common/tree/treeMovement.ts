/**
 * 树形结构移动操作工具函数
 * 提供节点缩进、取消缩进等层级调整操作
 *
 * ## 核心设计原则
 *
 * ### 绝对层级不变原则
 * - **缩进（Indent）**：只移动目标节点本身，子节点保持在原位置且绝对层级不变
 * - **取消缩进（Unindent）**：只移动目标节点本身，子节点保持在原位置且绝对层级不变
 * - 子节点不会跟随父节点移动，它们的绝对层级和位置保持不变
 *
 * ### 操作示例
 * ```
 * 原始结构：
 * 1. 章节A        (level 1)
 * 2. 章节B        (level 1)
 *    2.1 子章节B1  (level 2)
 *    2.2 子章节B2  (level 2)
 * 3. 章节C        (level 1)
 *
 * 对"章节B"执行 Indent 后：
 * 1. 章节A        (level 1)
 *    1.1 章节B     (level 2) ← B移动到A下
 *    1.2 子章节B1  (level 2) ← B1也移动到A下，绝对层级不变
 *    1.3 子章节B2  (level 2) ← B2也移动到A下，绝对层级不变
 * 2. 章节C        (level 1)
 * ```
 *
 * ### 实现策略
 * - 使用深拷贝确保操作的不可变性
 * - 分离目标节点和子节点，单独处理
 * - 目标节点和子节点都移动到新的父节点下
 * - 子节点保持绝对层级不变，不再是目标节点的子节点
 */

import { cloneTree } from './factory'
import { getTreeNodeByPath } from './treeTraversal'
import type { TreeNode, TreePath } from './treeTypes'

/**
 * 类型守卫：检查值是否为树节点数组
 */
function isTreeNodeArray<T extends TreeNode<T>>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * 安全获取子节点数组
 */
function getChildrenArray<T extends TreeNode<T>>(node: T, childrenKey: keyof T): T[] {
  const children = node[childrenKey]
  return isTreeNodeArray<T>(children) ? children : []
}

/**
 * 将节点向右缩进（增加层级）
 * 只移动目标节点本身到前一个兄弟节点下，子节点保持在原位置且绝对层级不变
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 要缩进的节点路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 缩进后的树和新路径
 *
 * @example
 * ```typescript
 * // 原始: [A, B(B1, B2), C] -> 对B缩进 -> [A(B, B1, B2), C]
 * // B移动到A下变成level 2，B1和B2也移动到A下但保持level 2不变，不再是B的子节点
 * const result = indentNode(chapters, [1], 'children')
 * ```
 */
export const indentNode = <T extends TreeNode<T>>(
  nodes: T[],
  path: TreePath,
  childrenKey: keyof T = 'children' as keyof T
): { nodes: T[]; newPath: TreePath } => {
  try {
    if (path.length === 0) return { nodes, newPath: path }

    // 深拷贝整个树，确保完全独立
    const clonedNodes = cloneTree(nodes, childrenKey)

    if (path.length === 1) {
      // 处理根级别的节点缩进
      const itemIndex = path[0]
      if (itemIndex === 0 || itemIndex >= clonedNodes.length) {
        return { nodes, newPath: path }
      }

      const item = clonedNodes[itemIndex]
      const prevItem = clonedNodes[itemIndex - 1]

      if (!item || !prevItem) {
        return { nodes, newPath: path }
      }

      // 保存目标节点的子节点，它们将保持在原位置
      const itemChildren = getChildrenArray(item, childrenKey)

      // 创建一个没有子节点的目标节点副本（只移动节点本身）
      const itemWithoutChildren = { ...item }
      if (childrenKey in itemWithoutChildren) {
        delete itemWithoutChildren[childrenKey]
      }

      // 从原位置移除目标节点
      clonedNodes.splice(itemIndex, 1)

      // 将目标节点（不带子节点）和原来的子节点都添加到前一个兄弟的子节点中
      const prevChildren = getChildrenArray(prevItem, childrenKey)
      const newPrevChildren = [...prevChildren, itemWithoutChildren, ...itemChildren]

      // 创建新的前一个节点，包含更新的子节点
      const updatedPrevItem = { ...prevItem, [childrenKey]: newPrevChildren }
      clonedNodes[itemIndex - 1] = updatedPrevItem

      const newPath = [itemIndex - 1, prevChildren.length]
      return { nodes: clonedNodes, newPath }
    } else {
      // 处理深层嵌套的节点缩进
      const parentPath = path.slice(0, -1)
      const itemIndex = path[path.length - 1]

      const targetNode = getTreeNodeByPath(clonedNodes, path, childrenKey)
      const parentNode = getTreeNodeByPath(clonedNodes, parentPath, childrenKey)

      if (!targetNode || !parentNode) {
        return { nodes, newPath: path }
      }

      const parentChildren = getChildrenArray(parentNode, childrenKey)
      if (itemIndex === 0 || itemIndex >= parentChildren.length) {
        return { nodes, newPath: path }
      }

      const prevSiblingIndex = itemIndex - 1
      const prevSibling = parentChildren[prevSiblingIndex]

      if (!prevSibling) {
        return { nodes, newPath: path }
      }

      // 保存目标节点的子节点，它们将保持在原位置
      const targetChildren = getChildrenArray(targetNode, childrenKey)

      // 创建一个没有子节点的目标节点副本（只移动节点本身）
      const targetWithoutChildren = { ...targetNode }
      if (childrenKey in targetWithoutChildren) {
        delete targetWithoutChildren[childrenKey]
      }

      // 从父节点的子节点中移除目标节点
      parentChildren.splice(itemIndex, 1)

      // 将目标节点（不带子节点）和原来的子节点都添加到前一个兄弟的子节点中
      const prevSiblingChildren = getChildrenArray(prevSibling, childrenKey)
      const newPrevSiblingChildren = [...prevSiblingChildren, targetWithoutChildren, ...targetChildren]

      // 更新前一个兄弟节点的子节点
      const updatedPrevSibling = { ...prevSibling, [childrenKey]: newPrevSiblingChildren }
      parentChildren[prevSiblingIndex] = updatedPrevSibling

      const newPath = [...parentPath, prevSiblingIndex, prevSiblingChildren.length]
      return { nodes: clonedNodes, newPath }
    }
  } catch (error) {
    console.error('Error indenting node:', error)
    return { nodes, newPath: path }
  }
}

/**
 * 将节点向左取消缩进（减少层级）
 * 只移动目标节点本身到父节点的同级，子节点保持在原位置且绝对层级不变
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 要取消缩进的节点路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 取消缩进后的树和新路径
 *
 * @example
 * ```typescript
 * // 原始: [A(B(B1, B2)), C] -> 对B取消缩进 -> [A, B, B1, B2, C]
 * // B提升到level 1，B1和B2也提升到level 1，但不再是B的子节点
 * const result = unindentNode(chapters, [0, 0], 'children')
 * ```
 */
export const unindentNode = <T extends TreeNode<T>>(
  nodes: T[],
  path: TreePath,
  childrenKey: keyof T = 'children' as keyof T
): { nodes: T[]; newPath: TreePath } => {
  try {
    if (path.length <= 1) {
      return { nodes, newPath: path }
    }

    // 深拷贝整个树，确保完全独立
    const clonedNodes = cloneTree(nodes, childrenKey)

    const parentPath = path.slice(0, -1)
    const itemIndex = path[path.length - 1]

    const targetNode = getTreeNodeByPath(clonedNodes, path, childrenKey)
    const parentNode = getTreeNodeByPath(clonedNodes, parentPath, childrenKey)

    if (!targetNode || !parentNode) {
      return { nodes, newPath: path }
    }

    const parentChildren = getChildrenArray(parentNode, childrenKey)
    if (itemIndex >= parentChildren.length) {
      return { nodes, newPath: path }
    }

    // 保存目标节点的子节点，它们将保持在原位置
    const targetChildren = getChildrenArray(targetNode, childrenKey)

    // 创建一个没有子节点的目标节点副本（只移动节点本身）
    const targetWithoutChildren = { ...targetNode }
    if (childrenKey in targetWithoutChildren) {
      delete targetWithoutChildren[childrenKey]
    }

    // 从父节点的子节点中移除目标节点
    parentChildren.splice(itemIndex, 1)

    if (parentPath.length === 1) {
      // 如果父节点是根级别的，将目标节点（不带子节点）和原来的子节点都插入到根级别
      const insertIndex = parentPath[0] + 1
      clonedNodes.splice(insertIndex, 0, targetWithoutChildren, ...targetChildren)
      return { nodes: clonedNodes, newPath: [insertIndex] }
    } else {
      // 如果父节点不是根级别的，将目标节点（不带子节点）和原来的子节点都插入到祖父节点的子节点中
      const grandParentPath = parentPath.slice(0, -1)
      const grandParentNode = getTreeNodeByPath(clonedNodes, grandParentPath, childrenKey)

      if (!grandParentNode) {
        return { nodes, newPath: path }
      }

      const grandParentChildren = getChildrenArray(grandParentNode, childrenKey)
      const parentIndexInGrandParent = parentPath[parentPath.length - 1]
      const insertIndex = parentIndexInGrandParent + 1

      grandParentChildren.splice(insertIndex, 0, targetWithoutChildren, ...targetChildren)

      const newPath = [...grandParentPath, insertIndex]
      return { nodes: clonedNodes, newPath }
    }
  } catch (error) {
    console.error('Error unindenting node:', error)
    return { nodes, newPath: path }
  }
}

/**
 * 移动节点到指定位置
 * 通用的节点移动操作，支持跨层级移动
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param fromPath 源节点路径
 * @param toPath 目标路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 移动后的树和新路径
 *
 * @example
 * ```typescript
 * const result = moveNode(chapters, [0, 1], [1, 0], 'children')
 * ```
 */
export const moveNode = <T extends TreeNode<T>>(
  nodes: T[],
  fromPath: TreePath,
  toPath: TreePath,
  childrenKey: keyof T = 'children' as keyof T
): { nodes: T[]; newPath: TreePath } => {
  try {
    // 深拷贝整个树，确保完全独立
    const clonedNodes = cloneTree(nodes, childrenKey)

    const sourceNode = getTreeNodeByPath(clonedNodes, fromPath, childrenKey)
    if (!sourceNode) {
      return { nodes, newPath: fromPath }
    }

    // 从源位置移除节点
    const sourceParentPath = fromPath.slice(0, -1)
    const sourceIndex = fromPath[fromPath.length - 1]

    if (sourceParentPath.length === 0) {
      // 源节点在根级别
      clonedNodes.splice(sourceIndex, 1)
    } else {
      // 源节点在子级别
      const sourceParent = getTreeNodeByPath(clonedNodes, sourceParentPath, childrenKey)
      if (sourceParent) {
        const sourceParentChildren = getChildrenArray(sourceParent, childrenKey)
        sourceParentChildren.splice(sourceIndex, 1)
      }
    }

    // 插入到目标位置
    const targetParentPath = toPath.slice(0, -1)
    const targetIndex = toPath[toPath.length - 1]

    if (targetParentPath.length === 0) {
      // 目标位置在根级别
      clonedNodes.splice(targetIndex, 0, sourceNode)
      return { nodes: clonedNodes, newPath: [targetIndex] }
    } else {
      // 目标位置在子级别
      const targetParent = getTreeNodeByPath(clonedNodes, targetParentPath, childrenKey)
      if (targetParent) {
        const targetParentChildren = getChildrenArray(targetParent, childrenKey)
        targetParentChildren.splice(targetIndex, 0, sourceNode)
        return { nodes: clonedNodes, newPath: toPath }
      }
    }

    return { nodes, newPath: fromPath }
  } catch (error) {
    console.error('Error moving node:', error)
    return { nodes, newPath: fromPath }
  }
}
