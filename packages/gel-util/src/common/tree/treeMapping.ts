/**
 * 树形结构映射构建工具函数
 * 提供将树形数据转换为各种映射表的方法
 */

import { flattenTreeWithPath, traverseTree } from './treeTraversal'
import type { TreeNode, TreePath } from './treeTypes'

/**
 * 将树形结构转换为映射表
 * 递归遍历树形结构，将所有节点按指定键值构建为 Map
 *
 * @template T 节点数据类型
 * @template K 键的类型
 * @param nodes 树形节点数组
 * @param keyExtractor 从节点提取键的函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 节点映射表
 *
 * @example
 * ```typescript
 * interface Chapter {
 *   id: number
 *   title: string
 *   children?: Chapter[]
 * }
 *
 * const chapters: Chapter[] = [...]
 *
 * // 按 ID 构建映射表
 * const chapterMap = buildTreeMap(chapters, (chapter) => String(chapter.id))
 *
 * // 按标题构建映射表
 * const titleMap = buildTreeMap(chapters, (chapter) => chapter.title)
 * ```
 */
export const buildTreeMap = <T extends TreeNode<T>, K extends string | number>(
  nodes: T[],
  keyExtractor: (node: T) => K,
  childrenKey: keyof T = 'children' as keyof T
): Map<K, T> => {
  try {
    const map = new Map<K, T>()

    traverseTree(
      nodes,
      (node) => {
        const key = keyExtractor(node)
        map.set(key, node)
      },
      childrenKey
    )

    return map
  } catch (error) {
    console.error('Error building tree map:', error)
    return new Map()
  }
}

/**
 * 构建树形结构的排序映射表
 * 为每个节点在其同级节点中的位置建立映射关系，用于排序操作
 *
 * @template T 节点数据类型
 * @template K 键的类型
 * @param nodes 树形节点数组
 * @param keyExtractor 从节点提取键的函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 节点排序位置映射表，键为节点标识，值为在同级中的索引位置
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
 * const orderMap = buildTreeOrderMap(chapters, (chapter) => String(chapter.id))
 * // 结果: { '1': 0, '2': 1, '11': 0, '12': 1 }
 * // 表示：章节1在根级第0位，章节2在根级第1位，章节11在第一章的子章节中第0位，章节12在第一章的子章节中第1位
 * ```
 */
export const buildTreeOrderMap = <T extends TreeNode<T>, K extends string | number>(
  nodes: T[],
  keyExtractor: (node: T) => K,
  childrenKey: keyof T = 'children' as keyof T
): Map<K, number> => {
  try {
    const orderMap = new Map<K, number>()

    const buildOrderForLevel = (nodeList: T[]) => {
      nodeList.forEach((node, index) => {
        const key = keyExtractor(node)
        orderMap.set(key, index)

        const children = node[childrenKey] as T[] | undefined
        if (children && Array.isArray(children) && children.length > 0) {
          buildOrderForLevel(children)
        }
      })
    }

    buildOrderForLevel(nodes)
    return orderMap
  } catch (error) {
    console.error('Error building tree order map:', error)
    return new Map()
  }
}

/**
 * 构建树形结构的层级映射表
 * 为每个节点建立其在树中深度层级的映射关系，用于层级相关的操作
 *
 * @template T 节点数据类型
 * @template K 键的类型
 * @param nodes 树形节点数组
 * @param keyExtractor 从节点提取键的函数
 * @param options 配置选项
 * @param options.startLevel 起始层级，默认为 0
 * @param options.childrenKey 子节点属性名，默认为 'children'
 * @returns 节点层级映射表，键为节点标识，值为层级深度
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
 * // 从层级 0 开始
 * const levelMap = buildTreeLevelMap(chapters, (chapter) => String(chapter.id))
 * // 结果: Map { '1' => 0, '2' => 0, '11' => 1, '12' => 1 }
 *
 * // 从层级 2 开始（如 HTML 标题 H2）
 * const levelMapH2 = buildTreeLevelMap(chapters, (chapter) => String(chapter.id), { startLevel: 2 })
 * // 结果: Map { '1' => 2, '2' => 2, '11' => 3, '12' => 3 }
 * ```
 */
export const buildTreeLevelMap = <T extends TreeNode<T>, K extends string | number>(
  nodes: T[],
  keyExtractor: (node: T) => K,
  options: {
    startLevel?: number
    childrenKey?: keyof T
  } = {}
): Map<K, number> => {
  try {
    const { startLevel = 0, childrenKey = 'children' as keyof T } = options
    const levelMap = new Map<K, number>()

    traverseTree(
      nodes,
      (node, depth) => {
        const key = keyExtractor(node)
        levelMap.set(key, depth + startLevel)
      },
      childrenKey
    )

    return levelMap
  } catch (error) {
    console.error('Error building tree level map:', error)
    return new Map()
  }
}

/**
 * 构建树形结构的路径映射表
 * 为每个节点建立其在树中路径的映射关系，用于生成层级编号等操作
 *
 * @template T 节点数据类型
 * @template K 键的类型
 * @param nodes 树形节点数组
 * @param keyExtractor 从节点提取键的函数
 * @param childrenKey 子节点属性名，默认为 'children'
 * @returns 节点路径映射表，键为节点标识，值为树路径（索引数组）
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
 * const pathMap = buildTreePathMap(chapters, (chapter) => String(chapter.id))
 * // 结果: Map {
 * //   '1' => [0],
 * //   '11' => [0, 0],
 * //   '12' => [0, 1],
 * //   '2' => [1]
 * // }
 * ```
 */
export const buildTreePathMap = <T extends TreeNode<T>, K extends string | number>(
  nodes: T[],
  keyExtractor: (node: T) => K,
  childrenKey: keyof T = 'children' as keyof T
): Map<K, TreePath> => {
  try {
    const pathMap = new Map<K, TreePath>()
    const flattened = flattenTreeWithPath(nodes, childrenKey)

    flattened.forEach(({ node, path }) => {
      const key = keyExtractor(node)
      pathMap.set(key, path)
    })

    return pathMap
  } catch (error) {
    console.error('Error building tree path map:', error)
    return new Map()
  }
}
