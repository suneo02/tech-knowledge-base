import { ImagePreview, UnsupportedFilePreview } from '@/components/File';
import { useFilePreview } from '@/hooks/useFilePreview';
import { detectFileType, isFilePreviewable } from '@/utils/file';
import { Alert, Spin } from '@wind/wind-ui';
import classNames from 'classnames';
import { useIntl } from 'gel-ui';
import { FC, useMemo } from 'react';
import styles from './FilePreviewRenderer.module.less';
import { PDFPreviewWrapper } from './PDFPreviewWrapper';
import { FilePreviewRendererProps } from './types';

/**
 * 文件预览渲染器组件
 *
 * @description 根据文件类型自动选择合适的预览组件，支持PDF、图片等多种格式
 * 使用 report/preview 接口加载文件内容
 *
 * @see 设计文档 {@link ../../../../docs/RPDetail/Reference/02-design.md}
 *
 * @example
 * ```tsx
 * <FilePreviewRenderer
 *   file={fileData}
 *   onLoad={() => console.log('文件加载完成')}
 *   onError={(error) => console.error('文件加载失败', error)}
 * />
 * ```
 */
export const FilePreviewRenderer: FC<FilePreviewRendererProps> = ({
  file,
  initialPage,
  chapterMap,
  style,
  className,
  onLoad,
  onError,
}) => {
  const t = useIntl();

  // 使用文件预览 Hook 加载文件
  const { previewUrl, loading: apiLoading, error: apiError, fileName } = useFilePreview(file);

  // 检测文件类型
  const fileType = useMemo(() => detectFileType(file), [file]);

  // 如果文件不可预览，直接显示不支持预览的组件
  if (!isFilePreviewable(file)) {
    return (
      <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
        <UnsupportedFilePreview file={file} />
      </div>
    );
  }

  // FIXED: 简化异常处理逻辑，只处理 API 层错误，子组件自己处理内容加载状态
  // @see ../../../../docs/issues/pdf-preview-issues.md

  // API 加载中，显示加载状态
  if (apiLoading) {
    return (
      <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
        <div className={styles['file-preview-renderer__loading-overlay']}>
          <Spin size="large" />
          <div className={styles['file-preview-renderer__loading-text']}>{t('正在获取文件...')}</div>
        </div>
      </div>
    );
  }

  // API 加载失败，显示错误
  if (apiError) {
    return (
      <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
        <div className={styles['file-preview-renderer__error-container']}>
          <Alert message={t('文件加载失败')} description={apiError} type="error" showIcon />
        </div>
      </div>
    );
  }

  // API 加载完成但没有 URL，显示错误
  if (!previewUrl) {
    return (
      <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
        <div className={styles['file-preview-renderer__error-container']}>
          <Alert
            message={t('预览失败')}
            description={t('无法获取文件预览地址，请检查文件是否存在')}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  // 渲染对应的预览组件（子组件自己处理加载和错误状态）
  const renderPreviewContent = () => {
    switch (fileType) {
      case 'pdf':
      case 'word':
        // Word 文件后端会转换为 PDF，使用 PDF 预览组件
        return (
          <PDFPreviewWrapper
            url={previewUrl}
            fileName={fileName}
            initialPage={initialPage}
            file={file}
            chapterMap={chapterMap}
            onLoad={onLoad}
            style={{ height: '100%' }}
          />
        );

      case 'image':
        return (
          <ImagePreview
            url={previewUrl}
            fileName={fileName}
            onLoad={onLoad}
            onError={onError}
            style={{ height: '100%' }}
          />
        );

      case 'text':
        // TODO: 实现文本预览组件
        return (
          <div className={styles['file-preview-renderer__coming-soon']}>
            <div className={styles['file-preview-renderer__coming-soon-icon']}>📝</div>
            <div className={styles['file-preview-renderer__coming-soon-title']}>{t('文本预览')}</div>
            <div className={styles['file-preview-renderer__coming-soon-message']}>{t('文本文件预览功能即将推出')}</div>
          </div>
        );

      default:
        return <UnsupportedFilePreview file={file} />;
    }
  };

  return (
    <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
      {renderPreviewContent()}
    </div>
  );
};

FilePreviewRenderer.displayName = 'FilePreviewRenderer';
