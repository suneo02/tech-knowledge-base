import { PreviewArea } from '@/components/common';
import { ReferenceMap, RPReferenceItem } from '@/domain/chat';
import { ReportReferenceOrdinalMap } from '@/domain/reportReference';
import { ReferenceViewHandle, RefPreviewData, RPChapterEnriched } from '@/types';
import { RPFileUnified, RPFileUploaded } from '@/types/file';
import { useIntl } from 'gel-ui';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { ReferencePreviewContent } from '../ReferencePreviewContent';
import { ReportFileUpload } from '../ReportFileUpload';
import { RPReferenceListWithChapter, RPReferenceListWithChapterHandle } from '../RPReferenceListWithChapter';
import { useReferencePreview } from '../useReferencePreview';
import styles from './index.module.less';

/**
 * 引用资料视图组件
 *
 * @description 展示报告中所有的引用资料，包括：
 * 1. 数据表格 (DPU)
 * 2. 建议资料 (RAG)
 * 3. 文件 (File)
 *
 * @see 需求文档 {@link ../../../../docs/RPDetail/Reference/01-requirement.md}
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 *
 * 所有引用资料都从章节数据中提取，统一由 Redux selector 处理
 */

export interface RPReferenceViewProps {
  loading: boolean;
  reportId: string | undefined;
  referenceMap: ReferenceMap;
  refList: RPReferenceItem[];
  ordinalMap?: ReportReferenceOrdinalMap;
  topFiles?: RPFileUnified[];
  /** 删除成功后的回调（用于刷新列表等） */
  onDeleteSuccess?: (fileId: string) => void;
  onPreviewStart?: (previewData: RefPreviewData) => void;
  onPreviewEnd?: () => void;
  onFileUploadSuccess?: (fileInfo: RPFileUploaded) => void;
  /** 章节ID到章节对象的映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 确认重新生成关联章节的回调 */
  onRegenerateChapters?: (chapterIds: string[]) => void;
}

export const RPReferenceView = forwardRef<ReferenceViewHandle, RPReferenceViewProps>(
  (
    {
      loading,
      reportId,
      referenceMap,
      refList,
      ordinalMap,
      topFiles,
      onDeleteSuccess,
      onPreviewStart,
      onPreviewEnd,
      onFileUploadSuccess,

      chapterMap,
      onRegenerateChapters,
    },
    ref
  ) => {
    const t = useIntl();

    // 引用列表组件的 ref，用于调用聚焦方法
    const listRef = useRef<RPReferenceListWithChapterHandle>(null);

    /**
     * 处理 RAG 类型的聚焦请求
     */
    const handleRagFocus = useCallback((id: string) => {
      listRef.current?.focusById(id);
    }, []);

    // 使用自定义 hook 处理预览逻辑
    const {
      previewMode,
      currentPreviewData,
      handlePreviewStart,
      handleBackToList,
      previewById,
      closePreview,
      isPreviewOpen,
      getCurrentPreviewId,
    } = useReferencePreview(referenceMap, onPreviewStart, onPreviewEnd, handleRagFocus);

    /**
     * 暴露给外部的命令式 API
     */
    useImperativeHandle(
      ref,
      () => ({
        /**
         * 根据 ID 和类型预览资料
         */
        previewById,
        /**
         * 关闭预览
         */
        closePreview,
        /**
         * 检查是否有预览正在显示
         */
        isPreviewOpen,
        /**
         * 获取当前预览的资料 ID
         */
        getCurrentPreviewId,
      }),
      [previewById, closePreview, isPreviewOpen, getCurrentPreviewId]
    );

    return (
      <div className={styles['reference-view']}>
        <div className={styles['reference-view__header']}>
          <div>{t('参考资料列表')}</div>
          <div>{reportId ? <ReportFileUpload reportId={reportId} onUploadSuccess={onFileUploadSuccess} /> : null}</div>
        </div>
        <div className={styles['reference-view__content']}>
          <PreviewArea
            mode={previewMode}
            listContent={
              <RPReferenceListWithChapter
                ref={listRef}
                refList={refList}
                loading={loading}
                ordinalMap={ordinalMap}
                topFiles={topFiles}
                onDeleteSuccess={onDeleteSuccess}
                onPreviewStart={handlePreviewStart}
                chapterMap={chapterMap}
                onRegenerateChapters={onRegenerateChapters}
              />
            }
            previewContent={
              <ReferencePreviewContent
                previewData={currentPreviewData}
                onBackToList={handleBackToList}
                chapterMap={chapterMap}
              />
            }
          />
        </div>
      </div>
    );
  }
);

RPReferenceView.displayName = 'RPReferenceView';
