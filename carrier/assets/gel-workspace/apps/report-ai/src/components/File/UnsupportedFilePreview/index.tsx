import { getFileExtension } from '@/utils/file';
import { useIntl } from 'gel-ui';
import { FC } from 'react';
import styles from './index.module.less';
import { UnsupportedFilePreviewProps } from './types';

/**
 * 通用文件预览组件
 */

export type { UnsupportedFilePreviewProps } from './types';

/**
 * 不支持预览的文件组件
 *
 * @description 显示不支持预览的文件信息，提供下载选项
 */
export const UnsupportedFilePreview: FC<UnsupportedFilePreviewProps> = ({ file, style, className }) => {
  const t = useIntl();
  const fileExtension = getFileExtension(file.fileName || '');
  const fileSize = ''; // 暂时为空，等待后续API扩展

  const handleDownload = () => {
    if (file.fileId) {
      // TODO: 实现文件下载逻辑
      console.log(`下载文件: ${file.fileName}`);
      // window.open(`/api/files/${file.fileId}/download`)
    }
  };

  const getFileIcon = (extension: string): string => {
    const ext = extension.toLowerCase();

    // 文档类型
    if (['doc', 'docx'].includes(ext)) return '📄';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📽️';

    // 压缩文件
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '🗜️';

    // 音频文件
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) return '🎵';

    // 视频文件
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) return '🎥';

    // 其他文件
    return '📁';
  };

  return (
    <div className={`${styles['unsupported-preview']} ${className || ''}`} style={style}>
      <div className={styles['file-info']}>
        <div className={styles['file-icon']}>{getFileIcon(fileExtension)}</div>

        <div className={styles['file-details']}>
          <div className={styles['file-name']} title={file.fileName}>
            {file.fileName || t('未知文件')}
          </div>

          <div className={styles['file-meta']}>
            {fileExtension && <span className={styles['file-extension']}>{fileExtension.toUpperCase()}</span>}
            {fileSize && <span className={styles['file-size']}>{fileSize}</span>}
          </div>
        </div>
      </div>

      <div className={styles['preview-message']}>
        <div className={styles['message-title']}>{t('暂不支持预览此文件类型')}</div>
        <div className={styles['message-subtitle']}>{t('您可以下载文件到本地查看')}</div>
      </div>

      <div className={styles['actions']}>
        <button className={styles['download-button']} onClick={handleDownload} disabled={!file.fileId}>
          <span className={styles['download-icon']}>⬇️</span>
          {t('下载文件')}
        </button>
      </div>
    </div>
  );
};

UnsupportedFilePreview.displayName = 'UnsupportedFilePreview';
