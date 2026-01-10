/**
 * 溯源标记生成器
 *
 * 职责：
 * - 生成报告章节的溯源标记 HTML
 * - 处理 DPU、RAG、File 三种引用类型的标记
 * - 支持全局引用索引映射
 *
 * 业务说明：
 * 溯源标记用于在报告中标注内容来源，点击后可跳转到对应的引用资料。
 * 标记按照 dpu -> rag -> file 的顺序排列。
 */

import { RPReferenceType } from '@/domain/chat/ref';
import { getFileReferenceId } from '@/domain/chat/ref/referenceUtils';
import { getGlobalReferenceOrdinal, ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { ChatTraceItem, DPUItem, RAGItem, RPFileTraced } from 'gel-api';
import { getDPUId, getRAGId } from 'gel-util/biz';
import { RP_CSS_CLASSES, RP_DATA_ATTRIBUTES, RP_DATA_VALUES } from '../foundation';

/**
 * 溯源标记参数接口
 */
interface SourceMarkerParams {
  /** 章节内的源索引 */
  sourceIndex: number;
  /** 引用ID（全局唯一） */
  refId: string;
  /** 引用类型（dpu/rag/file） */
  refType: RPReferenceType;
  /** 位置信息数组 */
  positions: { start: string; end: string }[];
  /** 显示的索引号（可能是全局索引） */
  displayIndex: number | string;
  /** PDF 页码（仅用于 file 类型，从 1 开始）
   * 注意：同一文件可能在不同位置被引用，每次引用的页码可能不同
   */
  pageNumber?: number;
}

/**
 * 生成单个溯源标记的 HTML
 *
 * @param params - 溯源标记参数
 * @returns 溯源标记的 HTML 字符串
 */
const generateSingleMarkerHtml = (params: SourceMarkerParams): string => {
  const { sourceIndex, refId, refType, positions, displayIndex, pageNumber } = params;
  const positionsJson = JSON.stringify(positions);

  // 构建属性对象
  const attrs: Record<string, string> = {
    class: RP_CSS_CLASSES.SOURCE_MARKER,
    [RP_DATA_ATTRIBUTES.GEL_EXTERNAL]: RP_DATA_VALUES.GEL_EXTERNAL_SOURCE_MARKER,
    contenteditable: RP_DATA_VALUES.CONTENTEDITABLE_FALSE,
    [RP_DATA_ATTRIBUTES.SOURCE_ID]: String(sourceIndex),
    [RP_DATA_ATTRIBUTES.REF_ID]: refId,
    [RP_DATA_ATTRIBUTES.REF_TYPE]: refType,
    [RP_DATA_ATTRIBUTES.POSITIONS]: positionsJson,
  };

  // 如果是 file 类型且有页码，添加 data-page-number 属性
  // 关键：页码必须存储在 DOM 中，因为同一文件可能在不同位置引用不同页码
  if (refType === 'file' && pageNumber) {
    attrs[RP_DATA_ATTRIBUTES.PAGE_NUMBER] = String(pageNumber);
  }

  // 拼接属性字符串
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => {
      // positions 是 JSON，使用单引号包裹
      const quote = key === RP_DATA_ATTRIBUTES.POSITIONS ? "'" : '"';
      return `${key}=${quote}${value}${quote}`;
    })
    .join(' ');

  // 生成 HTML - 包含 data-gel-external 属性标记为外部渲染节点
  return `<span ${attrsStr}>【${displayIndex}】</span>`;
};

/**
 * 为报告章节生成溯源标记 HTML（直接在文档末尾渲染）
 *
 * 简化的渲染逻辑：直接根据 traces 数据在文档末尾生成所有溯源标记的 HTML，
 * 无需复杂的 insert 再 convert 流程。
 *
 * @param traceContent - 章节的溯源数据
 * @param dpuList - 章节的 DPU 表格列表
 * @param ragList - 章节的 RAG 参考资料列表
 * @param fileList - 章节的文件列表
 * @param referenceIndexMap - 全局引用索引映射（可选）
 * @returns 溯源标记的 HTML 字符串
 *
 * @example
 * const sourceMarkersHtml = generateSourceMarkersHtml(
 *   chapter.traces,
 *   chapter.dpuList || [],
 *   chapter.ragList || [],
 *   chapter.files || [],
 *   referenceIndexMap
 * );
 * // 返回: '<span ...>[1]</span><span ...>[2]</span>'
 */
export const generateSourceMarkersHtml = (
  traceContent: ChatTraceItem[] = [],
  dpuList: DPUItem[] = [],
  ragList: RAGItem[] = [],
  fileList: RPFileTraced[] = [],
  referenceOrdinalMap?: ReportReferenceOrdinalMap
): string => {
  if (!traceContent || traceContent.length === 0) return '';

  const dpuLength = dpuList.length;
  const ragLength = ragList.length;
  const sourceMarkers: string[] = [];

  // 收集所有唯一的 index 和对应的 positions
  const indexPositionsMap = new Map<number, { start: string; end: string }[]>();

  traceContent.forEach((trace) => {
    if (trace.traced && trace.traced.length > 0) {
      trace.traced.forEach((point) => {
        const { index, start, end } = point;
        if (!indexPositionsMap.has(index)) {
          indexPositionsMap.set(index, []);
        }
        indexPositionsMap.get(index)!.push({ start: String(start), end: String(end) });
      });
    }
  });

  // 为每个 index 生成溯源标记
  Array.from(indexPositionsMap.entries())
    .sort(([a], [b]) => a - b) // 按 index 排序
    .forEach(([sourceIndex, positions]) => {
      let refId: string;
      let refType: RPReferenceType;
      let displayIndex: number | string = sourceIndex;
      let pageNumber: number | undefined;

      // 根据索引确定是 DPU、RAG 还是 file 引用
      // 引用顺序：dpu -> rag -> file
      if (sourceIndex < dpuLength) {
        refType = 'dpu';
        const dpuItem = dpuList[sourceIndex];
        refId = dpuItem ? getDPUId(dpuItem) : '';
      } else if (sourceIndex < dpuLength + ragLength) {
        refType = 'rag';
        const ragIndex = sourceIndex - dpuLength;
        const ragItem = ragList[ragIndex];
        refId = ragItem ? getRAGId(ragItem) : '';
      } else {
        refType = 'file';
        const fileIndex = sourceIndex - dpuLength - ragLength;
        const fileItem = fileList[fileIndex];
        refId = fileItem ? getFileReferenceId(fileItem) : '';
        // 提取 PDF 页码信息（从 position.startPoint.page）
        // 关键：每个引用位置可能对应文件的不同页码
        pageNumber = fileItem?.position?.startPoint?.page;
      }

      // 如果提供了全局引用序号映射，使用全局序号
      if (referenceOrdinalMap && refId) {
        const globalIndex = getGlobalReferenceOrdinal(referenceOrdinalMap, refId);
        if (globalIndex !== undefined) {
          displayIndex = globalIndex;
        }
      }

      // 生成单个标记的 HTML
      const markerHtml = generateSingleMarkerHtml({
        sourceIndex,
        refId,
        refType,
        positions,
        displayIndex,
        pageNumber,
      });
      sourceMarkers.push(markerHtml);
    });

  return sourceMarkers.join('');
};

/**
 * 拼接内容和溯源标记
 *
 * 业务说明：
 * 将章节的主体内容和溯源标记拼接在一起，溯源标记放在内容末尾。
 * 这个方法未来可能需要优化，例如支持溯源标记插入到内容中的特定位置。
 *
 * @param content - 章节主体内容 HTML
 * @param sourceMarkersHtml - 溯源标记 HTML
 * @returns 拼接后的完整 HTML
 *
 * @example
 * const fullHtml = appendSourceMarkers('<p>内容</p>', '<span>[1]</span>');
 * // 返回: '<p>内容</p><span>[1]</span>'
 */
export const appendSourceMarkers = (content: string, sourceMarkersHtml: string): string => {
  if (!sourceMarkersHtml) return content;
  return `${content}${sourceMarkersHtml}`;
};
