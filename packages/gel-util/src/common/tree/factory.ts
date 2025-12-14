import { TreeNode } from './treeTypes'

/**
 * 克隆树结构
 *
 * @template T 节点数据类型
 * @param nodes 源树节点数组
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 克隆的树结构
 *
 * @example
 * ```typescript
 * const clonedChapters = cloneTree(chapters)
 * ```
 */
export const cloneTree = <T extends TreeNode<T>>(nodes: T[], childrenKey: keyof T = 'children' as keyof T): T[] => {
  try {
    return nodes.map((node) => {
      const cloned = { ...node }
      const children = node[childrenKey] as T[] | undefined

      if (children && Array.isArray(children)) {
        ;(cloned as any)[childrenKey] = cloneTree(children, childrenKey)
      }

      return cloned
    })
  } catch (error) {
    console.error('Error cloning tree:', error)
    return []
  }
}
