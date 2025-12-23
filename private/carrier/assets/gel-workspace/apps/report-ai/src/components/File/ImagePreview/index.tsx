import { Spin } from '@wind/wind-ui';
import { useIntl } from 'gel-ui';
import { FC, useCallback, useState } from 'react';
import styles from './index.module.less';
import { ImagePreviewProps } from './types';

export type { ImagePreviewProps, UnsupportedFilePreviewProps } from './types';

/**
 * 图片预览组件
 *
 * @description 支持图片文件的预览，包含加载状态和错误处理
 */
export const ImagePreview: FC<ImagePreviewProps> = ({ url, fileName, onLoad, onError, style, className }) => {
  const t = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    console.log(`图片加载成功: ${fileName}`);
    onLoad?.();
  }, [fileName, onLoad]);

  const handleImageError = useCallback(() => {
    setLoading(false);
    const errorMsg = `图片加载失败: ${fileName}`;
    setError(errorMsg);
    console.error(errorMsg);
    onError?.(new Error(errorMsg));
  }, [fileName, onError]);

  return (
    <div className={`${styles['image-preview']} ${className || ''}`} style={style}>
      {loading && (
        <div className={styles['loading-container']}>
          <Spin size="large" />
          <div className={styles['loading-text']}>{t('正在加载图片...')}</div>
        </div>
      )}

      {error && (
        <div className={styles['error-container']}>
          <div className={styles['error-icon']}>📷</div>
          <div className={styles['error-title']}>{t('图片加载失败')}</div>
          <div className={styles['error-message']}>{error}</div>
          <button
            className={styles['retry-button']}
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
          >
            {t('重试')}
          </button>
        </div>
      )}

      <img
        src={url}
        alt={fileName}
        className={styles['image-content']}
        style={{ display: loading || error ? 'none' : 'block' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

ImagePreview.displayName = 'ImagePreview';
