/**
 * 本地草稿相关类型定义
 *
 * @description 用户编辑保存功能的核心类型，遵循方案A的三层架构设计
 * @author AI Assistant
 * @since 1.0.0
 */

import { RPChapterIdIdentifier, RPChapterPayloadTempIdIdentifier } from 'gel-api';

/**
 * 基线来源枚举
 *
 * @description 标识基线内容的来源，用于追踪和调试
 */
export type DraftBaselineSource = 'rehydration' | 'save-ack' | 'generation';

/**
 * 文档状态枚举
 *
 * @description 文档级保存状态
 */
export type DocumentStatus = 'saved' | 'saving' | 'unsaved' | 'error';

/**
 * 报告章节草稿节点 - 最小写缓冲
 *
 * @description 真正的最小写缓冲，与 Canonical 对齐的树结构
 * @note 只记录章节ID、变更的标题和子节点，其他信息从 Canonical 层派生
 * @note 脏标记为文档级别，存在草稿树即表示有变更
 * @note 版本控制和基线管理在文档级别处理，不在章节级别存储
 */
export interface RPDetailChapterDraft extends Partial<RPChapterIdIdentifier>, RPChapterPayloadTempIdIdentifier {
  /** 正在编辑的章节标题（仅当与 Canonical 不同时存储） */
  title?: string;
  /** 子章节草稿节点 */
  children?: RPDetailChapterDraft[];
}

/**
 * 文档草稿状态
 *
 * @description 整个文档的草稿状态，仅在存在未保存编辑时保留
 * @note 使用树结构存储草稿节点，与 Canonical 层对齐
 */
export interface DocumentDraftState {
  /** 草稿树 - 与 Canonical 对齐的树结构，仅记录有变更的章节 */
  draftTree: RPDetailChapterDraft[];

  /** 文档级状态 */
  documentStatus: DocumentStatus;

  /**
   * 最近一次将编辑器内容同步到 Draft 层的时间戳
   *
   * @description 保存流程会使用该时间判断在请求完成前是否出现新的编辑，
   * 防止覆盖尚未持久化的本地改动。
   */
  lastSyncAt?: number;
}
