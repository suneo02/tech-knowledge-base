/**
 * 操作状态相关类型定义
 *
 * @description 保存、同步、重试、冲突等操作状态的类型定义
 * @author AI Assistant
 * @since 1.0.0
 */

/**
 * 章节前端状态管理
 *
 * @description 存储与章节相关的前端状态，与数据模型分离
 */
export interface ChapterFrontendState {
  /** 章节ID */
  chapterId: string;
  /** 最后修改时间戳（用于冲突检测） */
  lastModified?: number;
  /** 内容版本（用于乐观锁） */
  version?: number;
  /** 章节锁定状态（用于生成期间） */
  locked?: boolean;
  /** 章节epoch（用于重注水控制） */
  epoch?: number;
}
