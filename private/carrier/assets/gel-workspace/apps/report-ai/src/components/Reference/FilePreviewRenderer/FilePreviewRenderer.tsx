import { ImagePreview, UnsupportedFilePreview } from '@/components/File';
import { useFilePreview } from '@/hooks/useFilePreview';
import { detectFileType, isFilePreviewable } from '@/utils/file';
import { Alert, Spin } from '@wind/wind-ui';
import classNames from 'classnames';
import { useIntl } from 'gel-ui';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
export const FilePreviewRenderer: FC<FilePreviewRendererProps> = ({ file, style, className, onLoad, onError }) => {
  const t = useIntl();
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);

  // 使用文件预览 Hook 加载文件
  const { previewUrl, loading: apiLoading, error: apiError, fileName } = useFilePreview(file);

  // 检测文件类型
  const fileType = useMemo(() => detectFileType(file), [file]);

  // 合并加载状态
  const loading = apiLoading || contentLoading;
  const error = apiError || contentError;

  // 处理加载完成
  const handleLoad = useCallback(() => {
    setContentLoading(false);
    setContentError(null);
    onLoad?.();
  }, [onLoad]);

  // 处理加载错误
  const handleError = useCallback(
    (err: Error) => {
      setContentLoading(false);
      setContentError(err.message);
      onError?.(err);
    },
    [onError]
  );

  // 当 API 加载完成时，通知父组件
  useEffect(() => {
    if (!apiLoading && !apiError && previewUrl) {
      // API 加载完成，但内容还在加载中
      setContentLoading(true);
    }
  }, [apiLoading, apiError, previewUrl]);

  // 如果文件不可预览，直接显示不支持预览的组件
  if (!isFilePreviewable(file)) {
    return (
      <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
        <UnsupportedFilePreview file={file} />
      </div>
    );
  }

  // 如果无法生成预览URL，显示错误信息
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

  // 渲染对应的预览组件
  const renderPreviewContent = () => {
    if (!previewUrl) return null;

    const commonProps = {
      url: previewUrl,
      fileName: fileName,
      onLoad: handleLoad,
      onError: handleError,
      style: { height: '100%' },
    };

    switch (fileType) {
      case 'pdf':
        return <PDFPreviewWrapper {...commonProps} />;

      case 'image':
        return <ImagePreview {...commonProps} />;

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
      {/* 加载状态 */}
      {loading && (
        <div className={styles['file-preview-renderer__loading-overlay']}>
          <Spin size="large" />
          <div className={styles['file-preview-renderer__loading-text']}>{t('正在加载文件...')}</div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !loading && (
        <div className={styles['file-preview-renderer__error-container']}>
          <Alert
            message={t('文件加载失败')}
            description={error}
            type="error"
            showIcon
            action={
              apiError ? undefined : (
                <button
                  className={styles['file-preview-renderer__retry-button']}
                  onClick={() => {
                    setContentError(null);
                    setContentLoading(true);
                  }}
                >
                  {t('重试')}
                </button>
              )
            }
          />
        </div>
      )}

      {/* 预览内容 */}
      <div
        className={styles['file-preview-renderer__preview-content']}
        style={{
          display: loading || error ? 'none' : 'block',
          height: '100%',
        }}
      >
        {renderPreviewContent()}
      </div>
    </div>
  );
};

FilePreviewRenderer.displayName = 'FilePreviewRenderer';
