import { ChapterContentUpdateResult, EditorContentUpdateOptions } from '../editor';
import type { EditorFacade } from '../editor/editorFacade';

/**
 * 设置编辑器的完整内容（全量替换）
 *
 * 注意：此函数主要用于注水操作（Hydration），默认不触发 change 事件
 * 如需触发事件，请显式传入 fireEvents: true
 *
 * @param editor EditorFacade 实例
 * @param content 完整内容（HTML格式）
 * @param options 更新选项
 * @returns 更新结果
 *
 * @see {@link ../../../docs/RPDetail/ContentManagement/data-layer-guide.md#4-编辑器运行模型半受控 | 数据与状态管理 - 注水策略}
 */
export const setEditorContent = (
  editor: EditorFacade | null,
  content: string,
  options: EditorContentUpdateOptions = {}
): ChapterContentUpdateResult => {
  if (!editor) {
    return { success: false, error: 'Editor instance is null' };
  }

  try {
    if (!editor.isReady()) {
      return { success: false, error: 'Editor is not ready' };
    }

    const { fireEvents = false } = options; // 默认不触发事件，避免注水时创建 Draft
    editor.setContent(content, { format: 'html' });

    if (fireEvents) {
      editor.fire('change');
    }

    return { success: true, contentLength: content.length };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
};
