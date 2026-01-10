/**
 * 报告合成器类型定义
 *
 * 重构说明：去除对中间类型 ReportChapterComposedContent 的依赖，
 * 直接使用章节级别的数据结构
 */

/**
 * 合成进度信息
 */
export interface CompositionProgress {
  /** 当前处理的章节索引 */
  current: number;
  /** 总章节数 */
  total: number;
  /** 当前处理的章节ID */
  currentChapterId?: string;
  /** 当前处理的章节标题 */
  currentChapterTitle?: string;
  /** 完成百分比 */
  percentage: number;
}

/**
 * 合成配置选项
 */
export interface ReportComposerOptions {
  /** 是否包含报告标题 */
  includeReportTitle?: boolean;
  /** 章节间分隔符 */
  sectionSeparator?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 是否启用缓存 */
  useCache?: boolean;
  /** 缓存键前缀 */
  cacheKeyPrefix?: string;
  /** 合成进度回调 */
  onProgress?: (progress: CompositionProgress) => void;
  /** 章节合成完成回调 */
  onSectionComposed?: (chapterId: string, html: string) => void;
}
