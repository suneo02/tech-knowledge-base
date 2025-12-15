/**
 * 选区相关类型定义
 *
 * 完全独立的类型定义，不依赖任何其他模块
 */

/**
 * 序列化的选区书签
 *
 * 将 TinyMCE 的复杂书签对象序列化为可安全存储的格式
 * 避免与 Redux Imber 产生冲突
 */
export interface SerializedBookmark {
  /** 书签类型 */
  type: 'stringpath' | 'range' | 'id' | 'index' | 'path';
  /** 序列化的书签数据 */
  data: unknown;
  /** 是否有效 */
  isValid: boolean;
}

/**
 * 选区快照信息
 *
 * 用于保存选区状态以支持失败恢复
 */
export interface SelectionSnapshot {
  /** 选中的文本内容 */
  text: string;
  /** 选中的 HTML 内容 */
  html: string;
  /** 前文上下文（最多 100 字符） */
  contextBefore: string;
  /** 后文上下文（最多 100 字符） */
  contextAfter: string;
  /** 快照创建时间戳 */
  timestamp: number;
  /** 选区的书签（序列化格式，用于恢复选区位置） */
  bookmark: SerializedBookmark | null;
}

/**
 * 选区内容信息
 *
 * 包含选中的文本、HTML 和上下文
 */
export interface SelectionContent {
  /** 选中的文本内容 */
  text: string;
  /** 选中的 HTML 内容 */
  html: string;
  /** 前文上下文 */
  contextBefore: string;
  /** 后文上下文 */
  contextAfter: string;
}

export type SelectionUserDecision ='apply' | 'cancel'