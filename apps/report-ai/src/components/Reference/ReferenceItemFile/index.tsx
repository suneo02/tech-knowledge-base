import { RPChapterEnriched } from '@/types';
import { RPFileUnified } from '@/types/file';
import { DeleteO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import { Typography } from 'antd';
import classNames from 'classnames';
import { RefTag } from 'gel-ui';
import { FC } from 'react';
import { FileStatusBadge } from '../../File/StatusBadge';
import { FileDeleteWithRegeneration } from '../FileDeleteWithRegeneration';
import styles from './index.module.less';

const { Text } = Typography;

export interface ReferenceItemFileProps {
  className?: string;
  file: RPFileUnified;
  /** 删除成功后的回调（用于刷新列表等） */
  onDeleteSuccess?: (fileId: string) => void;
  onClick?: () => void;
  /** 章节ID到章节对象的映射 */
  chapterMap?: Map<string, RPChapterEnriched>;
  /** 确认重新生成关联章节的回调 */
  onRegenerateChapters?: (chapterIds: string[]) => void;
}

/**
 * 文件引用项组件
 *
 * @description 展示文件引用资料，包括文件名、解析状态和删除功能
 * 删除文件时会提示用户该文件关联的章节，并在删除成功后询问是否重新生成这些章节
 */
export const ReferenceItemFile: FC<ReferenceItemFileProps> = ({
  className,
  file,
  onDeleteSuccess,
  onClick,
  chapterMap,
  onRegenerateChapters,
}) => {
  const canJump = !!onClick;

  return (
    <div className={classNames(styles['reference-item-file'], className)}>
      <div className={styles['reference-item-file__main']}>
        <RefTag tagType="file" tagText="文件" className={styles['reference-item-file__tag']} type="secondary" />

        <div className={styles['reference-item-file__title-wrapper']} onClick={onClick}>
          <Text
            ellipsis={{
              tooltip: file.fileName,
            }}
            className={classNames(styles['reference-item-file__title'], {
              [styles['reference-item-file__title--clickable']]: canJump,
            })}
          >
            {file.fileName}
          </Text>
        </div>

        <FileDeleteWithRegeneration
          file={file}
          onDeleteSuccess={onDeleteSuccess}
          chapterMap={chapterMap}
          onRegenerateChapters={onRegenerateChapters}
        >
          <Button
            type="text"
            className={styles['reference-item-file__delete']}
            icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          />
        </FileDeleteWithRegeneration>
      </div>

      {/* 文件状态展示 - 另起一行 */}
      <FileStatusBadge file={file} className={styles['reference-item-file__status']} />
    </div>
  );
};
