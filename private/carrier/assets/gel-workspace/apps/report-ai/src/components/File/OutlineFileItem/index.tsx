import { detectFileType, getFileTypeColor } from '@/domain/file';
import { RPFileUploaded } from '@/types';
import { CheckO, CloseO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import { RPFile } from 'gel-api';
import { FC } from 'react';
import { ProgressCircle } from '../ProgressCircle';
import { FileStatusBadge } from '../StatusBadge';
import styles from './index.module.less';

interface FileItemProps {
  file: RPFileUploaded | RPFile;
  onRemove?: (fileId: string) => void;
  showRemoveButton?: boolean;
}

export const OutlineFileItem: FC<FileItemProps> = ({ file, onRemove, showRemoveButton = true }) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(file.fileId);
    }
  };

  const fileType = detectFileType('fileType' in file ? file.fileType : undefined, file.fileName);
  const fileTypeColor = getFileTypeColor(fileType);
  // 获取上传进度，RPFileUnified 可能没有 uploadProgress 字段
  const uploadProgress: number =
    'uploadProgress' in file && typeof file.uploadProgress === 'number' ? file.uploadProgress : 100;
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
          {/* 使用 StatusBadge 显示文件解析状态 */}
          {'status' in file ? <FileStatusBadge file={file} className={styles['file-item-status-badge']} /> : null}
        </div>
      </div>
    </div>
  );
};
