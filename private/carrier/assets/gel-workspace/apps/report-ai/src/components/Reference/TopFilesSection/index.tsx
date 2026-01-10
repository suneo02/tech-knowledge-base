import { RefPreviewData, RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';
import { FC, useCallback } from 'react';
import { ReferenceItemFile } from '../ReferenceItemFile';
import styles from './index.module.less';

export interface TopFilesSectionProps {
  files: RPFileUnified[];
  onPreviewStart?: (preview: RefPreviewData) => void;
  /** 删除成功后的回调（用于刷新列表等） */
  onDeleteSuccess?: (fileId: string) => void;
  /** 章节ID到章节对象的映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 确认重新生成关联章节的回调 */
  onRegenerateChapters?: (chapterIds: string[]) => void;
}

export const TopFilesSection: FC<TopFilesSectionProps> = ({
  files,
  onPreviewStart,
  onDeleteSuccess,
  chapterMap,
  onRegenerateChapters,
}) => {
  const handlePreview = useCallback(
    (file: RPFileUnified) => {
      const title = file.fileName || '未知文件';
      onPreviewStart?.({ type: 'file', id: file.fileId || '', title, data: file });
    },
    [onPreviewStart]
  );

  if (!files || files.length === 0) return null;

  return (
    <div className={styles['top-files-section']}>
      {files.map((file) => (
        <div key={`file:${file.fileId}`} className={styles['top-files-section__item-wrapper']}>
          <div className={styles['top-files-section__item-content']}>
            <ReferenceItemFile
              file={file}
              onDeleteSuccess={onDeleteSuccess}
              onClick={() => handlePreview(file)}
              chapterMap={chapterMap}
              onRegenerateChapters={onRegenerateChapters}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
