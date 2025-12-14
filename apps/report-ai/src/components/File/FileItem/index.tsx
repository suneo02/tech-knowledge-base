import { RPFileUploaded } from '@/types';
import { CheckO, CloseO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import { FC } from 'react';
import { ProgressCircle } from '../ProgressCircle';
import styles from './index.module.less';
import { detectFileType, getFileTypeColor } from './utils';

interface FileItemProps {
  file: RPFileUploaded;
  onRemove?: (fileId: string) => void;
  showRemoveButton?: boolean;
}

export const FileItem: FC<FileItemProps> = ({ file, onRemove, showRemoveButton = true }) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(file.fileId);
    }
  };

  const fileType = detectFileType(file.fileType, file.fileName);
  const fileTypeColor = getFileTypeColor(fileType);
  const uploadProgress = file.uploadProgress ?? 100; // 默认为完成状态
  const isCompleted = uploadProgress >= 100;

  return (
    <div className={styles['file-item']}>
      {/* 删除按钮 - 右上角 */}
      {showRemoveButton && onRemove && (
        <Button
          className={styles['file-item-remove']}
          onClick={handleRemove}
          icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        />
      )}

      {/* 文件类型图标区域 */}
      <div className={styles['file-item-icon']} style={{ backgroundColor: fileTypeColor }}>
        {isCompleted ? (
          <div className={styles['file-item-icon-check']}>
            <CheckO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </div>
        ) : (
          <div className={styles['file-item-icon-progress']}>
            <ProgressCircle
              progress={uploadProgress}
              size={24}
              radius={10}
              strokeWidth={2}
              strokeColor="white"
              backgroundColor="rgba(255, 255, 255, 0.3)"
              animated={true}
            />
          </div>
        )}
      </div>

      {/* 文件信息 */}
      <div className={styles['file-item-info']}>
        <div className={styles['file-item-name']}>{file.fileName || `文件_${file.fileId.slice(-8)}`}</div>
        <div className={styles['file-item-meta']}>
          <span className={styles['file-item-time']}>{new Date(file.uploadTime).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
