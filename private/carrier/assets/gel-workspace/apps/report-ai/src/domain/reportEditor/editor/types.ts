/**
 * 编辑器内容管理相关类型定义
 */

/**
 * 编辑器内容更新选项
 */
export interface EditorContentUpdateOptions {
  /** 是否在事务中执行（支持撤销/重做） */
  useTransaction?: boolean;
  /** 是否触发变更事件 */
  fireEvents?: boolean;
  /** 调试模式 */
  debug?: boolean;
}

/**
 * 章节内容更新结果
 */
export interface ChapterContentUpdateResult {
  /** 是否成功更新 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 更新的内容长度 */
  contentLength?: number;
}
