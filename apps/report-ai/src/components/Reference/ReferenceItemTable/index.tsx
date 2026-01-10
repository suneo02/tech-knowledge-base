import { DPUItemWithChapters } from '@/domain/chat/ref';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ChatRefRow } from 'gel-ui';
import { t } from 'gel-util/intl';
import { FC } from 'react';
import styles from './index.module.less';

export interface ReferenceItemTableProps {
  className?: string;
  data: DPUItemWithChapters;
  onModalClose?: () => void;
  onModalOpen?: () => void;
  onClick?: () => void;
}

/**
 * 表格引用项组件
 *
 * @description 展示表格引用资料，包括表格内容
 */
export const ReferenceItemTable: FC<ReferenceItemTableProps> = ({ className, data, onClick }) => {
  return (
    <div className={classNames(styles['reference-item-table'], className)}>
      {/* 表格内容 */}
      <div className={styles['reference-item-table__content']}>
        <ChatRefRow
          className={className}
          text={`查看数据：${data.rawSentence || ''}`}
          tagText={t('454654', '数据')}
          tagType="Data"
          publishdate={dayjs().format('YYYY-MM-DD')}
          canJump={true}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
