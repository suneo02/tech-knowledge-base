import { RPFileUploaded } from '@/types';
import { FC } from 'react';
import { FileItem } from '../FileItem';
import styles from './index.module.less';

interface FileDisplayProps {
  files: RPFileUploaded[];
  onFileRemove?: (fileId: string) => void;
}

export const FileDisplay: FC<FileDisplayProps> = ({ files, onFileRemove }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={styles['file-display']}>
      <div className={styles['file-display-list']}>
        {files.map((file) => (
          <FileItem key={file.fileId} file={file} onRemove={onFileRemove} showRemoveButton={!!onFileRemove} />
        ))}
      </div>
    </div>
  );
};
