/**
 * 章节节点基础组件
 *
 * @description 提供章节节点的通用渲染逻辑，支持展示编写思路、层级结构等功能
 * @since 1.0.0
 * @author 开发团队
 */

import { entWebAxiosInstance } from '@/api/entWeb';
import { ArrowDown } from '@/assets/icon';
import { generateChapterHierarchicalNumber, getChapterKey } from '@/domain/chapter';
import { OutlineChapterViewModel } from '@/types/report';
import { getWsid, isDev } from '@/utils';
import classNames from 'classnames';
import { ChatRefCollapse } from 'gel-ui';
import { TreePath, isLeafNode } from 'gel-util/common';
import { FC, ReactNode } from 'react';
import styles from './ChapterNodeBase.module.less';

export interface ChapterNodeBaseProps {
  /** 章节数据 */
  chapter: OutlineChapterViewModel;
  /** 当前层级深度 */
  level: number;
  /** 章节在树结构中的路径 */
  chapterPath?: TreePath;
  /** 是否展开 */
  isExpanded: boolean;
  /** 是否选中 */
  isSelected: boolean;
  /** 是否显示编写思路 */
  showWritingThought?: boolean;
  /** 是否为只读模式 */
  readonly?: boolean;
  /** 自定义展开图标 */
  expandIcon?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
  /** 点击展开/收起的回调 */
  onToggle?: (chapterId: string) => void;
  /** 点击选择的回调 */
  onSelect?: (chapterId: string) => void;
  /** 编写思路变更回调 */
  onWritingThoughtChange?: (chapterId: string, newThought: string) => void;
  /** 子节点渲染函数 */
  renderChildren?: (children: OutlineChapterViewModel[]) => ReactNode;
}

/**
 * 章节节点基础组件
 *
 * 提供章节展示的通用逻辑，包括：
 * - 层级缩进显示
 * - 展开/收起功能
 * - 标题和编写思路展示（仅叶子节点显示编写思路）
 * - 选中状态处理
 *
 * @description 根据业务规则，只有叶子节点（没有子章节的节点）才会显示编写思路。
 * 这样的设计是因为：
 * 1. 叶子节点代表具体的内容章节，需要编写思路指导内容创作
 * 2. 非叶子节点主要起结构组织作用，不需要具体的编写思路
 * 3. 避免界面过于复杂，提升用户体验
 */
export const ChapterNodeBase: FC<ChapterNodeBaseProps> = ({
  chapter,
  level,
  chapterPath,
  isExpanded,
  isSelected,
  showWritingThought = false,
  expandIcon,
  className,
  onSelect,
  onToggle,
  renderChildren,
}) => {
  const hasChildren = chapter.children && chapter.children.length > 0;
  const indentStyle = { paddingLeft: `${level * 16 + 8}px` };

  // 直接从章节数据中获取引用资料
  const suggestionData = chapter.ragList || [];
  const tableData = chapter.dpuList || [];

  // 获取章节唯一键
  const chapterKey = getChapterKey(chapter);

  // 生成层级编号
  const hierarchicalNumber = chapterPath ? generateChapterHierarchicalNumber(chapterPath) : '';

  // 处理展开/收起
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(chapterKey);
  };

  // 处理选择
  const handleSelect = () => {
    onSelect?.(chapterKey);
  };

  // 处理编写思路变更

  return (
    <div className={classNames(styles['chapter-node-base'], className)}>
      {/* 章节主体内容 */}
      <div
        className={classNames(styles['chapter-content'], {
          [styles['chapter-selected']]: isSelected,
          [styles[`chapter-level-${Math.min(level, 3)}`]]: true,
        })}
        style={indentStyle}
        onClick={handleSelect}
      >
        {/* 展开图标区域 */}
        <div className={styles['icon-container']}>
          {hasChildren ? (
            expandIcon || (
              <ArrowDown
                onClick={handleToggle}
                className={classNames(styles['expand-icon'], {
                  [styles['expanded-icon']]: isExpanded,
                })}
              />
            )
          ) : (
            <div className={styles['icon-placeholder']} />
          )}
        </div>

        {/* 章节信息区域 */}
        <div className={styles['chapter-info']}>
          {/* 章节标题 */}
          <div className={styles['chapter-title-container']}>
            {/* 章节序号 */}
            {hierarchicalNumber && (
              <span
                className={classNames(styles['chapter-number'], {
                  [styles['chapter-number-level-0']]: level === 0,
                  [styles['chapter-number-level-1']]: level === 1,
                  [styles['chapter-number-level-2']]: level >= 2,
                })}
              >
                {hierarchicalNumber}
              </span>
            )}
            <span
              className={classNames(styles['chapter-title'], {
                [styles['chapter-title-level-0']]: level === 0,
                [styles['chapter-title-level-1']]: level === 1,
                [styles['chapter-title-level-2']]: level >= 2,
              })}
            >
              {chapter.title}
            </span>
          </div>

          {/* 章节引用资料 */}
          <ChatRefCollapse
            className={styles['chapter-ref-list']}
            ragList={suggestionData}
            dpuList={tableData}
            isDev={isDev}
            wsid={getWsid()}
            entWebAxiosInstance={entWebAxiosInstance}
          />

          {/* 编写思路 - 只在叶子节点显示 */}
          {showWritingThought && isLeafNode(chapter) && chapter.writingThought && (
            <div className={styles['writing-thought']}>
              <div className={styles['writing-thought-content']}>
                {chapter.writingThought.split('\n').map((line, index) => (
                  <div key={index} className={styles['writing-thought-line']}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 子节点区域 */}
      {hasChildren && isExpanded && renderChildren && (
        <div className={styles['chapter-children']}>{renderChildren(chapter.children!)}</div>
      )}
    </div>
  );
};
