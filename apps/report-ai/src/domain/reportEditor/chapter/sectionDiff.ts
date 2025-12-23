/**
 * 章节去重和差异检测工具
 *
 * 提供简单的章节去重缓存，避免在流式更新中重复写入相同的 HTML 与状态，
 * 从而减少不必要的 DOM 操作与外部组件重渲染。
 */

import { ChapterGenerationStatus } from '@/types/editor';

/**
 * 章节去重器
 *
 * 通过缓存上次渲染的内容和状态，避免重复的 DOM 操作
 */
export class SectionDeduper {
  private lastHtmlById = new Map<string, string>();
  private lastStatusById = new Map<string, ChapterGenerationStatus>();

  /**
   * 判断是否应跳过本次渲染
   * - html 与上次一致且状态一致直接跳过
   *
   * 注意：
   * - 即使 html 为空，也不能直接跳过，因为需要更新 loading 类名（pending/receiving）
   *   以及在 finish 时清理 loading。是否跳过应以"状态+内容是否都未变化"为准。
   */
  shouldSkip(chapterId: string, html: string, status: ChapterGenerationStatus): boolean {
    const prevHtml = this.lastHtmlById.get(chapterId) || '';
    const prevStatus = this.lastStatusById.get(chapterId);
    if (prevHtml === (html || '') && prevStatus === status) return true;
    return false;
  }

  /**
   * 标记本次渲染结果，用于后续去重判断
   */
  markRendered(chapterId: string, html: string, status: ChapterGenerationStatus): void {
    this.lastHtmlById.set(chapterId, html || '');
    this.lastStatusById.set(chapterId, status);
  }

  /**
   * 重置所有缓存
   */
  reset(): void {
    this.lastHtmlById.clear();
    this.lastStatusById.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      cachedSections: this.lastHtmlById.size,
      totalCacheSize: this.lastHtmlById.size + this.lastStatusById.size,
    };
  }
}
