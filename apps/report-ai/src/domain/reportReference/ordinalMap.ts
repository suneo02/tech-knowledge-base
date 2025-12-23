/**
 * 报告引用资料全局序号映射
 *
 * 职责：
 * - 根据 sortedReferences 构建全局引用「序号」映射
 * - 将章节内的局部 sourceId 映射到全局报告的引用序号
 * - 支持 DPU、RAG、File 类型的引用资料
 */

import { RPReferenceItem } from '@/domain/chat';
import { getFileReferenceId } from '@/domain/chat/ref';
import { getDPUId, getRAGId } from 'gel-util/biz';

/**
 * 全局引用序号映射类型
 * Key: refId (DPU/RAG/File 的唯一ID)
 * Value: 全局引用序号（从 1 开始）
 */
export type ReportReferenceOrdinalMap = Map<string, number>;

/**
 * 根据 sortedReferences 构建全局引用索引映射
 *
 * @param sortedReferences - 排序后的引用资料列表（来自 useReferenceData）
 * @returns 全局引用索引映射
 *
 * @example
 * const sortedReferences = useReferenceData(...).sortedReferences;
 * const indexMap = buildReportReferenceIndexMap(sortedReferences);
 * // indexMap.get('dpu-123') => 1
 * // indexMap.get('rag-456') => 2
 */
export const buildReportReferenceOrdinalMap = (sortedReferences: RPReferenceItem[]): ReportReferenceOrdinalMap => {
  const ordinalMap = new Map<string, number>();

  sortedReferences.forEach((ref, index) => {
    let refId: string;

    if (ref.type === 'dpu') {
      refId = getDPUId(ref.data);
    } else if (ref.type === 'rag') {
      refId = getRAGId(ref.data);
    } else if (ref.type === 'file') {
      // 文件类型也可能需要索引，使用 fileId
      refId = getFileReferenceId(ref.data);
    } else {
      return; // 跳过未知类型
    }

    // 全局序号从 1 开始（与 UI 显示一致）
    ordinalMap.set(refId, index + 1);
  });

  return ordinalMap;
};

/**
 * 从索引映射中获取引用序号
 *
 * @param indexMap - 全局引用索引映射
 * @param refId - 引用资料的唯一标识
 * @returns 全局引用序号，如果未找到则返回 undefined
 */
export const getGlobalReferenceOrdinal = (
  ordinalMap: ReportReferenceOrdinalMap | undefined,
  refId: string
): number | undefined => {
  if (!ordinalMap) return undefined;
  return ordinalMap.get(refId);
};
