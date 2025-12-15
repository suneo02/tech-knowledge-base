/**
 * 树形结构工具函数统一导出
 * 提供完整的树形数据处理能力
 */

// 类型定义
export type {
  TreeFindOptions,
  TreeLevelMap,
  TreeNode,
  TreeNodeLastModifiedMap,
  TreeNodeMap,
  TreeOrderMap,
  TreePath,
  TreeSortOptions,
  TreeTraversalOptions,
} from './treeTypes'

// 遍历操作
export {
  calculatePathLevel,
  findInTree,
  flattenTree,
  flattenTreeWithPath,
  generateHierarchicalNumber,
  getLeafNodes,
  getNextTreeNodePath,
  getNodesAlongPath,
  getPrevTreeNodePath,
  getTreeNodeByPath,
  isLeafNode,
  isValidTreePath,
  traverseTree,
  type FlatNodeWithPath,
} from './treeTraversal'

// 结构操作
export {
  appendTreeChildAtPath,
  insertTreeSiblingAfterPath,
  mapTree,
  removeTreeNodeAtPath,
  setTreeNodeByPath,
  updateTreeNodeAtPath,
  type TreeInsertResult,
} from './treeManipulation'

export { cloneTree } from './factory'

// 移动操作
export { indentNode, moveNode, unindentNode } from './treeMovement'

// 排序操作
export {
  insertSiblingNode,
  moveSiblingNode,
  removeSiblingNode,
  reorderNodes,
  type TreeReorderChange,
  type TreeReorderResult,
} from './treeReorder'

// 映射构建
export { buildTreeLevelMap, buildTreeMap, buildTreeOrderMap, buildTreePathMap } from './treeMapping'
