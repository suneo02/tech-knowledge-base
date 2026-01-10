import { Input, Tag } from '@wind/wind-ui';
import { TreePath } from 'gel-util/common';
import React, { useCallback, useMemo, useState } from 'react';
import { selectChapterByPath, useOutlineState } from '../../context';
import { useOutlineOperationsContext } from '../../context/operations';
import styles from './OutlineItemKeywords.module.less';

interface OutlineItemKeywordsProps {
  path: TreePath;
  readonly: boolean;
}

/**
 * 关键词编辑区域
 *
 * - 已有关键词以 Tag 形式展示
 * - 输入框回车即可新增关键词；重复或空值会被忽略
 * - Tag 支持在可编辑模式下移除
 */
export const OutlineItemKeywords: React.FC<OutlineItemKeywordsProps> = ({ path, readonly }) => {
  const state = useOutlineState();
  const { updateKeywords, markUnsaved } = useOutlineOperationsContext();
  const chapter = selectChapterByPath(state, path);
  const keywords = useMemo(() => chapter?.keywords ?? [], [chapter?.keywords]);

  const [inputValue, setInputValue] = useState('');

  const commitAdd = useCallback(() => {
    const nextKeyword = inputValue.trim();
    if (!nextKeyword) return;

    const nextKeywords = [...keywords, nextKeyword];
    markUnsaved();
    updateKeywords(path, nextKeywords).catch((error) => {
      console.error('Add keyword failed:', error);
    });
    setInputValue('');
  }, [inputValue, keywords, markUnsaved, path, updateKeywords]);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      const nativeEvent = event.nativeEvent as KeyboardEvent & { isComposing?: boolean };
      if (nativeEvent.isComposing) return;
      event.preventDefault();
      commitAdd();
    },
    [commitAdd]
  );

  const handleRemove = useCallback(
    (keyword: string) => {
      const nextKeywords = keywords.filter((item) => item !== keyword);
      markUnsaved();
      updateKeywords(path, nextKeywords).catch((error) => {
        console.error('Remove keyword failed:', error);
      });
    },
    [keywords, markUnsaved, path, updateKeywords]
  );

  if (!chapter) {
    return null;
  }

  return (
    <div className={styles['keywords-section']}>
      {/* 标题 */}
      <div className={styles['keywords-section__title']}>提取字段</div>

      {readonly ? (
        // 只读模式：简单显示关键词
        <div className={styles['keywords-section__readonly-container']}>
          {keywords.length > 0 ? (
            keywords.map((keyword) => (
              <Tag key={keyword} className={styles['keywords-section__readonly-tag']}>
                {keyword}
              </Tag>
            ))
          ) : (
            <span className={styles['keywords-section__placeholder']}>暂无关键词</span>
          )}
        </div>
      ) : (
        // 编辑模式：关键词在输入框内部
        <div className={styles['keywords-section__input-container']}>
          <div className={styles['keywords-section__tags-wrapper']}>
            {keywords.map((keyword) => (
              <Tag
                key={keyword}
                closable
                size="small"
                onClose={(event) => {
                  event.preventDefault();
                  handleRemove(keyword);
                }}
                className={styles['keywords-section__inline-tag']}
              >
                {keyword}
              </Tag>
            ))}
            <Input
              size="small"
              value={inputValue}
              placeholder={keywords.length === 0 ? '在空白处输入，并按回车添加字段' : ''}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              className={styles['keywords-section__inline-input']}
              allowClear
            />
          </div>
        </div>
      )}
    </div>
  );
};
