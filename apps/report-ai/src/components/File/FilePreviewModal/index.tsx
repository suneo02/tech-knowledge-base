import { FilePreviewRenderer } from '@/components/Reference/FilePreviewRenderer';
import { Modal } from '@wind/wind-ui';
import { RPFileListItem } from 'gel-api';
import { FC, useCallback } from 'react';
import styles from './index.module.less';

export interface FilePreviewModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 当前预览的文件 */
  file: RPFileListItem | null;
  /** 关闭模态框的回调 */
  onClose: () => void;
}

/**
 * 文件预览模态框组件
 *
 * @description 用于预览文件内容的模态框，基于FilePreviewRenderer组件实现
 */
export const FilePreviewModal: FC<FilePreviewModalProps> = ({ visible, file, onClose }) => {
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      title={file?.fileName || '文件预览'}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width="80%"
      className={styles['file-preview-modal']}
      destroyOnClose
    >
      {file && (
        <div className={styles['file-preview-content']}>
          <FilePreviewRenderer
            file={{
              fileId: file.fileID,
              fileName: file.fileName,
              status: file.status,
            }}
            style={{ height: '70vh' }}
          />
        </div>
      )}
    </Modal>
  );
};
