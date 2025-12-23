/**
 * GlobalOperation 领域逻辑
 *
 * 提供 GlobalOperation 相关的类型守卫和工具函数
 * 避免在 selector 中重复类型判断逻辑
 */

import type { TextRewriteOperationData } from '@/types/editor';
import type {
  ChapterRegenerationOperationData,
  FullGenerationOperationData,
  GlobalOperationKind,
  GlobalOpState,
  MultiChapterGenerationOperationData,
} from '@/types/report';

// ==================== 类型守卫 ====================

/**
 * 判断是否为全文生成操作
 */
export function isFullGenerationOp(op: GlobalOpState): op is GlobalOpState & { data: FullGenerationOperationData } {
  return op.kind === 'full_generation' && op.data?.type === 'full_generation';
}

/**
 * 判断是否为多章节生成操作
 */
export function isMultiChapterGenerationOp(
  op: GlobalOpState
): op is GlobalOpState & { data: MultiChapterGenerationOperationData } {
  return op.kind === 'multi_chapter_generation' && op.data?.type === 'multi_chapter_generation';
}

/**
 * 判断是否为章节重生成操作
 */
export function isChapterRegenerationOp(
  op: GlobalOpState
): op is GlobalOpState & { data: ChapterRegenerationOperationData } {
  return op.kind === 'chapter_regeneration' && op.data?.type === 'chapter_regeneration';
}

/**
 * 判断是否为文本改写操作
 */
export function isTextRewriteOp(op: GlobalOpState): op is GlobalOpState & { data: TextRewriteOperationData } {
  return op.kind === 'text_rewrite' && op.data?.type === 'text_rewrite';
}

/**
 * 判断是否为任意 AIGC 生成操作（全文/多章节/单章节）
 */
export function isChapterAIGCOp(op: GlobalOpState): boolean {
  return isFullGenerationOp(op) || isMultiChapterGenerationOp(op) || isChapterRegenerationOp(op);
}

/**
 * 判断是否为全局忙碌状态（排除 idle/error）
 */
export function isGlobalBusy(kind: GlobalOperationKind): boolean {
  return (
    kind === 'server_loading' ||
    kind === 'full_generation' ||
    kind === 'multi_chapter_generation' ||
    kind === 'chapter_regeneration' ||
    kind === 'text_rewrite'
  );
}

/**
 * 判断编辑器是否应该只读
 */
export function shouldEditorBeReadonly(kind: GlobalOperationKind): boolean {
  return isGlobalBusy(kind);
}

// ==================== 进度计算 ====================

/**
 * 计算队列进度百分比
 */
export function calculateQueueProgress(currentIndex: number, total: number): number {
  return total > 0 ? Math.round((currentIndex / total) * 100) : 0;
}

/**
 * 获取当前章节 ID（从队列中）
 */
export function getCurrentChapterId(queue: string[], currentIndex: number): string | null {
  return currentIndex < queue.length ? queue[currentIndex] : null;
}
