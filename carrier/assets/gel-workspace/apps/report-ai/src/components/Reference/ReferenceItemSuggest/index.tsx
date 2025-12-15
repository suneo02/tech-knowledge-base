import { entWebAxiosInstance } from '@/api/entWeb';
import { RAGItemWithChapters } from '@/domain/chat/ref';
import { getWsid, isDev } from '@/utils';
import classNames from 'classnames';
import { ChatRAGItem } from 'gel-ui';
import { FC } from 'react';
import styles from './index.module.less';

export interface ReferenceItemSuggestProps {
  className?: string;
  data: RAGItemWithChapters;
  onClick?: () => void;
}

/**
 * 建议引用项组件
 *
 * @description 展示建议引用资料，包括建议内容
 */
export const ReferenceItemSuggest: FC<ReferenceItemSuggestProps> = ({ className, data, onClick }) => {
  return (
    <div className={classNames(styles['reference-item-suggest'], className)} onClick={onClick}>
      {/* 建议内容 */}
      <div className={styles['reference-item-suggest__content']}>
        <ChatRAGItem data={data} isDev={isDev} wsid={getWsid()} entWebAxiosInstance={entWebAxiosInstance} />
      </div>
    </div>
  );
};
