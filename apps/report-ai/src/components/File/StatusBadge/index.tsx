import { getFileStatusDisplay } from '@/components/File/fileStatusDisplay';
import { RPFileUnified } from '@/types/file';
import { Button, Spin } from '@wind/wind-ui';
import { message, Typography } from 'antd';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { FinancialReportIframeModal } from '../FinancialReportIframeModal';
import styles from './index.module.less';

const { Text } = Typography;

export interface FileStatusBadgeProps {
  className?: string;
  file: RPFileUnified;
}

/**
 * 文件状态徽章组件
 *
 * @description 展示文件的异常或进行中状态，不展示成功状态
 */
export const FileStatusBadge: FC<FileStatusBadgeProps> = ({ className, file }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const statusDisplay = getFileStatusDisplay(file.status);

  // 只展示异常或进行中状态
  const shouldShow = statusDisplay.type === 'error' || statusDisplay.type === 'processing';

  if (!shouldShow || !statusDisplay.text) {
    return null;
  }

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.docId) {
      message.error('财报文件不存在！');
      return;
    }

    setModalOpen(true);
  };

  return (
    <>
      <div className={classNames(styles['file-status-badge'], className)}>
        <Text
          className={classNames(
            styles['file-status-badge__text'],
            styles[`file-status-badge__text--${statusDisplay.type}`]
          )}
        >
          {statusDisplay.text}
        </Text>
        {statusDisplay.loading && <Spin size="small" className={styles['file-status-badge__loading']} />}
        {statusDisplay.showViewButton && (
          <Button
            type="link"
            size="small"
            className={styles['file-status-badge__view-button']}
            onClick={handleViewClick}
          >
            点击查看
          </Button>
        )}
      </div>

      <FinancialReportIframeModal visible={modalOpen} onClose={() => setModalOpen(false)} docId={file.docId} />
    </>
  );
};
