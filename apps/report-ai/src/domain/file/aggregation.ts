/**
 * @fileoverview 文件数据聚合器
 * @description 将报告级文件和章节文件聚合为统一格式的文件映射
 *
 * 核心功能：
 * 1. 合并报告级文件（reportFiles）和章节文件（chapter.files）
 * 2. 按 fileId 去重，聚合跨章节的引用信息（refChapter）
 * 3. 收集文件位置信息（position）
 * 4. 应用 pending 状态（处理中的文件状态）
 *
 * @see [../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md](../../../apps/report-ai/docs/specs/file-management/spec-design-v1.md) - 文件管理页面设计
 * @see [../../../apps/report-ai/docs/specs/file-management/spec-implementation-v1.md](../../../apps/report-ai/docs/specs/file-management/spec-implementation-v1.md) - 文件管理实施拆解
 *
 * 重要说明：
 * - 位置信息（position）与章节（chapterId）是一一对应的关系
 * - position[i] 对应 refChapter[i]
 * - position.length === refChapter.length（长度始终相同）
 * - 如果某个章节没有位置信息，对应的 position[i] 为 undefined
 * - 去重以章节为准：同一章节只会添加一次
 *
 * 数据流：
 * reportFiles + chapters + pendingStatusMap -> aggregateFileData -> Map<fileId, RPFileUnified>
 *
 * @module domain/file/aggregation
 */

import { RPDetailChapter, RPFile, RPFileTraced } from 'gel-api';
import { traverseTree } from 'gel-util/common';

import { RPFileUnified } from '@/types/file';

/**
 * 聚合文件数据，返回统一格式的文件映射
 *
 * 核心聚合函数，将报告级文件和章节文件合并为统一格式的文件映射
 *
 * 处理流程：
 * 1. 初始化：从报告级文件建立基础映射
 * 2. 遍历章节：提取章节文件并合并到映射中
 * 3. 应用状态：覆盖可变的 pending 状态
 *
 * 合并规则：
 * - 基础字段（fileName、fileType、uploadTime）：优先使用非空值
 * - 状态（status）：不可变状态（终态）不会被覆盖
 * - 位置信息（position）：直接追加（位置与章节一一对应）
 * - 引用章节（refChapter）：去重后追加
 *
 * 位置信息说明：
 * 位置信息与章节是一一对应的关系：
 * - position[i] 对应 refChapter[i]，表示该文件在该章节中的标注位置
 * - position.length === refChapter.length（长度始终相同）
 * - 如果某个章节没有位置信息，对应的 position[i] 为 undefined
 * - 去重以章节为准：同一章节只会添加一次，对应的位置也只会添加一次
 *
 * @param reportFiles - 报告级文件列表
 * @param chapters - 章节数据数组（支持树形结构）
 * @param pendingStatusMap - Pending 状态映射（正在处理中的文件状态）
 * @returns 文件映射表 Map<fileId, RPFileUnified>
 *
 * @example
 * const reportFiles = [{ fileId: 'f1', fileName: 'doc.pdf' }];
 * const chapters = [
 *   { chapterId: 1, files: [{ fileId: 'f1', fileType: 'pdf' }] },
 *   { chapterId: 2, files: [{ fileId: 'f1' }, { fileId: 'f2' }] }
 * ];
 * const pendingStatusMap = { f2: 'UPLOADING' };
 *
 * const map = aggregateFileData(reportFiles, chapters, pendingStatusMap);
 * // 结果:
 * // Map {
 * //   'f1' => { fileId: 'f1', refChapter: [1, 2], fileType: 'pdf', ... },
 * //   'f2' => { fileId: 'f2', refChapter: [2], status: 'UPLOADING', ... }
 * // }
 */
export function aggregateFileData(
  reportFiles: RPFile[] = [],
  chapters: RPDetailChapter[] = []
): Map<string, RPFileUnified> {
  const fileMap = new Map<string, RPFileUnified>();

  // 步骤1: 初始化报告级文件
  for (const file of reportFiles) {
    if (!file?.fileId) continue;
    fileMap.set(file.fileId, createUnifiedFileFromReport(file));
  }

  // 步骤2: 遍历章节，合并章节文件
  traverseTree(chapters, (chapter) => {
    if (!chapter.files?.length) return;

    for (const file of chapter.files) {
      if (!file?.fileId) continue;

      const existing = fileMap.get(file.fileId);
      if (existing) {
        mergeChapterFile(existing, file, chapter.chapterId);
      } else {
        fileMap.set(file.fileId, createUnifiedFileFromChapter(file, chapter.chapterId));
      }
    }
  });

  return fileMap;
}

/**
 * 将文件映射转换为数组
 *
 * Map 会保持插入顺序，因此转换后的数组顺序与插入顺序一致
 *
 * @param map - 文件映射表
 * @returns 文件数组
 *
 * @example
 * const map = new Map([
 *   ['f1', { fileId: 'f1', ... }],
 *   ['f2', { fileId: 'f2', ... }]
 * ]);
 * const list = mapToUnifiedList(map);
 * // 结果: [{ fileId: 'f1', ... }, { fileId: 'f2', ... }]
 */
export function mapToUnifiedList(map: Map<string, RPFileUnified>): RPFileUnified[] {
  return Array.from(map.values());
}

/**
 * 从报告级文件创建统一格式对象
 */
function createUnifiedFileFromReport(file: RPFile): RPFileUnified {
  return {
    fileId: file.fileId,
    fileName: file.fileName,
    docId: file.docId,
    createTime: file.createTime,
    status: file.status,
    fileType: undefined,
    uploadTime: undefined,
    position: [],
    refChapter: [],
  };
}

/**
 * 从章节文件创建统一格式对象
 *
 * 注意：position 和 refChapter 长度保持一致
 */
function createUnifiedFileFromChapter(file: RPFileTraced, chapterId: number): RPFileUnified {
  return {
    fileId: file.fileId,
    fileName: file.fileName,
    fileType: file.fileType,
    uploadTime: file.uploadTime,
    position: [file.position], // 与 refChapter 长度一致，没有位置时为 undefined
    refChapter: [chapterId],
  };
}

/**
 * 合并章节文件信息到已存在的文件对象
 *
 * 合并规则：
 * - 基础字段：优先使用非空值
 * - 章节和位置：同步添加，以章节去重
 *
 * 重要说明：
 * 位置信息（position）与章节（chapterId）是一一对应的关系：
 * - position[i] 对应 refChapter[i]
 * - position.length === refChapter.length（长度始终相同）
 * - 如果某个章节没有位置信息，对应的 position[i] 为 undefined
 * - 去重以章节为准：同一章节只会添加一次
 */
function mergeChapterFile(target: RPFileUnified, file: RPFileTraced, chapterId: number): void {
  // 合并基础字段（优先使用非空值）
  target.fileName ||= file.fileName;
  target.fileType ||= file.fileType;
  target.uploadTime ||= file.uploadTime;

  // 确保数组字段已初始化
  target.position ||= [];
  target.refChapter ||= [];

  // 同步添加章节和位置（以章节去重）
  if (!target.refChapter.includes(chapterId)) {
    target.refChapter.push(chapterId);
    // 位置与章节同步添加，保持一一对应（没有位置时为 undefined）
    target.position.push(file.position);
  }
}
