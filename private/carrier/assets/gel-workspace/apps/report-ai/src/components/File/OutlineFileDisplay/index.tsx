import { RPOutlineFile } from '@/types/chat/RPOutline';
import { FC } from 'react';
import { OutlineFileItem } from '../OutlineFileItem';
import styles from './index.module.less';

interface FileDisplayProps {
  files: RPOutlineFile[];
  onFileRemove?: (fileId: string) => void;
}

export const OutlineFileDisplay: FC<FileDisplayProps> = ({ files, onFileRemove }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={styles['file-display']}>
      <div className={styles['file-display-list']}>
        {files.map((file) => (
          <OutlineFileItem key={file.fileId} file={file} onRemove={onFileRemove} showRemoveButton={!!onFileRemove} />
        ))}
      </div>
    </div>
  );
};
