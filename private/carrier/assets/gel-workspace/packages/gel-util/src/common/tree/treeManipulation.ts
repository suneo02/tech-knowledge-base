/**
 * 树形结构操作工具函数
 * 提供树形数据的过滤、映射、克隆等操作方法
 */

import type { TreeNode } from './treeTypes'

/**
 * 递归映射树中的所有节点（同类型转换）
 *
 * 对树中的每个节点应用映射函数，返回新的树结构。
 * 这是一个纯函数，不会修改原始树。
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param mapper 映射函数，接收节点和深度，返回新节点
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 映射后的新树形节点数组
 *
 * @example
 * ```typescript
 * // 更新所有节点的某个属性
 * const updatedChapters = mapTree(chapters, (chapter) => ({
 *   ...chapter,
 *   visited: true
 * }))
 * ```
 */
export function mapTree<T extends TreeNode<T>>(
  nodes: T[],
  mapper: (node: T, depth: number) => T,
  childrenKey?: keyof T
): T[]

/**
 * 递归映射树中的所有节点（跨类型转换）
 *
 * 支持将输入类型转换为不同的输出类型。
 * 映射函数返回不包含 children 的节点，children 会自动递归处理。
 *
 * @template TInput 输入节点类型
 * @template TOutput 输出节点类型
 * @param nodes 输入树形节点数组
 * @param mapper 映射函数，接收节点和深度，返回新节点（不含 children）
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 映射后的新树形节点数组
 *
 * @example
 * ```typescript
 * // 将 DocumentChapterNode 转换为 RPChapterSavePayload
 * const savePayload = mapTree<DocumentChapterNode, RPChapterSavePayload>(
 *   documentChapters,
 *   (doc) => ({
 *     chapterId: doc.chapterId,
 *     title: doc.title,
 *     content: doc.content
 *   })
 * )
 * ```
 */
export function mapTree<TInput extends { children?: TInput[] }, TOutput extends { children?: TOutput[] }>(
  nodes: TInput[],
  mapper: (node: TInput, depth: number) => Omit<TOutput, 'children'>,
  childrenKey?: keyof TInput
): TOutput[]

/**
 * 实现
 */
export function mapTree<TInput extends { children?: TInput[] }, TOutput extends { children?: TOutput[] }>(
  nodes: TInput[],
  mapper: (node: TInput, depth: number) => Omit<TOutput, 'children'> | TOutput,
  childrenKey: keyof TInput = 'children' as keyof TInput
): TOutput[] {
  const mapNode = (node: TInput, depth: number = 0): TOutput => {
    // 先映射当前节点（不包含 children）
    const mappedNode = mapper(node, depth)

    // 递归处理子节点
    const children = node[childrenKey] as TInput[] | undefined
    const mappedChildren = children ? children.map((child) => mapNode(child, depth + 1)) : undefined

    // 合并节点和子节点
    if (mappedChildren !== undefined) {
      return {
        ...mappedNode,
        children: mappedChildren,
      } as TOutput
    }

    return mappedNode as TOutput
  }

  return nodes.map((node) => mapNode(node, 0))
}

/**
 * 递归更新树中指定路径的节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 目标路径
 * @param updater 更新函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 更新后的树形节点数组
 *
 * @example
 * ```typescript
 * const updatedChapters = updateTreeNodeAtPath(chapters, [0, 1], node => ({
 *   ...node,
 *   title: 'New Title'
 * }))
 * ```
 */
export const updateTreeNodeAtPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  updater: (node: T) => T,
  childrenKey: keyof T = 'children' as keyof T
): T[] => {
  try {
    if (path.length === 0) return nodes

    return nodes.map((node, index) => {
      if (index === path[0]) {
        if (path.length === 1) {
          return updater(node)
        } else {
          const children = node[childrenKey] as T[] | undefined
          return {
            ...node,
            [childrenKey]: children ? updateTreeNodeAtPath(children, path.slice(1), updater, childrenKey) : undefined,
          }
        }
      }
      return node
    })
  } catch (error) {
    console.error('Error updating node at path:', error)
    return nodes
  }
}

/**
 * 插入操作结果接口
 */
export interface TreeInsertResult<T> {
  nodes: T[]
  newPath: number[]
}

/**
 * 在指定路径后插入兄弟节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 插入位置路径
 * @param newNode 要插入的新节点
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 插入结果，包含更新后的节点数组和新节点的路径
 *
 * @example
 * ```typescript
 * const result = insertTreeSiblingAfterPath(chapters, [0, 1], newChapter)
 * // 在路径 [0, 1] 的节点后面插入新章节
 * ```
 */
export const insertTreeSiblingAfterPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  newNode: T,
  childrenKey: keyof T = 'children' as keyof T
): TreeInsertResult<T> => {
  try {
    const updatedNodes = [...nodes]

    if (path.length === 0) {
      updatedNodes.push(newNode)
      return { nodes: updatedNodes, newPath: [updatedNodes.length - 1] }
    }

    if (path.length === 1) {
      const insertIndex = path[0] + 1

      if (path[0] >= nodes.length) {
        updatedNodes.push(newNode)
        return { nodes: updatedNodes, newPath: [updatedNodes.length - 1] }
      }

      updatedNodes.splice(insertIndex, 0, newNode)
      return { nodes: updatedNodes, newPath: [insertIndex] }
    }

    const rootIndex = path[0]
    const rootNode = updatedNodes[rootIndex]

    if (rootNode) {
      const children = (rootNode[childrenKey] as T[] | undefined) ?? []
      const result = insertTreeSiblingAfterPath(children, path.slice(1), newNode, childrenKey)
      updatedNodes[rootIndex] = {
        ...rootNode,
        [childrenKey]: result.nodes,
      } as T
      return { nodes: updatedNodes, newPath: [rootIndex, ...result.newPath] }
    }

    updatedNodes.push(newNode)
    return { nodes: updatedNodes, newPath: [updatedNodes.length - 1] }
  } catch (error) {
    console.error('Error inserting sibling after path:', error)
    return { nodes, newPath: path }
  }
}

/**
 * 为指定路径的节点添加子节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 父节点路径
 * @param childNode 要添加的子节点
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 插入结果，包含更新后的节点数组和新节点的路径
 *
 * @example
 * ```typescript
 * const result = appendTreeChildAtPath(chapters, [0, 1], newChildChapter)
 * // 为路径 [0, 1] 的节点添加子节点
 * ```
 */
export const appendTreeChildAtPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  childNode: T,
  childrenKey: keyof T = 'children' as keyof T
): TreeInsertResult<T> => {
  try {
    const updatedNodes = [...nodes]

    if (path.length === 0) {
      updatedNodes.push(childNode)
      return { nodes: updatedNodes, newPath: [updatedNodes.length - 1] }
    }

    if (path.length === 1) {
      const parentIndex = path[0]
      const parentNode = updatedNodes[parentIndex]
      if (parentNode) {
        const children = [...((parentNode[childrenKey] as T[]) ?? [])]
        children.push(childNode)
        updatedNodes[parentIndex] = {
          ...parentNode,
          [childrenKey]: children,
        } as T
        return { nodes: updatedNodes, newPath: [parentIndex, children.length - 1] }
      }
    }

    const rootIndex = path[0]
    const rootNode = updatedNodes[rootIndex]
    if (rootNode) {
      const children = [...((rootNode[childrenKey] as T[]) ?? [])]
      const result = appendTreeChildAtPath(children, path.slice(1), childNode, childrenKey)
      updatedNodes[rootIndex] = {
        ...rootNode,
        [childrenKey]: result.nodes,
      } as T
      return { nodes: updatedNodes, newPath: [rootIndex, ...result.newPath] }
    }

    return { nodes: updatedNodes, newPath: path }
  } catch (error) {
    console.error('Error appending child at path:', error)
    return { nodes, newPath: path }
  }
}

/**
 * 根据路径删除节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 要删除的节点路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 删除节点后的树形节点数组
 *
 * @example
 * ```typescript
 * const updatedChapters = removeNodeAtPath(chapters, [0, 1, 2])
 * // 删除路径 [0, 1, 2] 的节点
 * ```
 */
export const removeTreeNodeAtPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  childrenKey: keyof T = 'children' as keyof T
): T[] => {
  try {
    if (path.length === 0) return nodes

    const updatedNodes = [...nodes]

    if (path.length === 1) {
      updatedNodes.splice(path[0], 1)
      return updatedNodes
    }

    const rootIndex = path[0]
    const rootNode = updatedNodes[rootIndex]

    if (rootNode) {
      const children = (rootNode[childrenKey] as T[]) ?? []
      updatedNodes[rootIndex] = {
        ...rootNode,
        [childrenKey]: removeTreeNodeAtPath(children, path.slice(1), childrenKey),
      }
    }

    return updatedNodes
  } catch (error) {
    console.error('Error removing node at path:', error)
    return nodes
  }
}

/**
 * 根据路径设置/替换节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param path 目标节点路径
 * @param node 新的节点数据
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 更新后的树形节点数组
 *
 * @example
 * ```typescript
 * const updatedChapters = setTreeNodeByPath(chapters, [0, 1], updatedChapter)
 * // 替换路径 [0, 1] 的节点
 * ```
 */
export const setTreeNodeByPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  node: T,
  childrenKey: keyof T = 'children' as keyof T
): T[] => {
  try {
    if (path.length === 0) return nodes

    const updatedNodes = [...nodes]

    if (path.length === 1) {
      updatedNodes[path[0]] = node
      return updatedNodes
    }

    const rootIndex = path[0]
    const rootNode = updatedNodes[rootIndex]

    if (rootNode) {
      const children = (rootNode[childrenKey] as T[] | undefined) ?? []
      updatedNodes[rootIndex] = {
        ...rootNode,
        [childrenKey]: setTreeNodeByPath(children, path.slice(1), node, childrenKey),
      } as T
    }

    return updatedNodes
  } catch (error) {
    console.error('Error setting node by path:', error)
    return nodes
  }
}
