import { expandStateUtils, getAllChapterKeys, getChapterKey } from '@/domain/chapter';
import { OutlineChapterViewModel } from '@/types/report';
import { Button, Spin } from '@wind/wind-ui';
import { FC, useMemo, useState } from 'react';
import { ChapterNode } from './ChapterNode';
import styles from './index.module.less';

interface OutlineTabProps {
  treeData: OutlineChapterViewModel[];
  loading: boolean;
  onSelect: (chapterId: string) => void;
}

/**
 * 报告大纲展示组件
 *
 * @description 展示报告大纲结构，支持章节导航和进度指示
 * @since 1.0.0
 * @author 开发团队
 *
 * @param treeData - 大纲树形数据
 * @param loading - 是否正在加载
 *
 * @returns JSX.Element 报告大纲Tab组件
 */
export const OutlineView: FC<OutlineTabProps> = ({ treeData, loading, onSelect }) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  // 初始化展开所有节点
  useMemo(() => {
    setExpandedChapters(new Set(getAllChapterKeys(treeData)));
  }, [treeData]);

  // 处理章节展开/收起
  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapters(expandStateUtils.toggle(expandedChapters, chapterId));
  };

  // 处理章节选择
  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    onSelect(chapterId);
  };

  // 处理全部展开/收起
  const handleToggleAll = () => {
    if (expandStateUtils.isAllExpanded(treeData, expandedChapters)) {
      setExpandedChapters(expandStateUtils.collapseAll());
    } else {
      setExpandedChapters(expandStateUtils.expandAll(treeData));
    }
  };

  // 判断是否全部展开
  const isAllExpanded = expandStateUtils.isAllExpanded(treeData, expandedChapters);

  if (loading) {
    return (
      <div className={styles['outline-tab-content']}>
        <div className={styles['outline-loading']}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#8c8c8c' }}>正在加载大纲...</div>
        </div>
      </div>
    );
  }

  if (!treeData.length) {
    return (
      <div className={styles['outline-tab-content']}>
        <div className={styles['outline-empty']}>
          <div className={styles['empty-icon']}>📋</div>
          <div className={styles['empty-text']}>暂无大纲数据</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['outline-tab-content']}>
      {/* 大纲头部 */}
      <div className={styles['outline-header']}>
        <div className={styles['outline-title']}>报告大纲</div>
        <div className={styles['outline-actions']}>
          <Button size="small" onClick={handleToggleAll}>
            {isAllExpanded ? '全部收起' : '全部展开'}
          </Button>
        </div>
      </div>

      {/* 大纲内容 */}
      <div className={styles['outline-content']}>
        {treeData.map((chapter, index) => {
          const chapterKey = getChapterKey(chapter);
          return (
            <ChapterNode
              key={chapterKey}
              chapter={chapter}
              level={0}
              chapterPath={[index]}
              isExpanded={expandedChapters.has(chapterKey)}
              isSelected={selectedChapter === chapterKey}
              expandedChapters={expandedChapters}
              selectedChapter={selectedChapter}
              onToggle={handleToggleChapter}
              onSelect={handleChapterSelect}
            />
          );
        })}
      </div>
    </div>
  );
};
