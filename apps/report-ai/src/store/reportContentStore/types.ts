/**
 * 报告内容管理的 Redux 状态类型定义
 *
 * @description 重构后的类型文件，引用 @/types/report 中的核心类型
 * 支持三层状态架构：Canonical Layer、Ephemeral Layer、UI Control Layer
 * 兼容现有的 RPDetailChapter 类型系统
 */

import { RPDetailChapter, RPFile, RPReferencePriority } from 'gel-api';

// 引用核心业务类型
import type {
  ChapterFrontendState,
  // 本地草稿相关
  DocumentDraftState,
  // AI生成相关
  GlobalOpState,
  RPHydrationState,
} from '@/types/report';

// ===== Redux 特定的状态接口 =====

/**
 * 报告内容管理的根状态 - 三层状态架构
 *
 * @description 重构后的状态结构，引用核心类型定义
 *
 * 1. Canonical Layer（已确认层）：chapters - 唯一的持久化/服务器真相
 * 2. Draft Layer（会话层）：documentDraft - 文档级草稿状态，仅在有未保存编辑时存在
 * 3. UI Control Layer（控制层）：派生状态，如 isGenerating、reportState 等
 */
export interface ReportContentState {
  // === Canonical Layer - 已确认层 ===
  /** 章节列表 - 唯一的持久化/服务器真相，使用原始 RPDetailChapter */
  chapters: RPDetailChapter[];

  // === Draft Layer - 会话层 ===
  /** 文档草稿状态 - 仅在存在未保存编辑时保留，否则为 null */
  documentDraft: DocumentDraftState | null;

  // === 重注水控制 ===
  /** 水合状态 - 控制重注水闸门 */
  hydration: RPHydrationState;

  /** 全局互斥操作状态机（统一管理状态、数据和错误） */
  globalOp: GlobalOpState;

  /** 报告基本信息 */
  reportId: string | undefined;
  reportInfo?: {
    name: string;
    referencePriority: RPReferencePriority | undefined;
  };

  /** 章节前端状态 - 与数据模型分离的前端状态 */
  chapterStates: Record<string, ChapterFrontendState>;

  /** 报告级文件列表（非章节引用的文件也包含在此，包含实时状态） */
  reportFiles: RPFile[];
}
