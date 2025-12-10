import { PDFViewer } from '@/components/File';
import classNames from 'classnames';
import { FC, useCallback } from 'react';
import styles from './PDFPreviewWrapper.module.less';
import { PDFPreviewWrapperProps } from './types';

/**
 * PDF预览包装器组件
 *
 * @description 封装PDFPreview组件，提供统一的加载状态和错误处理
 */
export const PDFPreviewWrapper: FC<PDFPreviewWrapperProps> = ({ url, fileName, onLoad, style, className }) => {
  const handleDocumentLoad = useCallback(
    (totalPages: number) => {
      console.log(`PDF文档加载成功: ${fileName}, 总页数: ${totalPages}`);
      onLoad?.();
    },
    [fileName, onLoad]
  );

  return (
    <div className={classNames(styles['pdf-preview-wrapper'], className)} style={style}>
      <PDFViewer
        source={{ url }}
        fileName={fileName}
        onTotalChange={handleDocumentLoad}
        showHeader={false}
        showToolbar={true}
      />
    </div>
  );
};

PDFPreviewWrapper.displayName = 'PDFPreviewWrapper';
