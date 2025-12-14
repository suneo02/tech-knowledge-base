import { RPDetailChapter } from 'gel-api';
import { TreePath } from 'gel-util/common';

/**
 * 前端专用章节数据类型
 *
 * @description
 * 基于 RPDetailChapter 扩展，包含前端计算的衍生数据：
 * - level: 章节层级（1, 2, 3...）
 * - path: 章节路径（用于生成层级编号，如 [0, 1, 2]）
 * - order: 章节在树中的顺序索引（用于排序）
 * - hierarchicalNumber: 层级编号（如 "1.2.3"）
 *
 * @note 这些衍生数据通常由 selector 计算得出，不应直接修改
 */
export interface RPChapterEnriched extends RPDetailChapter {
  /**
   * 章节层级
   * @description 从根节点开始计数，根节点为 1
   * @example 1, 2, 3
   */
  level: number;

  /**
   * 章节路径
   * @description 从根节点到当前节点的索引路径
   * @example [0, 1, 2] 表示第1个根节点的第2个子节点的第3个子节点
   */
  path: TreePath;

  /**
   * 章节顺序索引
   * @description 章节在树的深度优先遍历中的位置
   * @example 0, 1, 2, 3...
   */
  order: number;

  /**
   * 层级编号
   * @description 章节的层级编号字符串
   * @example "1", "1.1", "1.2.3"
   */
  hierarchicalNumber: string;

  /**
   * 子章节（递归结构）
   */
  children?: RPChapterEnriched[];
}

/**
 * 叶子章节（无子章节）
 *
 * @description
 * 用于需要明确表示叶子节点的场景，如多章节生成
 */
export interface RPLeafChapterEnriched extends Omit<RPChapterEnriched, 'children'> {
  children?: never;
}

/**
 * 章节扁平化列表项
 *
 * @description
 * 用于需要扁平化章节树的场景，如列表展示、搜索等
 */
export interface RPChapterFlat extends Omit<RPChapterEnriched, 'children'> {
  /**
   * 父章节 ID
   */
  parentId?: number;

  /**
   * 是否为叶子节点
   */
  isLeaf: boolean;

  /**
   * 子章节 ID 列表
   */
  childrenIds: number[];
}
