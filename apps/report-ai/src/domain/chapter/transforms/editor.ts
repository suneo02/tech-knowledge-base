/**
 * 章节编辑流程转换工具
 *
 * 数据流向：
 * ```
 * 编辑器 → Document → Draft → ViewModel
 * ```
 *
 * 职责：
 * 1. **编辑时**：Document → Draft（同步编辑器状态到 Draft 层）
 * 2. **展示时**：Draft + Canonical → ViewModel（生成大纲视图）
 *
 * 与 save.ts 的区别：
 * - **editor.ts**（本文件）：编辑和展示流程
 *   - `convertDocumentChaptersToDraft`: Document → Draft
 *   - `mergeDraftToOutlineView`: Draft + Canonical → ViewModel
 *
 * - **save.ts**：保存流程
 *   - `convertDocumentChaptersToSaveFormat`: Document → SaveFormat
 *   - `mergeSavedChaptersWithCanonical`: Saved + Canonical → Canonical
 *
 * @module chapter/transforms/editor
 */

import type { DocumentChapterNode } from '@/domain/reportEditor';
import type { OutlineChapterViewModel, RPDetailChapterDraft } from '@/types';
import { RPDetailChapter } from 'gel-api';

/**
 * 安全地将 chapterId 转换为 number
 *
 * @param chapterId - 章节 ID（string 或 number）
 * @returns 转换后的数字，失败时返回 0
 */
const safeParseChapterId = (chapterId: string | number): number => {
  try {
    const parsed = Number(chapterId);
    // 检查是否为有效数字
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    // 转换失败，使用默认值 0
    return 0;
  }
};

/**
 * 递归转换章节树节点
 *
 * @param chapter - 文档章节节点
 * @returns 草稿章节节点
 */
const convertChapterNode = (chapter: DocumentChapterNode): RPDetailChapterDraft => {
  return {
    chapterId: safeParseChapterId(chapter.chapterId ?? '0'),
    tempId: chapter.tempId,
    title: chapter.title,
    children: chapter.children ? chapter.children.map(convertChapterNode) : undefined,
  };
};

/**
 * 将 DocumentChapterNode 转换为 RPDetailChapterDraft
 *
 * 使用场景：
 * - 编辑器内容变化时，同步到 Draft 层
 * - Draft 层只存储结构和标题，不存储完整内容
 *
 * 核心逻辑：
 * - 递归遍历树结构
 * - 安全地将 chapterId 转换为 number
 * - 保留 tempId 和 title
 * - 递归处理子节点
 *
 * 异常处理：
 * - 如果 chapterId 无法转换为有效数字，使用 0 作为默认值
 * - 空树返回空数组
 *
 * @param chapters - 文档章节树
 * @returns 草稿章节树
 */
export const convertDocumentChaptersToDraft = (chapters?: DocumentChapterNode[]): RPDetailChapterDraft[] => {
  if (!chapters || chapters.length === 0) return [];

  return chapters.map(convertChapterNode);
};

// ==================== Draft 与 Canonical 合并为大纲视图 ====================

/**
 * 将 Draft Tree 与 Canonical 合并为大纲视图模型
 *
 * 核心逻辑：
 * - 使用统一的树遍历方法（手动递归，因为需要类型转换）
 * - Draft Tree 只存储变更的字段（如标题、ID）
 * - 其他字段从 Canonical 层获取
 * - 直接生成大纲视图所需的 ViewModel 格式
 * - 只提取大纲视图需要的字段（title, writingThought, dpuList, ragList, refFiles）
 *
 * ID 查找策略：
 * 1. 优先使用 tempId 查找（临时章节）
 * 2. 其次使用 chapterId 查找（已保存章节）
 * 3. 如果都找不到，创建最小结构（新建章节）
 *
 * @param draftTree - Draft 章节树（如果为空，表示使用 Canonical）
 * @param canonicalMap - Canonical 章节映射表（key 可以是 chapterId 或 tempId）
 * @param canonicalTree - Canonical 章节树（当 draftTree 为空时使用）
 * @returns 大纲视图模型列表
 */
export const mergeDraftToOutlineView = (
  draftTree: RPDetailChapterDraft[],
  canonicalMap: Map<string, RPDetailChapter>,
  canonicalTree: RPDetailChapter[]
): OutlineChapterViewModel[] => {
  // 如果没有 Draft Tree，直接转换 Canonical Tree
  if (!draftTree || draftTree.length === 0) {
    return convertCanonicalToOutline(canonicalTree);
  }

  // 有 Draft Tree，合并 Draft 和 Canonical
  return convertDraftToOutline(draftTree, canonicalMap);
};

/**
 * 将 Canonical 章节树转换为大纲视图模型
 *
 * @param chapters - Canonical 章节列表
 * @returns 大纲视图模型列表
 */
const convertCanonicalToOutline = (chapters: RPDetailChapter[]): OutlineChapterViewModel[] => {
  return chapters.map((chapter) => ({
    chapterId: chapter.chapterId,
    title: chapter.title,
    writingThought: chapter.writingThought,
    dpuList: chapter.refData,
    ragList: chapter.refSuggest,
    refFiles: chapter.files,
    children: chapter.children ? convertCanonicalToOutline(chapter.children) : undefined,
  }));
};

/**
 * 将 Draft 章节树与 Canonical 合并为大纲视图模型
 *
 * 核心逻辑：
 * - canonicalMap 的 key 是 chapterId（只有已保存章节才在 Canonical 中）
 * - 临时章节（只有 tempId）不在 Canonical 中，创建最小结构
 * - 已保存章节（有 chapterId）从 Canonical 中获取完整数据
 *
 * @param draftNodes - Draft 章节列表
 * @param canonicalMap - Canonical 章节映射表（key 是 chapterId）
 * @returns 大纲视图模型列表
 */
const convertDraftToOutline = (
  draftNodes: RPDetailChapterDraft[],
  canonicalMap: Map<string, RPDetailChapter>
): OutlineChapterViewModel[] => {
  return draftNodes.map((node) => {
    // 只有已保存章节（有 chapterId）才能从 Canonical 中查找
    // canonicalMap 的 key 是 chapterId
    const canonical = node.chapterId ? canonicalMap.get(String(node.chapterId)) : undefined;

    // 如果 Canonical 中不存在（临时章节或新建章节），创建最小结构
    if (!canonical) {
      return {
        chapterId: node.chapterId,
        tempId: node.tempId,
        title: node.title ?? '',
        children: node.children ? convertDraftToOutline(node.children, canonicalMap) : undefined,
      };
    }

    // 合并 Draft 和 Canonical，生成大纲视图模型
    return {
      chapterId: canonical.chapterId,
      tempId: node.tempId, // 保留 tempId（如果有）
      title: node.title !== undefined ? node.title : canonical.title,
      writingThought: canonical.writingThought,
      dpuList: canonical.refData,
      ragList: canonical.refSuggest,
      refFiles: canonical.files,
      children: node.children ? convertDraftToOutline(node.children, canonicalMap) : undefined,
    };
  });
};
