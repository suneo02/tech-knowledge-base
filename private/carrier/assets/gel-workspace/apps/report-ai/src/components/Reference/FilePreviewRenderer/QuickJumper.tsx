import { Button, Tooltip } from '@wind/wind-ui';
import { FC, memo, useCallback } from 'react';
import styles from './QuickJumper.module.less';
import { QuickJumperProps } from './types';

/**
 * PDF 章节快速跳转组件
 *
 * @description 显示文件关联的章节列表，支持快速跳转到对应页码
 * @see 设计文档 {@link ../../../../docs/specs/pdf-preview-trace-navigation/spec-design-v1.md}
 */
export const QuickJumper: FC<QuickJumperProps> = memo(({ chapters, onChapterClick }) => {
  const handleChapterClick = useCallback(
    (page: number) => {
      onChapterClick(page);
    },
    [onChapterClick]
  );

  if (chapters.length === 0) {
    return null;
  }

  return (
    <div className={styles['quick-jumper']}>
      <div className={styles['quick-jumper__label']}>章节导航：</div>
      <div className={styles['quick-jumper__tabs']}>
        {chapters.map((chapter, index) => (
          <Tooltip key={`${chapter.chapterId}-${index}`} title={`跳转到第 ${chapter.startPage} 页`}>
            <Button
              size="small"
              className={styles['quick-jumper__tab']}
              onClick={() => handleChapterClick(chapter.startPage)}
            >
              {chapter.chapterName}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
});

QuickJumper.displayName = 'QuickJumper';
