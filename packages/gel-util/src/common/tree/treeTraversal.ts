/**
 * 树形结构遍历工具函数
 * 提供各种树形数据遍历和查找方法
 */

import type { TreeNode } from './treeTypes'

/**
 * 树形结构扁平化函数
 * 将嵌套的树形结构转换为扁平的线性数组
 *
 * @template T 节点数据类型，必须实现 TreeNode 接口
 * @param nodes 树形节点数组
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 扁平化后的节点数组
 *
 * @example
 * ```typescript
 * interface Chapter {
 *   id: number
 *   title: string
 *   children?: Chapter[]
 * }
 *
 * const chapters: Chapter[] = [
 *   {
 *     id: 1,
 *     title: '第一章',
 *     children: [
 *       { id: 11, title: '1.1 子章节' },
 *       { id: 12, title: '1.2 子章节' }
 *     ]
 *   },
 *   { id: 2, title: '第二章' }
 * ]
 *
 * const flatChapters = flattenTree(chapters)
 * // 结果: [{ id: 1, ... }, { id: 11, ... }, { id: 12, ... }, { id: 2, ... }]
 * ```
 */
export const flattenTree = <T extends TreeNode<T>>(nodes: T[], childrenKey: keyof T = 'children' as keyof T): T[] => {
  try {
    const result: T[] = []

    const traverse = (nodeList: T[]) => {
      nodeList.forEach((node) => {
        result.push(node)

        const children = node[childrenKey] as T[] | undefined
        if (children && Array.isArray(children) && children.length > 0) {
          traverse(children)
        }
      })
    }

    traverse(nodes)
    return result
  } catch (error) {
    console.error('Error flattening tree:', error)
    return []
  }
}

/**
 * 树形结构遍历函数
 * 对树形结构中的每个节点执行指定的回调函数
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param callback 对每个节点执行的回调函数
 * @param childrenKey 子节点属性名，默认为 'children'
 *
 * @example
 * ```typescript
 * traverseTree(chapters, (chapter, depth) => {
 *   console.log(`${'  '.repeat(depth)}${chapter.title}`)
 * })
 * ```
 */
export const traverseTree = <T extends TreeNode<T>>(
  nodes: T[],
  callback: (node: T, depth: number, parent?: T) => void,
  childrenKey: keyof T = 'children' as keyof T
): void => {
  try {
    const traverse = (nodeList: T[], depth: number = 0, parent?: T) => {
      nodeList.forEach((node) => {
        callback(node, depth, parent)

        const children = node[childrenKey] as T[] | undefined
        if (children && Array.isArray(children) && children.length > 0) {
          traverse(children, depth + 1, node)
        }
      })
    }

    traverse(nodes)
  } catch (error) {
    console.error('Error traversing tree:', error)
  }
}

/**
 * 查找树形结构中的节点
 * 根据条件查找匹配的节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param predicate 查找条件函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 找到的第一个匹配节点，如果没找到返回 undefined
 *
 * @example
 * ```typescript
 * const chapter = findInTree(chapters, node => node.id === 11)
 * ```
 */
export const findInTree = <T extends TreeNode<T>>(
  nodes: T[],
  predicate: (node: T) => boolean,
  childrenKey: keyof T = 'children' as keyof T
): T | undefined => {
  try {
    for (const node of nodes) {
      if (predicate(node)) {
        return node
      }

      const children = node[childrenKey] as T[] | undefined
      if (children && Array.isArray(children) && children.length > 0) {
        const found = findInTree(children, predicate, childrenKey)
        if (found) {
          return found
        }
      }
    }
    return undefined
  } catch (error) {
    console.error('Error finding in tree:', error)
    return undefined
  }
}

/**
 * 获取树形结构中的所有叶子节点
 * 叶子节点是指没有子节点或子节点数组为空的节点
 *
 * @template T 节点数据类型
 * @param nodes 树形节点数组
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 所有叶子节点的数组
 *
 * @example
 * ```typescript
 * interface Chapter {
 *   id: number
 *   title: string
 *   children?: Chapter[]
 * }
 *
 * const chapters: Chapter[] = [
 *   {
 *     id: 1,
 *     title: '第一章',
 *     children: [
 *       { id: 11, title: '1.1 子章节' },
 *       { id: 12, title: '1.2 子章节' }
 *     ]
 *   },
 *   { id: 2, title: '第二章' }
 * ]
 *
 * const leafNodes = getLeafNodes(chapters)
 * // 结果: [{ id: 11, title: '1.1 子章节' }, { id: 12, title: '1.2 子章节' }, { id: 2, title: '第二章' }]
 * ```
 */
export const getLeafNodes = <T extends TreeNode<T>>(nodes: T[], childrenKey: keyof T = 'children' as keyof T): T[] => {
  try {
    const result: T[] = []

    const traverse = (nodeList: T[]) => {
      nodeList.forEach((node) => {
        const children = node[childrenKey] as T[] | undefined

        if (!children || !Array.isArray(children) || children.length === 0) {
          // 这是一个叶子节点
          result.push(node)
        } else {
          // 有子节点，继续遍历
          traverse(children)
        }
      })
    }

    traverse(nodes)
    return result
  } catch (error) {
    console.error('Error getting leaf nodes:', error)
    return []
  }
}

/**
 * 检查节点是否为叶子节点
 * 叶子节点是指没有子节点或子节点数组为空的节点
 *
 * @template T 节点数据类型
 * @param node 要检查的节点
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 是否为叶子节点
 *
 * @example
 * ```typescript
 * const isLeaf = isLeafNode(chapter)
 * ```
 */
export const isLeafNode = <T extends TreeNode<T>>(node: T, childrenKey: keyof T = 'children' as keyof T): boolean => {
  try {
    const children = node[childrenKey] as T[] | undefined
    return !children || !Array.isArray(children) || children.length === 0
  } catch (error) {
    console.error('Error checking if node is leaf:', error)
    return true // 出错时默认认为是叶子节点
  }
}

/**
 * 根据路径获取指定的节点
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param path 节点路径数组（索引路径）
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 找到的节点，如果路径无效则返回null
 *
 * @example
 * ```typescript
 * const node = getTreeNodeByPath(chapters, [0, 1, 2])
 * ```
 */
export const getTreeNodeByPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  childrenKey: keyof T = 'children' as keyof T
): T | null => {
  try {
    if (path.length === 0) return null

    let current: T | undefined = nodes[path[0]]
    if (!current) return null

    for (let i = 1; i < path.length; i++) {
      const children = current[childrenKey] as T[] | undefined
      if (!children || !Array.isArray(children)) return null

      current = children[path[i]]
      if (!current) return null
    }

    return current
  } catch (error) {
    console.error('Error getting node by path:', error)
    return null
  }
}

/**
 * 扁平化节点信息，包含路径信息
 */
export interface FlatNodeWithPath<T> {
  node: T
  path: number[]
}

/**
 * 将树扁平化为一维数组，包含路径信息
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param childrenKey 子节点属性名，默认为 'children'
 * @param parentPath 父级路径，默认为空数组
 * @returns 扁平化后的节点列表，每个节点包含其完整路径
 *
 * @example
 * ```typescript
 * const flatNodes = flattenTreeWithPath(chapters)
 * // 结果: [{ node: chapter1, path: [0] }, { node: subChapter, path: [0, 0] }, ...]
 * ```
 */
export const flattenTreeWithPath = <T extends TreeNode<T>>(
  nodes: T[],
  childrenKey: keyof T = 'children' as keyof T,
  parentPath: number[] = []
): FlatNodeWithPath<T>[] => {
  try {
    const result: FlatNodeWithPath<T>[] = []

    nodes.forEach((node, index) => {
      const currentPath = [...parentPath, index]
      result.push({ node, path: currentPath })

      const children = node[childrenKey] as T[] | undefined
      if (children && Array.isArray(children) && children.length > 0) {
        result.push(...flattenTreeWithPath(children, childrenKey, currentPath))
      }
    })

    return result
  } catch (error) {
    console.error('Error flattening tree with path:', error)
    return []
  }
}

/**
 * 获取下一个节点路径（用于导航）
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param currentPath 当前路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 下一个有效路径，如果没有则返回null
 */
export const getNextTreeNodePath = <T extends TreeNode<T>>(
  nodes: T[],
  currentPath: number[],
  childrenKey: keyof T = 'children' as keyof T
): number[] | null => {
  try {
    const flatNodes = flattenTreeWithPath(nodes, childrenKey)
    const currentIndex = flatNodes.findIndex(
      ({ path }) => path.length === currentPath.length && path.every((p, i) => p === currentPath[i])
    )

    if (currentIndex === -1 || currentIndex === flatNodes.length - 1) {
      return null
    }

    return flatNodes[currentIndex + 1].path
  } catch (error) {
    console.error('Error getting next node path:', error)
    return null
  }
}

/**
 * 获取上一个节点路径（用于导航）
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param currentPath 当前路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 上一个有效路径，如果没有则返回null
 */
export const getPrevTreeNodePath = <T extends TreeNode<T>>(
  nodes: T[],
  currentPath: number[],
  childrenKey: keyof T = 'children' as keyof T
): number[] | null => {
  try {
    const flatNodes = flattenTreeWithPath(nodes, childrenKey)
    const currentIndex = flatNodes.findIndex(
      ({ path }) => path.length === currentPath.length && path.every((p, i) => p === currentPath[i])
    )

    if (currentIndex <= 0) {
      return null
    }

    return flatNodes[currentIndex - 1].path
  } catch (error) {
    console.error('Error getting previous node path:', error)
    return null
  }
}

/**
 * 获取路径上的所有节点
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param path 节点路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 路径上的所有节点数组
 *
 * @example
 * ```typescript
 * const nodesOnPath = getNodesAlongPath(chapters, [0, 1, 2])
 * // 返回路径 [0, 1, 2] 上的所有节点：[rootNode, childNode, grandChildNode]
 * ```
 */
export const getNodesAlongPath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  childrenKey: keyof T = 'children' as keyof T
): T[] => {
  try {
    const result: T[] = []
    let currentLevel = nodes

    for (const index of path) {
      const node = currentLevel[index]
      if (!node) {
        return []
      }
      result.push(node)
      const children = node[childrenKey] as T[] | undefined
      currentLevel = children ?? []
    }

    return result
  } catch (error) {
    console.error('Error getting nodes along path:', error)
    return []
  }
}

/**
 * 根据路径计算节点的层级深度
 *
 * @param path 节点路径
 * @returns 层级深度，根级别为1
 *
 * @example
 * ```typescript
 * const level = calculatePathLevel([0, 1, 2]) // 返回 3
 * ```
 */
export const calculatePathLevel = (path: number[]): number => {
  return path.length
}

/**
 * 生成节点的层级编号
 *
 * @param path 节点路径
 * @returns 层级编号字符串（如："1", "1.2", "1.2.3"）
 *
 * @example
 * ```typescript
 * const number = generateHierarchicalNumber([0, 1, 2]) // 返回 "1.2.3"
 * ```
 */
export const generateHierarchicalNumber = (path: number[]): string => {
  return path.map((index) => index + 1).join('.')
}

/**
 * 验证路径是否有效
 *
 * @template T 节点数据类型
 * @param nodes 根级别节点列表
 * @param path 要验证的路径
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 路径是否有效
 *
 * @example
 * ```typescript
 * const isValid = isValidTreePath(chapters, [0, 1, 2])
 * ```
 */
export const isValidTreePath = <T extends TreeNode<T>>(
  nodes: T[],
  path: number[],
  childrenKey: keyof T = 'children' as keyof T
): boolean => {
  try {
    if (path.length === 0) return false
    return getTreeNodeByPath(nodes, path, childrenKey) !== null
  } catch (error) {
    console.error('Error validating tree path:', error)
    return false
  }
}
