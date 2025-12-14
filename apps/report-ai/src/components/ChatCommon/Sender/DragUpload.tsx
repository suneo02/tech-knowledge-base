import { useFileUploadWithProgress } from '@/hooks/useFileUploadWithProgress';
import { useCallback, useRef, useState } from 'react';
import { getSupportedFormatsText } from '../../../utils/fileValidation';
import { useChatSenderContext } from './context';
import styles from './index.module.less';

interface DragUploadProps {
  children: React.ReactNode;
}

/**
 * 拖拽上传组件
 * 使用 Context 获取文件管理状态，无需外部传递回调
 */
export const DragUpload: React.FC<DragUploadProps> = ({ children }) => {
  const { handleUploadSuccess, handleUploadStart, handleUploadProgress } = useChatSenderContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragProcessing, setIsDragProcessing] = useState(false);
  const dragCounterRef = useRef(0);

  // 使用带进度追踪的上传逻辑
  const { uploadFile } = useFileUploadWithProgress({
    onUploadSuccess: (file) => {
      setIsDragProcessing(false);
      setIsDragOver(false);
      handleUploadSuccess(file);
    },
    onUploadError: () => {
      setIsDragProcessing(false);
      setIsDragOver(false);
    },
    onUploadFailed: () => {
      setIsDragProcessing(false);
      setIsDragOver(false);
    },
    onUploadStart: handleUploadStart,
    onUploadProgress: handleUploadProgress,
  });

  // 处理文件上传
  const handleFileUpload = useCallback(
    (files: FileList) => {
      if (files.length === 0) return;

      setIsDragProcessing(true);

      // 只处理第一个文件
      const file = files[0];
      uploadFile(file);
    },
    [uploadFile]
  );

  // 拖拽事件处理
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload]
  );

  // 粘贴事件处理
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        const fileList = new DataTransfer();
        files.forEach((file) => fileList.items.add(file));
        handleFileUpload(fileList.files);
      }
    },
    [handleFileUpload]
  );

  return (
    <div
      className={styles['drag-upload-container']}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {/* 拖拽上传区域 */}
      {isDragOver && (
        <div className={styles['drag-overlay']}>
          <div className={styles['drag-content']}>
            {isDragProcessing ? (
              <>
                <div className={styles['drag-icon']}>⏳</div>
                <div className={styles['drag-text']}>正在处理...</div>
              </>
            ) : (
              <>
                <div className={styles['drag-icon']}>📁</div>
                <div className={styles['drag-text']}>释放文件上传</div>
                <div className={styles['drag-hint']}>支持：{getSupportedFormatsText()}</div>
              </>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
