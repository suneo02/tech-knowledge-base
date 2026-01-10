/**
 * 章节保存流程转换工具
 *
 * 数据流向：
 * ```
 * 编辑器 → Document → SaveFormat → API → Saved → Canonical
 * ```
 *
 * 职责：
 * 1. **保存前**：Document → SaveFormat（准备 API 请求数据）
 * 2. **保存后**：Saved + Canonical → Canonical（合并服务器响应）
 *
 * 与 editor.ts 的区别：
 * - **save.ts**（本文件）：保存流程
 *   - `convertDocumentChaptersToSaveFormat`: Document → SaveFormat
 *   - `mergeSavedChaptersWithCanonical`: Saved + Canonical → Canonical
 *
 * - **editor.ts**：编辑和展示流程
 *   - `convertDocumentChaptersToDraft`: Document → Draft
 *   - `mergeDraftToOutlineView`: Draft + Canonical → ViewModel
 *
 * @module chapter/transforms/save
 */

import type { DocumentChapterNode } from '@/domain/reportEditor';
import type {
  RPChapterSavePayload,
  RPChapterSavePayloadPersisted,
  RPChapterSavePayloadTemp,
  RPDetailChapter,
} from 'gel-api';
import { mapTree } from 'gel-util/common';
import { isPersistedChapter } from '../guards';
import { generateChapterTempId } from '../mutations/factory';
import { ChapterNodeMap } from '../queries/analysis';

/**
 * 合并保存后的章节树与 Canonical 章节树
 *
 * 使用场景：
 * - 保存成功后，需要将保存后的章节树与 Canonical 章节树合并
 * - 保存后的章节树包含用户编辑的最新状态（标题、内容、结构）
 * - Canonical 章节树包含未保存的元数据（DPU、RAG、实体、文件、追踪等）
 *
 * 核心逻辑：
 * 1. 遍历保存后的章节树
 * 2. 根据 chapterId 在 Canonical Map 中查找对应章节
 * 3. 合并元数据
 * 4. 递归处理子章节
 *
 * 注意事项：
 * - 新增章节（临时 ID 已替换）在 Canonical 中不存在，直接使用保存后的数据
 * - 现有章节需要合并元数据
 * - 保持树结构与保存后的章节树一致
 *
 * @param savedChapters - 保存后返回的章节树（已应用 ID 映射）
 * @param canonicalMap - Canonical 章节映射表
 * @returns 合并后的完整章节树
 *
 * @example
 * ```typescript
 * // 保存成功后
 * const savedChapters = applyIdMapToChapters(mergedChapters, idMap);
 * const mergedChapters = mergeSavedChaptersWithCanonical(
 *   savedChapters,
 *   canonicalMap
 * );
 * dispatch(actions.applyDocumentSnapshot({ chapters: mergedChapters }));
 * ```
 */
export const mergeSavedChaptersWithCanonical = (
  savedChapters: RPChapterSavePayload[],
  canonicalMap: ChapterNodeMap<RPDetailChapter>
): RPDetailChapter[] => {
  return mapTree<RPChapterSavePayload, RPDetailChapter>(savedChapters, (savedChapter) => {
    // 保存后的章节应该都是持久章节（临时 ID 已被替换）
    if (!isPersistedChapter(savedChapter)) {
      // 静默处理：开发环境记录详细信息，生产环境只记录警告
      console.error(`[mergeSavedChaptersWithCanonical] Unexpected temporary chapter in saved data`);
      return {
        ...savedChapter,
        chapterId: -Date.now(), // 使用负数作为临时 ID，避免与正常 ID 冲突
      };
    }

    const canonicalChapter = canonicalMap.get(String(savedChapter.chapterId));

    // 合并 Canonical 元数据和保存后的内容
    // 注意：children 会由 mapTree 自动递归处理
    return {
      ...(canonicalChapter || {}),
      ...savedChapter,
      chapterId: savedChapter.chapterId,
    };
  });
};

/**
 * 将 Document 章节转换为保存格式（补充 Canonical 元数据）
 *
 * 核心逻辑：
 * - 以 Document 章节树为准（编辑器是真实状态）
 * - 从 Canonical 中补充未编辑的字段（如 writingThought、keywords 等）
 * - 递归处理子章节
 * - 正确处理临时章节和持久章节的 ID 字段
 *
 * 设计原则：
 * - Document 章节 = 用户编辑的真实状态（标题、内容、结构）
 * - Canonical 章节 = 补充元数据（writingThought、keywords 等）
 * - 保存时以 Document 为主，Canonical 为辅
 *
 * ID 字段处理：
 * - 临时章节：{ tempId: string, isTemporary: true, chapterId: undefined }
 * - 持久章节：{ chapterId: number, isTemporary: undefined, tempId: undefined }
 *
 * @param documentChapters - 从编辑器解析出的章节树
 * @param canonicalMap - Canonical 章节映射表
 * @returns 可保存的章节树
 */
export const convertDocumentChaptersToSaveFormat = (
  documentChapters: DocumentChapterNode[],
  canonicalMap: ChapterNodeMap<RPDetailChapter>
): RPChapterSavePayload[] => {
  return mapTree<DocumentChapterNode, RPChapterSavePayload>(documentChapters, (docChapter) => {
    const canonical =
      docChapter.isTemporary || !docChapter.chapterId ? undefined : canonicalMap.get(String(docChapter.chapterId));

    if (docChapter.isTemporary) {
      if (!docChapter.tempId) {
        // 静默处理：记录错误但不中断流程
        console.error(`[convertDocumentChaptersToSaveFormat] Temporary chapter missing tempId:`, docChapter);
      }
      const saveChapter: RPChapterSavePayloadTemp = {
        tempId: docChapter.tempId || generateChapterTempId(),
        isTemporary: true,
        title: docChapter.title,
        content: docChapter.content,
        contentType: 'html',
        writingThought: canonical?.writingThought,
      };
      return saveChapter;
    } else {
      if (!docChapter.chapterId) {
        // 静默处理：记录错误但不中断流程
        console.error(`[convertDocumentChaptersToSaveFormat] Persisted chapter missing chapterId:`, docChapter);
      }
      const saveChapter: RPChapterSavePayloadPersisted = {
        chapterId: Number(docChapter.chapterId),
        title: docChapter.title,
        content: docChapter.content,
        contentType: 'html',
        writingThought: canonical?.writingThought,
      };
      return saveChapter;
    }
  });
};
