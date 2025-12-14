/**
 * @fileoverview 引用资料处理器
 * @description 负责从章节数据中提取、排序和构建引用资料列表
 *
 * 核心功能：
 * 1. 从章节树中提取所有引用资料（文件、表格、建议资料）
 * 2. 按照特定规则排序和去重
 * 3. 从 fileMap 中获取已聚合的统一文件数据
 *
 * 排序规则：
 * - 按章节顺序优先（第一个章节的引用在最前）
 * - 章节内按类型排序：dpu（表格）> rag（建议资料）> file（文件）
 * - 同类型内：文件按上传时间降序，其他保持原顺序
 *
 * @module domain/chat/ref/referenceProcessor
 */

import { RPFileUnified } from '@/types/file';
import { RPDetailChapter, RPFileTraced } from 'gel-api';
import { traverseTree } from 'gel-util/common';
import { getReferenceIdentifier } from './referenceUtils';
import { RPReferenceItem } from './type';

/**
 * 按上传时间对文件数组进行降序排序
 *
 * 排序逻辑：
 * 1. 都有上传时间：按时间降序（最新的在前）
 * 2. 只有一个有时间：有时间的在前
 * 3. 都没有时间：按 fileId 字母顺序排序
 *
 * @param files - 待排序的文件数组
 * @returns 排序后的新数组（不修改原数组）
 *
 * @example
 * const files = [
 *   { fileId: '1', uploadTime: '2024-01-01' },
 *   { fileId: '2', uploadTime: '2024-01-02' },
 *   { fileId: '3', uploadTime: undefined }
 * ];
 * const sorted = sortFilesByUploadTime(files);
 * // 结果: [file2, file1, file3]
 */
const sortFilesByUploadTime = (files: RPFileTraced[]): RPFileTraced[] => {
  return [...files].sort((a, b) => {
    const aTime = a.uploadTime;
    const bTime = b.uploadTime;

    // 情况1: 都有上传时间，按时间降序（最新的在前）
    if (aTime && bTime) {
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    }

    // 情况2: 只有一个有时间，有时间的优先排在前面
    if (aTime && !bTime) return -1;
    if (!aTime && bTime) return 1;

    // 情况3: 都没有时间，按文件ID字母顺序排序（保证稳定性）
    return b.fileId.localeCompare(a.fileId);
  });
};

/**
 * 构建引用资料的配置选项
 */
interface BuildReferencesOptions {
  /**
   * 文件映射表，包含已聚合的统一格式文件数据
   * - key: fileId
   * - value: 统一格式的文件对象（已包含跨章节的引用信息）
   *
   * 注意：此 Map 应由 aggregateFileData 生成，已完成文件数据的聚合和合并
   */
  fileMap?: Map<string, RPFileUnified>;
}

/**
 * 从章节树中构建排序后的引用资料列表
 *
 * 这是引用资料处理的核心函数，负责：
 * 1. 遍历章节树，提取所有引用资料
 * 2. 按照特定规则排序
 * 3. 全局去重（基于引用标识符）
 * 4. 从 fileMap 中获取已聚合的文件数据
 *
 * 排序规则（优先级从高到低）：
 * 1. 按章节顺序：第一个章节的所有引用排在最前面
 * 2. 章节内按类型：dpu（表格）> rag（建议资料）> file（文件）
 * 3. 同类型内：
 *    - 表格/建议资料：保持原有顺序
 *    - 文件：按上传时间降序（最新的在前）
 * 4. 全局去重：相同的引用只保留第一次出现的
 *
 * @param chapters - 章节数据数组（支持树形结构）
 * @param options - 配置选项
 * @param options.fileMap - 文件映射表（由 aggregateFileData 生成），包含已聚合的文件数据
 * @returns 排序并去重后的引用资料列表
 *
 * @example
 * const chapters = [
 *   {
 *     chapterId: 1,
 *     dpuList: [{ dpuId: 'd1' }],
 *     ragList: [{ ragId: 'r1' }],
 *     files: [{ fileId: 'f1', uploadTime: '2024-01-01' }]
 *   }
 * ];
 * const references = buildSortedReferencesFromChapters(chapters);
 * // 结果: [dpu-d1, rag-r1, file-f1]
 *
 * @throws 捕获所有错误并返回空数组，错误会输出到控制台
 */

export const buildSortedReferencesFromChapters = (
  chapters: RPDetailChapter[],
  options: BuildReferencesOptions = {}
): RPReferenceItem[] => {
  try {
    const result: RPReferenceItem[] = [];
    const addedIds = new Set<string>(); // 用于全局去重的标识符集合
    const fileMap = options.fileMap;

    /**
     * 递归处理单个章节的引用资料
     *
     * 处理顺序：dpu -> rag -> file
     * 这个顺序决定了同一章节内不同类型引用的排列，与 ordinalMap 保持一致
     *
     * @param chapter - 当前处理的章节
     */
    const processChapter = (chapter: RPDetailChapter) => {
      // 步骤1: 处理该章节的表格引用（保持原有顺序）
      if (chapter.refData && chapter.refData.length > 0) {
        chapter.refData.forEach((table) => {
          const chapterId = chapter.chapterId;
          // 为表格数据添加章节信息
          const tableWithChapter = {
            ...table,
            chapterId: String(chapterId), // 当前章节ID
            refChapter: [chapterId], // 引用该表格的章节列表
          };
          const referenceId = getReferenceIdentifier({ type: 'dpu', data: tableWithChapter });

          // 只添加未出现过的引用
          if (!addedIds.has(referenceId)) {
            addedIds.add(referenceId);
            result.push({
              type: 'dpu',
              data: tableWithChapter,
            });
          }
        });
      }

      // 步骤2: 处理该章节的建议资料（保持原有顺序）
      if (chapter.refSuggest && chapter.refSuggest.length > 0) {
        chapter.refSuggest.forEach((suggest) => {
          const chapterId = chapter.chapterId;
          // 为建议资料添加章节信息
          const suggestWithChapter = {
            ...suggest,
            chapterId: String(chapterId), // 当前章节ID
            refChapter: [chapterId], // 引用该资料的章节列表
          };
          const referenceId = getReferenceIdentifier({ type: 'rag', data: suggestWithChapter });

          // 只添加未出现过的引用
          if (!addedIds.has(referenceId)) {
            addedIds.add(referenceId);
            result.push({
              type: 'rag',
              data: suggestWithChapter,
            });
          }
        });
      }

      // 步骤3: 处理该章节的文件引用（按上传时间排序）
      if (chapter.files && chapter.files.length > 0) {
        const sortedFiles = sortFilesByUploadTime(chapter.files);

        sortedFiles.forEach((file) => {
          // 从 fileMap 中获取统一格式的文件对象
          const unified = fileMap?.get(file.fileId);

          // 如果 fileMap 中不存在该文件，跳过并报错
          if (!unified) {
            console.error(`[buildSortedReferencesFromChapters] File not found in fileMap:`, {
              fileId: file.fileId,
              fileName: file.fileName,
              chapterId: chapter.chapterId,
            });
            return;
          }

          // 生成唯一标识符用于去重
          const referenceId = getReferenceIdentifier({ type: 'file', data: unified });

          // 只添加未出现过的引用
          if (!addedIds.has(referenceId)) {
            addedIds.add(referenceId);
            result.push({
              type: 'file',
              data: unified,
            });
          }
        });
      }
    };

    // 使用 traverseTree 按章节顺序递归处理（支持嵌套章节）
    traverseTree(chapters, processChapter);

    return result;
  } catch (error) {
    // 捕获所有错误，避免影响页面渲染
    console.error('[buildSortedReferencesFromChapters] Error processing references:', error);
    return [];
  }
};
