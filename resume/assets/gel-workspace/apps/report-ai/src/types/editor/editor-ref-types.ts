/**
 * 编辑器引用相关类型定义
 *
 * 最小化外部依赖的类型定义
 */

import type { SelectionSnapshot } from './selection-types';
import { ChapterGenerationStatus } from './state';

/**
 * ID 映射应用结果
 *
 * 与 domain 层的类型定义保持兼容
 */
export interface ApplyIdMapResult {
  /** 成功替换的元素数量 */
  replacedCount: number;
  /** 受影响的新 ID 列表 */
  affectedIds: string[];
  /** 未在 DOM 中找到的旧 ID 列表 */
  unmatchedIds: string[];
}

/**
 * 报告编辑器引用接口
 *
 * 提供编辑器的命令式控制 API
 */
export interface ReportEditorRef {
  // === 基础内容操作 ===
  /** 获取当前内容 */
  getContent: () => string;
  /** 设置内容 */
  setContent: (content: string) => void;
  /** 插入内容到指定位置 */
  insertContent: (content: string, format?: 'html' | 'text') => void;
  /** 获取选中的内容 */
  getSelectedContent: () => string;
  /** 替换选中的内容 */
  replaceSelectedContent: (content: string) => void;
  /** 聚焦编辑器 */
  focus: () => void;
  /** 检查编辑器是否聚焦 */
  isFocused: () => boolean;
  /** 滚动到指定章节 */
  scrollToChapter: (chapterId: string) => void;
  /** 撤销操作 */
  undo: () => void;
  /** 重做操作 */
  redo: () => void;
  /** 检查是否可以撤销 */
  canUndo: () => boolean;
  /** 检查是否可以重做 */
  canRedo: () => boolean;

  // === 选区级别操作（文本 AI 改写） ===
  /** 替换选中文本 */
  replaceSelectedText: (content: string, format?: 'text' | 'html') => void;
  /** 恢复选区 */
  restoreSelection: (snapshot: SelectionSnapshot) => void;

  // === 章节级别操作 ===
  /** 更新指定章节的内容 */
  updateChapterContent: (
    chapterId: string | number,
    content: string,
    options?: {
      useTransaction?: boolean;
      fireEvents?: boolean;
      debug?: boolean;
    }
  ) => { success: boolean; error?: string; contentLength?: number };

  /** 设置编辑器的完整内容（全量替换） */
  setFullContent: (
    content: string,
    options?: {
      fireEvents?: boolean;
      debug?: boolean;
    }
  ) => { success: boolean; error?: string; contentLength?: number };

  /** 流式更新章节内容 */
  updateStreamingSection: (
    chapterId: string,
    html: string,
    status: ChapterGenerationStatus,
    options?: {
      useTransaction?: boolean;
      fireEvents?: boolean;
      shouldSkip?: (id: string, html: string, status: ChapterGenerationStatus) => boolean;
      onRendered?: (id: string, html: string, status: ChapterGenerationStatus) => void;
    }
  ) => { success: boolean; error?: string; contentLength?: number };

  /** 设置章节 Loading 状态 */
  setChapterLoading: (
    chapterId: string | number,
    loadingType: 'pending' | 'receiving' | 'none',
    options?: {
      debug?: boolean;
    }
  ) => { success: boolean; error?: string; contentLength?: number };

  /** 清除章节 Loading 状态 */
  clearChapterLoading: (
    chapterId: string | number,
    options?: {
      debug?: boolean;
    }
  ) => { success: boolean; error?: string; contentLength?: number };

  /** 检查编辑器是否就绪 */
  isEditorReady: () => boolean;

  /** 根据 idMap 替换 DOM 中的章节 ID */
  applyIdMap: (
    idMap: Record<string, string>,
    options?: {
      debug?: boolean;
    }
  ) => ApplyIdMapResult;
}
