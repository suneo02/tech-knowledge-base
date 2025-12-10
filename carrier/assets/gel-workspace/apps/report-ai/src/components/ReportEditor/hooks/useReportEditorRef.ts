import {
  applyStreamingUpdate,
  EditorFacade,
  EditorFacadeSource,
  getCleanContentForExport,
  querySelector,
  replaceSelectedText,
  restoreSelection,
  setChapterContent,
  setChapterLoading,
  setEditorContent,
} from '@/domain/reportEditor';
import { ReportEditorRef } from '@/types/editor';
import { useCallback, useImperativeHandle } from 'react';
import { EditorDomSyncOptions, useEditorDomSync } from './useEditorDomSync';
import { useEditorFacade } from './useEditorFacade';

export interface UseReportEditorRefProps {
  mode?: 'edit' | 'preview';
  autoNumberingDebug?: boolean;
}

export interface UseReportEditorRefReturn {
  editorFacadeRef: React.MutableRefObject<EditorFacade | null>;
  attachEditor: (editor: EditorFacadeSource) => void;
  requestDomSync: (options?: EditorDomSyncOptions) => void;
}

/**
 * ReportEditor 的命令式控制入口
 *
 * - 所有 TinyMCE 访问都通过 EditorFacade 管理
 * - 自动串联章节 ID / 编号同步
 * - 暴露 `ReportEditorRef` 供上层业务调用
 */
export const useReportEditorRef = (
  props: UseReportEditorRefProps,
  ref: React.Ref<ReportEditorRef>
): UseReportEditorRefReturn => {
  const { autoNumberingDebug = false } = props;

  const { facadeRef, attachEditor: bindEditor } = useEditorFacade({
    enableDebugLog: autoNumberingDebug,
    enablePerformanceTracking: autoNumberingDebug,
    logPrefix: '[ReportEditor]',
  });

  const domSync = useEditorDomSync(facadeRef, { debug: autoNumberingDebug });
  const { syncSoon: requestDomSync, syncNow, applyIdMap } = domSync;

  const requireEditor = useCallback((): EditorFacade | null => {
    const editor = facadeRef.current;
    if (!editor || editor.isDestroyed()) {
      return null;
    }
    return editor;
  }, [facadeRef]);

  // === 选区操作包装函数（委托给 domain 层） ===
  const replaceSelectedTextWrapper = useCallback(
    (content: string, format: 'text' | 'html' = 'text') => {
      const editor = requireEditor();
      if (!editor) {
        throw new Error('Editor not available');
      }
      replaceSelectedText(editor, content, format);
      requestDomSync();
    },
    [requireEditor, requestDomSync]
  );

  const restoreSelectionWrapper = useCallback(
    (snapshot: any) => {
      const editor = requireEditor();
      if (!editor) {
        throw new Error('Editor not available');
      }
      restoreSelection(editor, snapshot);
    },
    [requireEditor]
  );

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => {
        const editor = requireEditor();
        if (!editor) return '';
        return getCleanContentForExport(editor);
      },

      setContent: (content: string) => {
        const editor = requireEditor();
        if (!editor) return;
        editor.setContent(content, { format: 'raw' });
        requestDomSync();
      },

      insertContent: (content: string, format: 'html' | 'text' = 'html') => {
        const editor = requireEditor();
        if (!editor) return;
        editor.insertContent(content, { format });
        requestDomSync();
      },

      getSelectedContent: () => {
        const editor = requireEditor();
        if (!editor) return '';
        return editor.getSelectedContent({ format: 'html' }) ?? '';
      },

      replaceSelectedContent: (content: string) => {
        const editor = requireEditor();
        if (!editor) return;
        editor.setSelectedContent(content);
      },

      focus: () => {
        const editor = requireEditor();
        editor?.focus();
      },

      isFocused: () => {
        const editor = requireEditor();
        if (!editor) return false;
        return editor.hasFocus();
      },

      scrollToChapter: (chapterId: string) => {
        const editor = requireEditor();
        if (!editor) return;
        const editorBody = editor.getBody();
        if (!editorBody) return;
        querySelector.chapterById(editorBody, chapterId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },

      undo: () => {
        requireEditor()?.undo();
      },

      redo: () => {
        requireEditor()?.redo();
      },

      canUndo: () => {
        const editor = requireEditor();
        return editor ? editor.hasUndo() : false;
      },

      canRedo: () => {
        const editor = requireEditor();
        return editor ? editor.hasRedo() : false;
      },

      // === 选区级别操作（文本 AI 改写） ===
      replaceSelectedText: replaceSelectedTextWrapper,
      restoreSelection: restoreSelectionWrapper,

      // === 章节级别操作 ===
      updateChapterContent: (chapterId, content, options = {}) => {
        const editor = requireEditor();
        if (!editor) {
          return { success: false, error: 'Editor not available' };
        }
        return editor.ignore(() => {
          const result = setChapterContent(editor, chapterId, content, options);
          if (result.success) {
            requestDomSync({ silent: true });
          }
          return result;
        });
      },

      /**
       * 设置编辑器的完整内容（全量替换）
       *
       * 用于初始化、还原、全文生成开始时清空内容等场景
       * 通过 undo.ignore + 静默 DOM 同步执行，避免写入撤销栈与触发 onChange
       *
       * @see {@link ../../../docs/RPDetail/ContentManagement/full-generation-flow.md#清空流程 | 全文生成流程 - 清空流程}
       * @see {@link ../../../docs/RPDetail/ContentManagement/data-layer-guide.md#4-编辑器运行模型半受控 | 数据与状态管理 - 注水策略}
       */
      setFullContent: (content, options = {}) => {
        const editor = requireEditor();
        if (!editor) {
          return { success: false, error: 'Editor not available' };
        }
        return editor.ignore(() => {
          const result = setEditorContent(editor, content, options);
          if (result.success) {
            requestDomSync({ silent: true });
          }
          return result;
        });
      },

      updateStreamingSection: (chapterId, html, status, options = {}) => {
        const editor = requireEditor();
        if (!editor) {
          return { success: false, error: 'Editor not available' };
        }
        // 流式内容属于外部注入，同样走静默通道，避免污染撤销栈
        return editor.ignore(() => {
          const result = applyStreamingUpdate(editor, chapterId, html, status, options);
          if (result.success) {
            requestDomSync({ silent: true });
          }
          return result;
        });
      },

      setChapterLoading: (chapterId, loadingType, options = {}) => {
        const editor = requireEditor();
        if (!editor) {
          return { success: false, error: 'Editor not available' };
        }
        return setChapterLoading(editor, chapterId, loadingType, options);
      },

      clearChapterLoading: (chapterId, options = {}) => {
        const editor = requireEditor();
        if (!editor) {
          return { success: false, error: 'Editor not available' };
        }
        return setChapterLoading(editor, chapterId, 'none', options);
      },

      isEditorReady: () => {
        const editor = facadeRef.current;
        return editor ? editor.isReady() : false;
      },

      applyIdMap: (idMap, _options = {}) => applyIdMap(idMap),
    }),
    [
      applyIdMap,
      facadeRef,
      requireEditor,
      requestDomSync,
      replaceSelectedTextWrapper,
      restoreSelectionWrapper,
    ]
  );

  const attachEditor = useCallback(
    (editor: EditorFacadeSource) => {
      bindEditor(editor);
      syncNow();
    },
    [bindEditor, syncNow]
  );

  return {
    editorFacadeRef: facadeRef,
    attachEditor,
    requestDomSync,
  };
};
