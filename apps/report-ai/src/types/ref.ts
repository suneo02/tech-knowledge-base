import { DPUItem, RAGItem } from 'gel-api';
import { RPFileUnified } from './file';

export type RPContentDPUItem = DPUItem & {
  chapterId: string;
};

export type RPContentRAGItem = RAGItem & {
  chapterId: string;
};

/**
 * 预览内容类型
 */
export type PreviewContentType = 'file' | 'dpu' | 'rag';

/**
 * 预览数据接口
 *
 * @description 抽象的预览数据接口，用于状态管理层
 * 设计原则：足够抽象以支持不同类型的预览内容，但包含预览渲染所需的基本信息
 *
 * @note 对于 FilePreviewData，页码信息存储在 data.position.startPoint.page 中
 * @note pageNumber 用于覆盖默认页码，主要用于点击引用标记时跳转到指定页码
 */
export interface RefPreviewData<TData = unknown> {
  /** 预览内容类型 */
  type: PreviewContentType;
  /** 资料唯一标识符 */
  id: string;
  /** 章节标识符 */
  chapterId?: number[];
  /** 预览标题 */
  title: string;
  /** 原始数据，具体类型由使用方确定 */
  data: TData;
  /** PDF 初始页码（从 1 开始，仅用于 PDF 文件预览，用于覆盖 data.position 中的页码） */
  pageNumber?: number;
}

/**
 * 具体类型的预览数据接口
 */
export type DPUPreviewData = RefPreviewData<DPUItem>;
export type RAGPreviewData = RefPreviewData<RAGItem>;
export type FilePreviewData = RefPreviewData<RPFileUnified>;

/**
 * 预览选项接口
 *
 * @description 用于外部调用预览时的可选配置
 */
export interface RefPreviewOptions {
  /** 覆盖预览标题（如果不提供，使用数据中的默认标题） */
  title?: string;
  /** 覆盖章节ID关联 */
  chapterId?: number;
  /** PDF 初始页码（从 1 开始，仅用于 PDF 文件预览） */
  pageNumber?: number;
}

/**
 * ReferenceView 组件的命令式句柄接口
 *
 * @description 提供外部程序化控制预览功能的API
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * const referenceViewRef = useRef<ReferenceViewHandle>(null);
 *
 * // 根据ID预览文件
 * referenceViewRef.current?.previewById('file-123', 'file');
 *
 * // 关闭预览
 * referenceViewRef.current?.closePreview();
 * ```
 */
export interface ReferenceViewHandle {
  /**
   * 根据ID预览资料
   *
   * @param id - 资料的唯一标识符
   * @param type - 预览内容类型（file/table/suggest）
   * @param options - 可选的预览配置
   *
   * @description
   * 所有资料数据已存储在 ReferenceView 内部（来自 chapters 和 reportFiles），
   * 此方法仅需要 ID 来定位数据，避免数据重复和保持单一数据源。
   */
  previewById(id: string, type: PreviewContentType, options?: RefPreviewOptions): void;

  /**
   * 关闭当前预览
   */
  closePreview(): void;

  /**
   * 检查是否有预览正在显示
   *
   * @returns 如果预览正在显示返回 true，否则返回 false
   */
  isPreviewOpen(): boolean;

  /**
   * 获取当前预览的资料ID
   *
   * @returns 当前预览的资料ID，如果没有预览则返回 null
   */
  getCurrentPreviewId(): string | null;
}
