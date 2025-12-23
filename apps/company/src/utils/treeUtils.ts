/**
 * Generic type for tree node structure
 */
export interface TreeNode<T = any> {
  children?: T[]
  [key: string]: any
}

/**
 * Generic type for tree node with required key
 */
export interface TreeNodeWithKey<T = any> extends TreeNode<TreeNodeWithKey<T>> {
  key: string | number
}

/**
 * Processes a tree node item with level information and optional parent ID
 * @param item - The item to process
 * @param level - 当前层级
 * @param index - 当前索引
 * @param parentId - 父节点ID
 * @param config - 处理配置
 * @returns 处理后的树节点
 */
export function processTreeNode<T extends Record<string, any>>(
  item: T,
  level: number = 0,
  index: number = 0,
  parentId: string = '',
  config: {
    idSeparator?: string
    processChildren?: boolean
    customProcessor?: (item: T) => Partial<T>
  } = {}
): Partial<T> {
  const { idSeparator = '-', processChildren = true, customProcessor } = config

  // 根据父节点生成ID
  const id = parentId ? `${parentId}${idSeparator}${index}` : `${index}`

  // 处理基础数据
  const baseData = {
    ...item,
    level: level + 1,
    id,
  }

  // 应用自定义处理（如果提供）
  const processedData = customProcessor ? customProcessor(baseData) : baseData

  // 如果需要，处理子节点
  if (processChildren && item.children?.length) {
    console.log('🚀 ~ processTreeNode:', item.children)
    ;(processedData as any).children = item.children.map((child: T, childIndex: number) =>
      processTreeNode(child, level + 1, childIndex + 1, id, config)
    )
  }
  // 移除未定义值
  return Object.fromEntries(Object.entries(processedData).filter(([_, value]) => value !== undefined)) as Partial<T>
}

/**
 * 递归地向树数据添加键
 * @param data - 树节点数组
 * @param keyField - 用作键的字段
 * @returns 带有键的树节点
 */
export function addTreeKeys<T extends Record<string, any>, K extends ValidateKey<T>>(
  data: T[],
  keyField: K
): TreeNodeWithKey<T>[] {
  return data.map((item) => {
    const processed = {
      ...item,
      key: item[keyField],
      children: item.children ? addTreeKeys(item.children, keyField) : undefined,
      type: item?.columns ? '表格' : item?.children ? (item?.level === 1 ? '菜单' : '子菜单') : '未知',
    }

    return Object.fromEntries(
      Object.entries(processed).filter(([_, value]) => value !== undefined)
    ) as TreeNodeWithKey<T>
  })
}

/**
 * 遍历树结构并对每个节点应用回调函数
 * @param tree - 要遍历的树数据
 * @param callback - 应用于每个节点的函数
 * @param config - 配置选项
 */
export function traverseTree<T extends TreeNode>(
  tree: T | T[],
  callback: (node: T, level: number, parent?: T) => void,
  config: {
    childrenKey?: string
    skipRoot?: boolean
  } = {}
): void {
  const { childrenKey = 'children', skipRoot = false } = config

  function traverse(node: T | T[], level: number = 0, parent?: T): void {
    if (Array.isArray(node)) {
      node.forEach((child) => traverse(child, level, parent))
      return
    }

    if (!skipRoot || level > 0) {
      callback(node, level, parent)
    }

    const children = node[childrenKey]
    if (Array.isArray(children)) {
      children.forEach((child) => traverse(child, level + 1, node))
    }
  }

  traverse(tree)
}

/**
 * 在树结构中查找满足条件的节点
 * @param tree - 要搜索的树
 * @param predicate - 测试每个节点的函数
 * @returns 找到的节点或undefined
 */
export function findTreeNode<T extends TreeNode>(tree: T | T[], predicate: (node: T) => boolean): T | undefined {
  let result: T | undefined

  traverseTree(tree, (node) => {
    if (predicate(node)) {
      result = node
    }
  })

  return result
}

/**
 * 将树结构映射到具有转换节点的新树
 * @param tree - 源树
 * @param transform - 每个节点的转换函数
 * @returns 转换后的树
 */
export function mapTree<T extends TreeNode, R extends TreeNode>(
  tree: T[],
  transform: (node: T, level: number) => R
): R[] {
  return tree.map((node, index) => {
    const transformed = transform(node, index)
    if (node.children?.length) {
      transformed.children = mapTree(node.children, transform)
    }
    return transformed
  })
}

/**
 * 根据条件统计树结构中的节点数量
 * @param tree - 要计数的树或树数组
 * @param predicate - 测试每个节点的函数
 * @param config - 可选配置
 * @returns 匹配条件的节点数量
 */
export function countTreeNodes<T extends TreeNode>(
  tree: T | T[],
  predicate: (node: T) => boolean,
  config: {
    childrenKey?: string
    includeRoot?: boolean
  } = {}
): number {
  const { childrenKey = 'children', includeRoot = true } = config
  let count = 0

  traverseTree(
    tree,
    (node) => {
      if (predicate(node)) {
        count++
      }
    },
    { childrenKey, skipRoot: !includeRoot }
  )

  return count
}

/**
 * 获取树结构中节点的统计信息
 * @param tree - 要分析的树或树数组
 * @param predicates - 命名谓词对象以计数
 * @param config - 可选配置
 * @returns 包含每个谓词计数的对象
 */
export function getTreeStats<T extends TreeNode, K extends string>(
  tree: T | T[],
  predicates: Record<K, (node: T) => boolean>,
  config: {
    childrenKey?: string
    includeRoot?: boolean
  } = {}
): Record<K, number> {
  const stats = {} as Record<K, number>

  // 初始化所有计数为0
  Object.keys(predicates).forEach((key) => {
    stats[key as K] = 0
  })

  // 单次遍历来计数所有谓词
  traverseTree(
    tree,
    (node) => {
      Object.entries(predicates).forEach(([key, predicate]: [K, (node: T) => boolean]) => {
        if (predicate(node)) {
          stats[key as K]++
        }
      })
    },
    { childrenKey: config.childrenKey, skipRoot: !config.includeRoot }
  )

  return stats
}

/**
 * 根据谓词收集树结构中的节点
 * @param tree - 要分析的树或树数组
 * @param predicates - 命名谓词对象以收集节点
 * @param config - 可选配置
 * @returns 包含每个谓词匹配节点数组的对象
 * @example
 * const tree = [
 *   { id: 1, children: [{ id: 2 }, { id: 3 }] },
 *   { id: 4, children: [{ id: 5 }] }
 * ];
 * const predicates = {
 *   isEvenId: (node) => node.id % 2 === 0,
 *   isOddId: (node) => node.id % 2 !== 0
 * };
 * const result = collectTreeNodes(tree, predicates);
 * console.log(result);
 * // 输出: { isEvenId: [{ id: 2 }, { id: 4 }], isOddId: [{ id: 1 }, { id: 3 }, { id: 5 }] }
 */
export function collectTreeNodes<T extends TreeNode, K extends string>(
  tree: T | T[],
  predicates: Record<K, (node: T) => boolean>,
  config: {
    childrenKey?: string
    includeRoot?: boolean
  } = {}
): Record<K, T[]> {
  const collections = {} as Record<K, T[]>

  // 初始化所有集合为空数组
  Object.keys(predicates).forEach((key) => {
    collections[key as K] = []
  })

  // 单次遍历来收集所有匹配节点
  traverseTree(
    tree,
    (node) => {
      Object.entries(predicates).forEach(([key, predicate]: [K, (node: T) => boolean]) => {
        if (predicate(node)) {
          collections[key].push(node)
        }
      })
    },
    { childrenKey: config.childrenKey, skipRoot: !config.includeRoot }
  )

  return collections
}

/**
 * 支持嵌套结构的高级节点收集
 * @param tree - 要分析的树或树数组
 * @param predicates - 命名谓词对象以收集节点
 * @param config - 可选配置
 * @returns 包含匹配项数组的对象
 * @example
 * const tree = [
 *   { id: 1, nested: [{ id: 2 }, { id: 3 }] },
 *   { id: 4, nested: [{ id: 5, nested: [{ id: 6 }] }] }
 * ];
 * const predicates = {
 *   isEvenId: (node) => node.id % 2 === 0,
 *   isOddId: (node) => node.id % 2 !== 0
 * };
 * const result = collectTreeNodesAdvanced(tree, predicates, { nestedKeys: ['nested'] });
 * console.log(result);
 * // 输出: { isEvenId: [{ id: 2 }, { id: 4 }, { id: 6 }], isOddId: [{ id: 1 }, { id: 3 }, { id: 5 }] }
 */
export function collectTreeNodesAdvanced<T extends TreeNode, K extends string>(
  tree: T | T[],
  predicates: Record<K, (node: T) => boolean>,
  config: {
    childrenKey?: string
    includeRoot?: boolean
    nestedKeys?: string[] // 包含嵌套结构的键
    nestedPredicates?: Record<K, (item: any) => boolean> // 嵌套项的谓词
  } = {}
): Record<K, Array<T | any>> {
  const collections = {} as Record<K, Array<T | any>>
  const { nestedKeys = [], nestedPredicates = {} as Record<K, (item: any) => boolean> } = config

  // 初始化集合
  Object.keys(predicates).forEach((key) => {
    collections[key as K] = []
  })

  // 处理嵌套结构
  const processNested = (item: any, key: K) => {
    if (!item) return

    // 检查嵌套数组
    if (Array.isArray(item)) {
      item.forEach((nestedItem) => {
        if (nestedPredicates[key as K]?.(nestedItem)) {
          collections[key].push(nestedItem)
        }
        // 递归检查嵌套结构
        nestedKeys.forEach((nestedKey) => {
          if (nestedItem[nestedKey]) {
            processNested(nestedItem[nestedKey], key)
          }
        })
      })
      return
    }

    // 检查嵌套对象
    nestedKeys.forEach((nestedKey) => {
      if (item[nestedKey]) {
        processNested(item[nestedKey], key)
      }
    })
  }

  // 主树遍历
  traverseTree(
    tree,
    (node) => {
      Object.entries(predicates).forEach(([key, predicate]: [K, (node: T) => boolean]) => {
        // 检查主节点
        if (predicate(node)) {
          collections[key].push(node)
        }

        // 检查嵌套结构
        nestedKeys.forEach((nestedKey) => {
          if (node[nestedKey]) {
            processNested(node[nestedKey], key as K)
          }
        })
      })
    },
    { childrenKey: config.childrenKey, skipRoot: !config.includeRoot }
  )

  return collections
}
