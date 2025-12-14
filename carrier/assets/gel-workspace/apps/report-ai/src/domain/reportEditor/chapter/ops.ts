import { ChapterGenerationStatus } from '@/types/editor';
import { ChapterContentUpdateResult, EditorContentUpdateOptions } from '../editor';
import type { EditorFacade } from '../editor/editorFacade';
import { findChapterDOMById } from './query';

/**
 * 流式内容更新选项
 */
export interface StreamingUpdateOptions extends EditorContentUpdateOptions {
  /** 去重检查函数 */
  shouldSkip?: (chapterId: string, html: string, status: ChapterGenerationStatus) => boolean;
  /** 渲染完成回调 */
  onRendered?: (chapterId: string, html: string, status: ChapterGenerationStatus) => void;
}

/**
 * 设置指定章节的内容
 *
 * @param editor EditorFacade 实例
 * @param chapterId 章节ID
 * @param content 新内容（HTML格式）
 * @param options 更新选项
 * @returns 更新结果
 */
export const setChapterContent = (
  editor: EditorFacade,
  chapterId: string | number,
  content: string,
  options: EditorContentUpdateOptions = {}
): ChapterContentUpdateResult => {
  const { useTransaction = true, fireEvents = false, debug = false } = options;
  try {
    if (!editor.isReady()) {
      return { success: false, error: 'Editor is not ready' };
    }

    const { headingElement, contentNodes } = findChapterDOMById(editor, chapterId);

    // 标题元素必须存在
    if (!headingElement) {
      return { success: false, error: `Chapter heading not found for chapter ${chapterId}` };
    }

    // 执行内容更新
    const updateOperation = () => {
      // 1. 移除旧的内容节点
      contentNodes.forEach((node) => {
        node.parentNode?.removeChild(node);
      });

      // 2. 插入新内容
      if (content) {
        (headingElement as HTMLElement).insertAdjacentHTML('afterend', content);
      }
    };

    if (useTransaction) {
      editor.transact(updateOperation);
    } else {
      updateOperation();
    }

    if (fireEvents) {
      editor.fire('change');
    }

    if (debug) {
      console.log(`[setChapterContent] Updated chapter ${chapterId}, length: ${content.length}`);
    }

    return { success: true, contentLength: content.length };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (debug) {
      console.error(`[setChapterContent] Failed to update chapter ${chapterId}:`, error);
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * 应用流式更新到章节
 *
 * @description
 * 根据章节状态更新编辑器内容。Loading 指示器由外部浮层组件（useChapterLoadingOverlay）
 * 负责显示，不再通过 DOM class 控制。
 *
 * @param editor EditorFacade 实例
 * @param chapterId 章节ID
 * @param html 章节HTML内容
 * @param status 章节状态
 * @param options 流式更新选项
 * @returns 更新结果
 *
 * @see apps/report-ai/docs/specs/chapter-title-loading-indicator/spec-core-v1.md
 */
export const applyStreamingUpdate = (
  editor: EditorFacade,
  chapterId: string,
  html: string,
  status: ChapterGenerationStatus,
  options: StreamingUpdateOptions = {}
): ChapterContentUpdateResult => {
  const { shouldSkip, onRendered, debug = false, ...updateOptions } = options;

  // 去重检查
  if (shouldSkip?.(chapterId, html, status)) {
    return { success: true, contentLength: 0 };
  }

  try {
    let result: ChapterContentUpdateResult;

    switch (status) {
      case 'pending': {
        // 清空内容（Loading 指示器由外部浮层显示，不需要 DOM class）
        result = setChapterContent(editor, chapterId, '', updateOptions);
        break;
      }

      case 'receiving': {
        if (!html) {
          result = { success: false, error: 'No HTML content for receiving status' };
          break;
        }
        // 更新流式内容
        result = setChapterContent(editor, chapterId, html, updateOptions);
        break;
      }

      case 'finish': {
        if (!html) {
          result = { success: false, error: 'No HTML content for finish status' };
          break;
        }
        // 设置最终内容
        result = setChapterContent(editor, chapterId, html, updateOptions);
        break;
      }

      default:
        result = { success: false, error: `Unknown section status: ${status}` };
    }

    // 渲染完成回调
    if (result.success && onRendered) {
      onRendered(chapterId, html, status);
    }

    if (debug) {
      console.log(`[applyStreamingUpdate] Updated section ${chapterId}, status: ${status}, length: ${html.length}`);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (debug) {
      console.error(`[applyStreamingUpdate] Failed to update section ${chapterId}:`, error);
    }
    return { success: false, error: `Streaming update failed: ${errorMessage}` };
  }
};
