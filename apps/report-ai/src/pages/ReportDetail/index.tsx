import { GenerationControllers } from '@/store/reportContentStore/controllers/GenerationControllers';
import { ChatRoomProvider } from 'ai-ui';
import classNames from 'classnames';
import { LayoutStateProvider, useLayoutStateContext } from '../../context/LayoutState';
import { ReportDetailProvider } from '../../context/ReportDetail';
import { useCollapsedSidebar } from '../../hooks/usePageSidebar';
import { selectReportId, useReportContentSelector } from '../../store/reportContentStore';
import { ReportContentRTKScope } from '../../store/reportContentStore/provider';
import { ChatSync } from './ChatSync';
import { ReportDetailHeader } from './Header';
import { useInitReportContent } from './hook';
import styles from './index.module.less';
import { RPLeftPanel } from './LeftPanel';
import { LeftPanelToggle } from './LeftPanelToggle';
import { ReportContent } from './ReportContent';
import { RPRightPanel } from './RightPanel';

/**
 * 报告详情内部组件
 *
 * @description 处理报告详情页面的核心布局和功能
 * @since 1.0.0
 */
const ReportDetailInner: React.FC = () => {
  useInitReportContent();

  // 获取布局状态
  const { isPreviewExpanded, restoreNormalLayout } = useLayoutStateContext();
  // 获取是否需要兼容性修复的标志
  const reportId = useReportContentSelector(selectReportId);

  // 处理左侧面板展开事件
  const handleLeftPanelExpand = () => {
    restoreNormalLayout();
  };

  return (
    <>
      <ChatSync id={reportId} />
      <GenerationControllers />
      <div className={styles['report-detail']}>
        <div className={styles['report-detail-inner']}>
          <ReportDetailHeader />
          <div
            className={classNames(styles['report-detail-content'], {
              [styles['preview-expanded']]: isPreviewExpanded,
            })}
          >
            <div
              className={classNames(styles['report-detail-left'], {
                [styles['collapsed']]: isPreviewExpanded,
              })}
            >
              <RPLeftPanel />
              <LeftPanelToggle isCollapsed={isPreviewExpanded} onExpand={handleLeftPanelExpand} />
            </div>
            <ReportContent />
            <div
              className={classNames(styles['report-detail-right'], {
                [styles['expanded']]: isPreviewExpanded,
              })}
            >
              <RPRightPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 报告详情页面组件
 *
 * @description 提供报告详情功能的主页面，包含聊天和报告内容展示
 * @since 1.0.0
 */
export const ReportDetail: React.FC = () => {
  useCollapsedSidebar();
  return (
    <ChatRoomProvider>
      <ReportContentRTKScope>
        <ReportDetailProvider>
          <LayoutStateProvider>
            <ReportDetailInner />
          </LayoutStateProvider>
        </ReportDetailProvider>
      </ReportContentRTKScope>
    </ChatRoomProvider>
  );
};
