/**
 * 章节 ID 映射工具（数据层）
 *
 * 职责：
 * - 将临时 ID 映射为持久化 ID
 * - 递归处理树形结构中的所有节点
 * - 保持树结构的完整性
 *
 * 使用场景：
 * - 保存成功后，后端返回 ID 映射表（tempId → chapterId）
 * - 需要更新前端章节树中的所有 ID（纯数据操作）
 *
 * 协作模块：
 * - reportEditor/chapterId/ops - 视图层 ID 映射（TinyMCE DOM）
 * - 两者使用相同的 idMap 格式，分别处理数据层和视图层的 ID 同步
 *
 * @module chapter/transforms/idMapping
 */

import { RPChapterSavePayload } from 'gel-api';
import { getTreeNodeByPath, mapTree, TreeNode, TreePath } from 'gel-util/common';
import type { ChapterLike } from '../types';

type ChapterIdValue<T extends { chapterId?: unknown }> = T extends { chapterId?: infer Id }
  ? NonNullable<Id> extends never
    ? string | number
    : NonNullable<Id>
  : string | number;

/**
 * ID 映射选项
 */
export interface ApplyIdMapOptions<TChapterId = string | number> {
  /**
   * 子节点属性名
   * @default 'children'
   */
  childrenKey?: string;

  /**
   * ID 转换函数（用于处理 ID 类型转换）
   * @default (id) => Number(id)
   */
  idTransformer?: (id: string | number) => TChapterId;
}

/**
 * 应用 ID 映射到章节树（数据层）
 *
 * 核心逻辑：
 * 1. 使用通用的 mapTree 工具递归遍历所有节点
 * 2. 使用 tempId 作为查找键，在映射表中查找对应的真实 chapterId
 * 3. 如果存在映射，将真实 ID 赋值给 chapterId，并清理临时标记
 *
 * 设计原则：
 * - 复用通用树工具：使用 gel-util 的 mapTree 函数
 * - 保持不可变性：返回新对象，不修改原对象
 * - 类型安全：支持泛型，适用于任何章节类型
 * - 仅处理新增章节：只有带 tempId 的章节才会被映射
 *
 * 协作关系：
 * - 本函数处理章节树数据结构（纯数据操作）
 * - 配合 reportEditor/chapterId/ops.applySectionIdMap 处理编辑器 DOM
 * - 两者使用相同的 idMap，确保数据层和视图层的 ID 一致性
 *
 * @template T 章节类型，必须包含 chapterId 和可选的 children
 * @param chapters - 章节树数组
 * @param idMap - ID 映射表，格式为 { tempId: chapterId }
 * @param options - 映射选项
 * @returns 应用映射后的新章节树
 *
 * @example
 * ```typescript
 * // 新增章节的情况（使用 tempId）
 * const chapters = [
 *   { tempId: 'new-chapter-123', isTemporary: true, title: '章节1', children: [
 *     { tempId: 'new-chapter-456', isTemporary: true, title: '章节1.1' }
 *   ]}
 * ];
 *
 * const idMap = {
 *   'new-chapter-123': '789',
 *   'new-chapter-456': '790'
 * };
 *
 * // 1. 更新数据层（章节树）
 * const updatedChapters = applyIdMapToChapters(chapters, idMap);
 *
 * // 2. 更新视图层（编辑器 DOM）
 * // applySectionIdMap(editor, idMap);
 *
 * // 结果：
 * // [
 * //   { chapterId: 789, isTemporary: false, tempId: undefined, title: '章节1', children: [
 * //     { chapterId: 790, isTemporary: false, tempId: undefined, title: '章节1.1' }
 * //   ]}
 * // ]
 * ```
 */
export const applyIdMapToChapters = <T extends RPChapterSavePayload & TreeNode<T>>(
  chapters: T[],
  idMap: Record<string, string>,
  options: ApplyIdMapOptions<ChapterIdValue<T>> = {}
): T[] => {
  const childrenKey = (options.childrenKey ?? 'children') as keyof T;
  const transformId =
    options.idTransformer ?? (((id: string | number) => Number(id)) as (id: string | number) => ChapterIdValue<T>);

  return mapTree(
    chapters,
    (chapter) => {
      const tempId = chapter.tempId;
      if (!tempId || !idMap[String(tempId)]) {
        return chapter;
      }

      const mappedId = idMap[String(tempId)];
      const normalizedId = transformId(mappedId);
      const finalId = typeof normalizedId === 'number' && Number.isNaN(normalizedId) ? chapter.chapterId : normalizedId;

      return {
        ...chapter,
        chapterId: finalId,
        isTemporary: undefined,
        tempId: undefined,
      };
    },
    childrenKey
  );
};

/**
 * 获取真实的 chapterId
 *
 * 使用场景：
 * - 保存后需要使用真实 ID 进行后续操作（如 AIGC）
 * - 优先从 idMap 获取映射后的 ID
 * - 如果没有映射，从章节树中读取现有的 chapterId
 *
 * @param chapters - 章节树数组
 * @param path - 章节路径
 * @param tempId - 临时 ID（用于在 idMap 中查找）
 * @param idMap - ID 映射表
 * @param options - 映射选项
 * @returns 真实的 chapterId，如果无法获取则返回 undefined
 *
 * @example
 * ```typescript
 * const realId = getRealChapterId(chapters, [0, 1], 'new-chapter-123', { 'new-chapter-123': '456' });
 * // => '456' (从 idMap 获取)
 *
 * const existingId = getRealChapterId(chapters, [0, 1], undefined, {});
 * // => '123' (从章节树读取)
 * ```
 */
export const getRealChapterId = <T extends ChapterLike<T>>(
  chapters: T[],
  path: TreePath,
  tempId?: string,
  idMap?: Record<string, string>,
  options: ApplyIdMapOptions = {}
): string | undefined => {
  const childrenKey = (options.childrenKey ?? 'children') as keyof T;

  if (tempId && idMap?.[tempId]) {
    return idMap[tempId];
  }

  const chapter = getTreeNodeByPath(chapters, path, childrenKey);
  if (chapter?.chapterId) {
    return String(chapter.chapterId);
  }

  return undefined;
};
