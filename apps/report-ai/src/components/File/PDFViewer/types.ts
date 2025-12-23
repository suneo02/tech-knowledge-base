/**
 * 文本选区模型
 * 用于在 PDF 页面上高亮显示选中的文本区域
 */
export interface PDFSelectionModel {
  /** 起始 X 坐标 */
  startX: number;
  /** 起始 Y 坐标 */
  startY: number;
  /** 结束 X 坐标 */
  endX: number;
  /** 结束 Y 坐标 */
  endY: number;
  /** 数据 ID，用于定位和标识 */
  dataId: string;
  /** 起始页码 */
  startPage?: number;
  /** 结束页码 */
  endPage?: number;
  /** 间隙宽度 */
  gapWidth?: number;
}

export interface LocatePDFEventDetail {
  page: number;
  domId?: string;
}
