import { OutlineView } from '@/components/outline/OutlineView';
import { useRPDetailSelector } from '@/store/reportContentStore';
import { selectIsServerLoading, selectOutlineViewChapters } from '@/store/reportContentStore/selectors';
import { FC } from 'react';
import { useReportDetailContext } from '../../../context/ReportDetail';
import styles from './index.module.less';

/**
 * 左侧大纲视图组件
 *
 * @description 提供报告大纲视图，支持章节导航和进度指示
 * @since 1.0.0
 * @author 开发团队
 *
 * @example
 * ```tsx
 * import { OutlineView } from '@/components/Report/OutlineView';
 *
 * <OutlineView />
 * ```
 *
 * @returns JSX.Element 左侧大纲视图组件
 */
export const RPLeftPanel: FC = () => {
  const outlineViewChapters = useRPDetailSelector(selectOutlineViewChapters);
  const isServerLoading = useRPDetailSelector(selectIsServerLoading);
  const { reportEditorRef } = useReportDetailContext();

  const handleChapterSelect = (chapterId: string) => {
    if (reportEditorRef?.current) {
      reportEditorRef.current.scrollToChapter(chapterId);
    }
  };

  return (
    <div className={styles['left-panel']}>
      <OutlineView treeData={outlineViewChapters} loading={isServerLoading} onSelect={handleChapterSelect} />
    </div>
  );
};
