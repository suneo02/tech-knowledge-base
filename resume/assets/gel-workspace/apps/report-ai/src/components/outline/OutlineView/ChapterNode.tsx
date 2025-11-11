import { getChapterKey } from '@/domain/chapter';
import { OutlineChapterViewModel } from '@/types/report';
import { type TreePath } from 'gel-util/common';
import { FC } from 'react';
import styles from './ChapterNode.module.less';
import { ChapterNodeBase } from './ChapterNodeBase';

interface ChapterNodeProps {
  chapter: OutlineChapterViewModel;
  level: number;
  chapterPath: TreePath;
  isExpanded: boolean;
  isSelected: boolean;
  expandedChapters: Set<string>;
  selectedChapter: string;
  onToggle: (chapterId: string) => void;
  onSelect: (chapterId: string) => void;
}

/**
 * 章节节点组件
 *
 * @description 负责渲染单个章节节点，支持层级展示、展开收起、状态指示、编写思路展示等功能
 * @since 1.0.0
 * @author 开发团队
 *
 * @param chapter - 章节数据
 * @param level - 当前层级深度
 * @param isExpanded - 是否展开
 * @param isSelected - 是否选中
 * @param expandedChapters - 展开的章节集合
 * @param selectedChapter - 当前选中的章节
 * @param onToggle - 展开/收起回调
 * @param onSelect - 选择回调
 *
 * @returns JSX.Element 章节节点组件
 */
export const ChapterNode: FC<ChapterNodeProps> = ({
  chapter,
  level,
  chapterPath,
  isExpanded,
  isSelected,
  expandedChapters,
  selectedChapter,
  onToggle,
  onSelect,
}) => {
  // 渲染子节点的函数
  const renderChildren = (children: OutlineChapterViewModel[]) => (
    <>
      {children.map((child, index) => {
        const childKey = getChapterKey(child);
        return (
          <ChapterNode
            key={childKey}
            chapter={child}
            level={level + 1}
            chapterPath={[...chapterPath, index]}
            isExpanded={expandedChapters.has(childKey)}
            isSelected={selectedChapter === childKey}
            expandedChapters={expandedChapters}
            selectedChapter={selectedChapter}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );

  return (
    <ChapterNodeBase
      chapter={chapter}
      level={level}
      chapterPath={chapterPath}
      isExpanded={isExpanded}
      isSelected={isSelected}
      showWritingThought={true}
      readonly={true}
      className={styles['chapter-item']}
      onToggle={onToggle}
      onSelect={onSelect}
      renderChildren={renderChildren}
    />
  );
};
