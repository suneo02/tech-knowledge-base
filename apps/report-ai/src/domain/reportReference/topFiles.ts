import { RPFileUnified } from '@/types/file';

/**
 * 计算置顶文件（报告级文件中未被章节引用的部分）
 *
 * 逻辑：
 * - 从 unifiedMap 中筛选出 refChapter 为空的文件
 * - refChapter 为空表示该文件未被任何章节引用
 * - unifiedMap 已经完成了去重和数据聚合
 *
 * @param unifiedMap - 统一文件映射表（由 aggregateFileData 生成）
 * @returns 未被章节引用的文件列表
 */
export function calculateTopReportFiles(unifiedMap: Map<string, RPFileUnified>): RPFileUnified[] {
  const topFiles: RPFileUnified[] = [];

  // 遍历所有文件，筛选出未被章节引用的文件
  unifiedMap.forEach((file) => {
    // refChapter 为空或长度为 0，表示未被任何章节引用
    if (!file.refChapter || file.refChapter.length === 0) {
      topFiles.push(file);
    }
  });

  return topFiles;
}
