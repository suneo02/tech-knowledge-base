import { ReportEditor } from '@/components';
import {
  selectCanonicalDocHtml,
  selectFullDocGenProgress,
  selectGlobalOperationKind,
  selectIsGlobalBusy,
  selectIsServerLoading,
  selectReportId,
  selectShouldEditorBeReadonly,
  useChapterRegeneration,
  useEditorDraftSync,
  useFullDocGeneration,
  useRehydrationOrchestrator,
  useReportContentPersistence,
  useReportContentSelector,
} from '@/store/reportContentStore';
import { useTextRewrite } from '@/store/reportContentStore/hooks';

import {
  selectIsTextRewriting,
  selectLeafChapterMap,
  selectTextRewriteCorrelationId,
  selectTextRewriteIsCompleted,
  selectTextRewritePreviewContent,
  selectTextRewriteSnapshot,
} from '@/store/reportContentStore/selectors';
import { SelectionSnapshot } from '@/types/editor';
import { SelectionUserDecision } from '@/types/editor/selection-types';
import { ChatRoomProvider } from 'ai-ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { useReportDetailContext } from '../../../context/ReportDetail';
import { RPReferenceType } from '../../../domain/chat';
import styles from './index.module.less';
import { ReportContentHeader } from './ReportContentHeader';
import { useEditorInitialValue } from './useEditorInitialValue';

const ReportContentInner: React.FC = () => {
  // ✅ 直接从 Redux 获取所有状态
  const fullDocumentHtml = useReportContentSelector(selectCanonicalDocHtml);
  const leafChapterMap = useReportContentSelector(selectLeafChapterMap);
  const reportId = useReportContentSelector(selectReportId);

  // 从页面上下文获取全局共享的编辑器 ref 和引用资料视图 ref
  const { reportEditorRef, referenceViewRef } = useReportDetailContext();

  // 加载状态
  const loading = useReportContentSelector(selectIsServerLoading);

  const editorInitialValue = useEditorInitialValue({
    loading,
    reportId: reportId ?? undefined,
    canonicalHtml: fullDocumentHtml,
  });

  // 全局互斥操作状态
  const globalOpKind = useReportContentSelector(selectGlobalOperationKind);
  const isGlobalBusy = useReportContentSelector(selectIsGlobalBusy);
  const shouldEditorBeReadonly = useReportContentSelector(selectShouldEditorBeReadonly);
  const generationProgress = useReportContentSelector(selectFullDocGenProgress);

  // 保存状态

  // 获取上下文

  // ✅ 使用原子 Hook，只执行操作
  const { startGeneration } = useFullDocGeneration();

  // 统一的初始化注水 + 流式更新 + 章节级重注水编排器
  useRehydrationOrchestrator({
    editorRef: reportEditorRef,
    enableStreaming: true,
  });

  // 章节重生成控制器
  const { startRegeneration } = useChapterRegeneration();

  // 文本改写控制
  const { startRewrite, confirmRewrite, rejectRewrite } = useTextRewrite();

  // 获取文本改写状态
  const isRewriting = useReportContentSelector(selectIsTextRewriting);
  const correlationId = useReportContentSelector(selectTextRewriteCorrelationId);
  const snapshot = useReportContentSelector(selectTextRewriteSnapshot);
  const previewContent = useReportContentSelector(selectTextRewritePreviewContent);
  const isCompleted = useReportContentSelector(selectTextRewriteIsCompleted);

  // 构建文本改写状态对象
  const textRewriteState = {
    isRewriting,
    correlationId,
    snapshot,
    previewContent,
    isCompleted: isCompleted || false,
  };

  // 处理文本改写用户决策
  const handleTextRewriteDecision = useCallback(
    (decision: SelectionUserDecision, content: string, snapshot: SelectionSnapshot) => {
      if (decision === 'apply') {
        // 用户确认应用改写结果
        // 内容替换由 EditorFacade 在预览组件中完成
        // 这里只需要确认操作，结束整个 operation
        confirmRewrite();
      } else {
        // 用户取消改写结果
        // 不进行内容替换，直接结束 operation
        rejectRewrite();
      }
    },
    [confirmRewrite, rejectRewrite]
  );

  // ✅ 草稿同步 Hook（纯 Redux 封装）
  const draftSync = useEditorDraftSync({
    debounceMs: 100,
    enabled: true,
  });

  const persistence = useReportContentPersistence({
    getEditorContent: () => reportEditorRef.current?.getContent() ?? '',
    autoSave: {
      debounceMs: 1500,
      minIntervalMs: 5000,
    },
    editorRef: reportEditorRef,
  });

  // 处理引用标记点击事件
  const handleReferenceClick = useCallback(
    ({ refId, refType }: { refId: string; refType: RPReferenceType }) => {
      // 使用引用ID预览引用资料
      referenceViewRef.current?.previewById(refId, refType);
    },
    [referenceViewRef]
  );

  // 处理 AIGC 按钮点击 - 触发单章节生成
  const handleAIGCButtonClick = useCallback(
    (chapterId: string) => {
      startRegeneration(chapterId);
    },
    [startRegeneration]
  );

  // 撤销/重做状态
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 更新撤销/重做状态
  const updateUndoRedoState = useCallback(() => {
    if (reportEditorRef.current) {
      setCanUndo(reportEditorRef.current.canUndo());
      setCanRedo(reportEditorRef.current.canRedo());
    }
  }, [reportEditorRef]);

  // 监听编辑器内容变化，更新撤销/重做状态
  useEffect(() => {
    // 初始化时更新一次
    updateUndoRedoState();

    // 设置定时器定期检查（简单实现，可以优化为事件监听）
    const interval = setInterval(updateUndoRedoState, 500);

    return () => clearInterval(interval);
  }, [updateUndoRedoState]);

  // 处理撤销
  const handleUndo = useCallback(() => {
    reportEditorRef.current?.undo();
    // 立即更新状态
    setTimeout(updateUndoRedoState, 0);
  }, [reportEditorRef, updateUndoRedoState]);

  // 处理重做
  const handleRedo = useCallback(() => {
    reportEditorRef.current?.redo();
    // 立即更新状态
    setTimeout(updateUndoRedoState, 0);
  }, [reportEditorRef, updateUndoRedoState]);

  // 处理选择引用数据
  // 暂时不实现具体逻辑，因为引用数据选择功能需要更多的UI设计
  // 可以考虑：打开引用面板、显示引用选择对话框等
  const handleSelectReference = useCallback(() => {
    console.log('选择引用数据 - 功能待设计');
    // TODO: 实现引用数据选择的具体交互
    // 可能的实现方式：
    // 1. 打开引用资料面板（如果已关闭）
    // 2. 显示引用数据选择对话框
    // 3. 高亮显示可选择的引用资料
  }, []);

  // 显示加载状态
  if (loading) {
    return (
      <div className={styles['report-content']}>
        <div>加载报告数据中...</div>
      </div>
    );
  }

  return (
    <ChatRoomProvider>
      <div className={styles['report-content']}>
        <ReportContentHeader
          onSave={() => {
            persistence.saveNow().catch((error) => {
              console.warn('[ReportContent] 手动保存失败', error);
            });
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onSelectReference={handleSelectReference}
          onGenerateFullText={startGeneration}
          isGenerating={globalOpKind === 'full_generation'}
          generationProgress={generationProgress}
          disableGeneration={isGlobalBusy || leafChapterMap.size === 0}
          saving={persistence.saving}
          hasUnsaved={persistence.hasUnsaved}
          lastSavedAt={persistence.lastSavedAt}
          lastError={persistence.lastError}
          onRetry={() => {
            persistence.retry().catch((error) => {
              console.warn('[ReportContent] 重试保存失败', error);
            });
          }}
        />

        <div className={styles['report-editor-container']}>
          <ReportEditor
            ref={reportEditorRef}
            initialValue={editorInitialValue}
            readonly={shouldEditorBeReadonly}
            onContentChange={draftSync.handleContentChange}
            onReferenceClick={handleReferenceClick}
            onAIGCButtonClick={handleAIGCButtonClick}
            aigcButtonDisabled={isGlobalBusy}
            onAIInvoke={startRewrite}
            textRewriteState={textRewriteState}
            onTextRewriteDecision={handleTextRewriteDecision}
          />
        </div>
      </div>
    </ChatRoomProvider>
  );
};

export const ReportContent: FC = () => {
  return <ReportContentInner />;
};
