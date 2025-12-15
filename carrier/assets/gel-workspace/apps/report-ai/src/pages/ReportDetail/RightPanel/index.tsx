import { PreviewData, RPReferenceView } from '@/components/Reference';
import { useFullDocGeneration, useMultiChapterGeneration, useReportFiles } from '@/store/reportContentStore/hooks';
import {
  selectCanonicalChaptersEnrichedMap,
  selectPendingFileIds,
  selectSortedReferences,
  selectTopReportFiles,
} from '@/store/reportContentStore/selectors';
import { RPFileUploaded } from '@/types';
import { message } from '@wind/wind-ui';
import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLayoutStateContext } from '../../../context/LayoutState';
import { useReportDetailContext } from '../../../context/ReportDetail';
import { FileStatusUpdate, useFileStatusPolling } from '../../../hooks/useFileStatusPolling';
import {
  rpContentActions,
  selectReferenceMap,
  selectReferenceOrdinalMap,
  selectReportId,
  useReportContentSelector,
} from '../../../store/reportContentStore';
import styles from './index.module.less';

/**
 * 右侧参考资料视图组件
 *
 * @description 展示报告相关的参考资料和数据表格
 * @since 1.0.0
 * @author 开发团队
 *
 * @example
 * ```tsx
 * import { RPRightPanel } from '@/pages/ReportDetail/RightPanel';
 *
 * <RPRightPanel />
 * ```
 *
 * @returns JSX.Element 右侧参考资料视图组件
 */
export const RPRightPanel: FC = () => {
  const dispatch = useDispatch();
  const { expandForPreview, restoreNormalLayout } = useLayoutStateContext();
  const { referenceViewRef } = useReportDetailContext();

  // 获取当前报告 ID，用于上传文件
  const reportId = useReportContentSelector(selectReportId);

  // 使用 Redux selector 获取引用资料查找 Map（统一数据源）
  const referenceMap = useReportContentSelector(selectReferenceMap);

  // 获取带状态的引用列表（从 reportFiles 获取最新状态）
  const refList = useReportContentSelector(selectSortedReferences);

  // 获取全局引用序号映射
  const ordinalMap = useReportContentSelector(selectReferenceOrdinalMap);

  // 报告文件管理 Hook - 自动获取文件并同步到 Redux
  const { refreshFiles } = useReportFiles();

  // 从 Redux 读取报告级文件与置顶文件列表（派生）
  const topFiles = useReportContentSelector(selectTopReportFiles);

  // 获取待处理文件 ID 列表
  const pendingFileIds = useReportContentSelector(selectPendingFileIds);

  // 文件状态更新回调：将状态更新到 Redux
  const handleFileStatusUpdate = useCallback(
    (statuses: FileStatusUpdate[]) => {
      dispatch(rpContentActions.batchUpdateFileStatus(statuses));
    },
    [dispatch]
  );

  // 启用文件状态轮询
  const { isPolling, pendingCount } = useFileStatusPolling({
    pendingFileIds,
    onStatusUpdate: handleFileStatusUpdate,
  });

  // 在控制台输出轮询状态（仅用于调试）
  if (isPolling) {
    console.log(`[RPRightPanel] 正在轮询 ${pendingCount} 个文件的解析状态`);
  }

  // 全文生成 Hook
  const { startGeneration } = useFullDocGeneration();

  // 多章节生成 Hook
  const { startGeneration: startMultiChapterGeneration } = useMultiChapterGeneration();

  // 获取章节映射
  const chapterMap = useReportContentSelector(selectCanonicalChaptersEnrichedMap);

  // 文件上传成功回调：刷新文件列表
  const handleFileUploadSuccess = useCallback(
    (fileInfo: RPFileUploaded) => {
      // 刷新文件列表，获取最新的文件数据（包含文件状态）
      // refreshFiles() 会更新 state.reportFiles，新文件会自动出现在 selectFileUnifiedMap 中
      // 文件状态轮询会自动处理后续的状态更新
      refreshFiles();
    },
    [refreshFiles]
  );

  // 处理预览开始事件
  const handlePreviewStart = useCallback(
    (previewData: PreviewData) => {
      console.log('预览开始:', previewData);
      // 扩展布局以适应预览
      expandForPreview();
      // 这里可以添加其他预览开始时的逻辑，比如埋点统计等
    },
    [expandForPreview]
  );

  // 处理预览结束事件（返回列表）
  const handlePreviewEnd = useCallback(() => {
    console.log('预览结束，恢复正常布局');
    // 恢复正常布局
    restoreNormalLayout();
  }, [restoreNormalLayout]);

  // 处理文件删除成功
  const handleDeleteSuccess = useCallback(() => {
    // 刷新文件列表
    refreshFiles();
  }, [refreshFiles]);

  // 处理重新生成关联章节
  const handleRegenerateChapters = useCallback(
    (chapterIds: string[]) => {
      if (chapterIds.length === 0) {
        return;
      }

      console.log('[RPRightPanel] 开始重新生成章节:', chapterIds);
      startMultiChapterGeneration(chapterIds);
      message.success(`已开始重新生成 ${chapterIds.length} 个章节`);
    },
    [startMultiChapterGeneration]
  );

  return (
    <div className={styles['right-panel']}>
      <div className={styles['right-panel-content']}>
        <RPReferenceView
          ref={referenceViewRef}
          loading={false}
          reportId={reportId}
          referenceMap={referenceMap}
          refList={refList}
          ordinalMap={ordinalMap}
          topFiles={topFiles}
          onDeleteSuccess={handleDeleteSuccess}
          onPreviewStart={handlePreviewStart}
          onPreviewEnd={handlePreviewEnd}
          onFileUploadSuccess={handleFileUploadSuccess}
          onRegenerationConfirm={startGeneration}
          chapterMap={chapterMap}
          onRegenerateChapters={handleRegenerateChapters}
        />
      </div>
    </div>
  );
};
