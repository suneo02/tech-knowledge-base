/**
 * 基础文件上传 Hook
 *
 * @description
 * 提供最基础的文件上传功能，不包含进度追踪
 * 适用于简单的文件上传场景
 *
 * @see {@link ./useFileUploadWithProgress.ts | 带进度追踪的上传 Hook}
 */

import { FileUploadSuccessCallback } from '@/components/File/UploadFileBtn';
import { message } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import { ApiResponseForWFC, RPFileIdIdentifierDepre } from 'gel-api';
import { useIntl } from 'gel-ui';
import { useCallback, useState } from 'react';
import { createChatRequest } from '../api';
import { validateFileBasic, type ValidationResult } from '../utils/fileValidation';
import { handleUploadError } from '../utils/uploadErrorHandler';

/**
 * 基础文件上传配置选项
 */
export interface UseFileUploadOptions {
  /** 上传成功回调 */
  onUploadSuccess?: FileUploadSuccessCallback;
  /** 上传错误回调 */
  onUploadError?: (error: any) => void;
  /** 前端校验失败回调 */
  onValidationError?: (validation: ValidationResult) => void;
  /** 自定义上传 API endpoint */
  apiEndpoint?: 'report/fileUpload' | 'report/reportFileUpload';
  /** 额外的表单数据 */
  extraFormData?: Record<string, string>;
}

/**
 * 基础文件上传 Hook
 *
 * @example
 * ```tsx
 * const { uploadFile, isUploading } = useFileUpload({
 *   onUploadSuccess: (fileInfo) => {
 *     console.log('上传成功', fileInfo);
 *   },
 *   apiEndpoint: 'report/reportFileUpload',
 *   extraFormData: { groupId: reportId },
 * });
 * ```
 */
export const useFileUpload = ({
  onUploadSuccess,
  onUploadError,
  onValidationError,
  apiEndpoint = 'report/fileUpload',
  extraFormData,
}: UseFileUploadOptions) => {
  const t = useIntl();
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  // 重置上传状态
  const resetUploadState = useCallback(() => {
    setIsUploading(false);
    setCurrentFileName('');
  }, []);

  // 处理上传成功
  const handleUploadSuccess = useCallback(
    (response: ApiResponseForWFC<RPFileIdIdentifierDepre>) => {
      const fileId = response?.Data?.fileID;
      if (!fileId) {
        message.error(t('上传失败：未获取到文件ID', { defaultValue: '上传失败：未获取到文件ID' }));
        resetUploadState();
        return;
      }

      message.success(t('上传成功', { defaultValue: '上传成功' }));

      onUploadSuccess?.({
        fileId,
        fileName: currentFileName || '未命名文件',
        uploadTime: new Date().toISOString(),
      });

      resetUploadState();
    },
    [t, currentFileName, onUploadSuccess, resetUploadState]
  );

  // 处理上传失败
  const handleUploadFailure = useCallback(
    (error: any) => {
      const strategy = handleUploadError(error, currentFileName, onUploadError);
      message.error(strategy.message);
      resetUploadState();
    },
    [currentFileName, onUploadError, resetUploadState]
  );

  // 创建上传请求函数
  const uploadRequest = useCallback(
    async (formData: FormData) => {
      const request = createChatRequest(apiEndpoint);
      return request(formData);
    },
    [apiEndpoint]
  );

  const { run: executeUpload } = useRequest(uploadRequest, {
    manual: true,
    onSuccess: handleUploadSuccess,
    onError: handleUploadFailure,
  });

  // 创建上传表单数据
  const createFormData = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      if (extraFormData) {
        Object.entries(extraFormData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      return formData;
    },
    [extraFormData]
  );

  // 上传文件
  const uploadFile = useCallback(
    (file: File) => {
      if (!file) return;

      // 前端校验
      const validation = validateFileBasic(file);
      if (!validation.valid) {
        message.error(validation.error!);
        onValidationError?.(validation);
        return;
      }

      setIsUploading(true);
      setCurrentFileName(file.name);

      const formData = createFormData(file);
      executeUpload(formData);
    },
    [onValidationError, createFormData, executeUpload]
  );

  return {
    /** 是否正在上传 */
    isUploading,
    /** 上传文件函数 */
    uploadFile,
  };
};
