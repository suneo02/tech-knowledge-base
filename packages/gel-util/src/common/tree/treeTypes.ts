/**
 * 树形结构类型定义
 * 提供树形数据结构的基础类型接口
 */

/**
 * 树形节点接口，要求节点具有子节点属性
 * @template T 节点数据类型
 */
export interface TreeNode<T = any> {
  children?: T[]
}

// ==================== 基础类型 ====================

/**
 * 树形路径类型 - 使用数组表示从根节点到目标节点的路径
 */
export type TreePath = number[]

// ==================== 查找和遍历选项 ====================

/**
 * 树形节点查找选项
 */
export interface TreeFindOptions {
  /** 是否递归查找子节点 */
  recursive?: boolean
  /** 是否包含已删除的节点 */
  includeDeleted?: boolean
  /** 最大查找深度 */
  maxDepth?: number
}

/**
 * 树遍历选项
 */
export interface TreeTraversalOptions {
  /** 遍历模式：深度优先或广度优先 */
  mode?: 'depth-first' | 'breadth-first'
  /** 是否包含根节点 */
  includeRoot?: boolean
  /** 最大遍历深度 */
  maxDepth?: number
  /** 过滤函数 */
  filter?: (node: any) => boolean
}

/**
 * 排序选项
 */
export interface TreeSortOptions {
  /** 排序字段 */
  field?: string
  /** 排序方向 */
  direction?: 'asc' | 'desc'
  /** 是否递归排序子节点 */
  recursive?: boolean
  /** 自定义比较函数 */
  compareFn?: (a: any, b: any) => number
}

// ==================== 映射类型 ====================

export type TreeLevelMap = Map<string, number>
export type TreeOrderMap = Map<string, number>
export type TreeNodeMap<T = any> = Map<string, T>
export type TreeNodeLastModifiedMap = Map<string, number>
