/**
 * 带进度追踪的文件上传 Hook
 *
 * @description
 * 在基础上传功能之上，增加进度追踪和动画
 * 适用于需要显示上传进度的场景
 *
 * @see {@link ./useFileUpload.ts | 基础文件上传 Hook}
 */

import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';
import { useCallback, useEffect, useRef } from 'react';
import { PROGRESS_PRESETS, ProgressAnimationController } from '../utils/progressAnimation';
import { useFileUpload, type UseFileUploadOptions } from './useFileUpload';

/**
 * 带进度追踪的上传配置选项
 */
export interface UseFileUploadWithProgressOptions extends UseFileUploadOptions {
  /**
   * 上传开始回调，返回文件ID用于进度跟踪
   *
   * @param fileName - 文件名
   * @param fileType - 文件类型
   * @returns 文件ID，如果返回空字符串则停止上传
   *
   * @remarks
   * - 可选参数，如果不提供，Hook 会自动生成临时 ID
   * - 如果提供了此回调，返回空字符串表示达到上传限制，会停止上传
   * - 临时 ID 格式：`temp_${timestamp}_${random}`
   */
  onUploadStart?: (fileName: string, fileType?: string) => string;
  /** 上传进度回调 */
  onUploadProgress?: (fileId: string, progress: number) => void;
  /** 上传失败回调 */
  onUploadFailed?: (fileId: string, error?: string) => void;
}

/**
 * 带进度追踪的文件上传 Hook
 *
 * @example
 * ```tsx
 * const { uploadFile, isUploading } = useFileUploadWithProgress({
 *   onUploadStart: (fileName) => {
 *     const id = generateId();
 *     addToProgressList(id, fileName);
 *     return id;
 *   },
 *   onUploadProgress: (fileId, progress) => {
 *     updateProgress(fileId, progress);
 *   },
 *   onUploadSuccess: (fileInfo) => {
 *     console.log('上传成功', fileInfo);
 *   },
 * });
 * ```
 */
export const useFileUploadWithProgress = (options: UseFileUploadWithProgressOptions) => {
  const { onUploadStart, onUploadProgress, onUploadFailed, onUploadSuccess, onUploadError, ...baseOptions } = options;

  const progressControllerRef = useRef<ProgressAnimationController | null>(null);
  const currentFileIdRef = useRef<string>('');

  // 生成临时文件 ID
  const generateTempFileId = useCallback(() => {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  // 清理进度动画控制器
  const cleanupProgressController = useCallback((shouldComplete: boolean = false) => {
    if (!progressControllerRef.current) return;

    if (shouldComplete) {
      progressControllerRef.current.complete();
    } else {
      progressControllerRef.current.stop();
    }
    progressControllerRef.current = null;
  }, []);

  // 初始化进度动画
  const initProgressAnimation = useCallback(
    (fileId: string) => {
      if (!onUploadProgress) return;

      // 设置初始进度为 1%
      onUploadProgress(fileId, 1);

      // 清理之前的进度动画
      cleanupProgressController(false);

      // 创建新的进度动画控制器
      progressControllerRef.current = new ProgressAnimationController(
        (progress) => onUploadProgress(fileId, progress),
        undefined,
        PROGRESS_PRESETS.normal
      );

      // 延迟开始动画，让初始 1% 先显示
      setTimeout(() => {
        progressControllerRef.current?.start(1);
      }, 100);
    },
    [onUploadProgress, cleanupProgressController]
  );

  // 包装上传成功回调
  const handleUploadSuccess = useCallback<FileUploadSuccessCallback>(
    (fileInfo) => {
      // 完成进度动画
      cleanupProgressController(true);
      if (currentFileIdRef.current && onUploadProgress) {
        onUploadProgress(currentFileIdRef.current, 100);
      }

      onUploadSuccess?.(fileInfo);
      currentFileIdRef.current = '';
    },
    [onUploadSuccess, onUploadProgress, cleanupProgressController]
  );

  // 包装上传失败回调
  const handleUploadError = useCallback(
    (error: any) => {
      cleanupProgressController(false);

      if (currentFileIdRef.current && onUploadFailed) {
        onUploadFailed(currentFileIdRef.current, error?.message || '上传失败');
      }

      onUploadError?.(error);
      currentFileIdRef.current = '';
    },
    [onUploadError, onUploadFailed, cleanupProgressController]
  );

  // 使用基础上传 Hook
  const { uploadFile: baseUploadFile, isUploading } = useFileUpload({
    ...baseOptions,
    onUploadSuccess: handleUploadSuccess,
    onUploadError: handleUploadError,
  });

  // 包装上传函数，添加进度追踪
  const uploadFile = useCallback(
    (file: File) => {
      if (!file) return;

      // 只有在需要进度追踪时才生成文件 ID
      const needsProgress = !!(onUploadStart || onUploadProgress || onUploadFailed);

      if (needsProgress) {
        // 获取文件ID用于进度跟踪
        let fileId: string;

        if (onUploadStart) {
          // 使用外部提供的 ID
          fileId = onUploadStart(file.name, file.type);

          // 如果返回空字符串，停止上传
          if (!fileId) {
            return;
          }
        } else {
          // 生成临时 ID
          fileId = generateTempFileId();
        }

        currentFileIdRef.current = fileId;

        // 初始化进度动画
        initProgressAnimation(fileId);
      }

      // 执行上传
      baseUploadFile(file);
    },
    [onUploadStart, onUploadProgress, onUploadFailed, generateTempFileId, initProgressAnimation, baseUploadFile]
  );

  // 组件卸载时清理进度动画控制器
  useEffect(() => {
    return () => {
      cleanupProgressController(false);
    };
  }, [cleanupProgressController]);

  return {
    /** 是否正在上传 */
    isUploading,
    /** 上传文件函数 */
    uploadFile,
  };
};
