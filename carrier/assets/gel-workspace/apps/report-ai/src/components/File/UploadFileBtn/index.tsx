import { useFileUploadWithProgress } from '@/hooks';
import { UploadO } from '@wind/icons';
import { useIntl, WuiAliceBtn } from 'gel-ui';
import { FC, useCallback, useRef } from 'react';
import { getSupportedFormatsText } from '../../../utils/fileValidation';
import { FileUploadSuccessCallback } from './type';
export { type FileUploadSuccessCallback };
/**
 * 文件上传按钮组件
 *
 * @description
 * 通用的文件上传按钮组件，基于 useFileUploadService 实现统一的上传逻辑。
 * 支持多种场景：聊天发送器、文件管理、报告引用资料等。
 *
 * @example
 * // 基础用法
 * <UploadFileBtn
 *   onUploadSuccess={(file) => console.log('上传成功', file)}
 * />
 *
 * @example
 * // 在 ReferenceView 中使用
 * <UploadFileBtn
 *   label={t('上传文件', { defaultValue: '上传文件' })}
 *   onUploadSuccess={handleFileUploadSuccess}
 *   showTooltip={false}
 * />
 */
export const UploadFileBtn: FC<{
  /** 上传成功回调，返回文件信息（fileId、fileName、uploadTime） */
  onUploadSuccess?: FileUploadSuccessCallback;
  /** 上传错误回调 */
  onUploadError?: (error: any) => void;
  /** 前端校验失败回调 */
  onValidationError?: (validation: { valid: boolean; error?: string }) => void;
  /** 上传开始回调，返回文件ID用于进度跟踪 */
  onUploadStart?: (fileName: string, fileType?: string) => string;
  /** 上传进度回调，用于更新上传进度（0-100） */
  onUploadProgress?: (fileId: string, progress: number) => void;
  /** 上传失败回调，用于清理上传状态 */
  onUploadFailed?: (fileId: string, error?: string) => void;
  /** 上传前检查，返回 false 阻止上传 */
  onBeforeUpload?: () => boolean;
  /** 按钮文字，默认为"上传素材" */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示格式提示，默认为 true */
  showTooltip?: boolean;
  /** 自定义上传 API endpoint，默认为 'report/fileUpload' */
  apiEndpoint?: 'report/fileUpload' | 'report/reportFileUpload';
  /** 额外的表单数据，如 groupId */
  extraFormData?: Record<string, string>;
}> = ({
  onUploadSuccess,
  onUploadError,
  onValidationError,
  onUploadStart,
  onUploadProgress,
  onUploadFailed,
  onBeforeUpload,
  label,
  disabled,
  showTooltip = true,
  apiEndpoint,
  extraFormData,
}) => {
  const t = useIntl();
  const labelText = label ?? '上传素材';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadFile } = useFileUploadWithProgress({
    onUploadSuccess,
    onUploadError,
    onValidationError,
    onUploadStart,
    onUploadProgress,
    onUploadFailed,
    apiEndpoint,
    extraFormData,
  });

  // UI 交互处理
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      uploadFile(file);
      // 清空 input 值，允许重复选择同一文件
      event.target.value = '';
    },
    [uploadFile]
  );

  const handleClick = useCallback(() => {
    if (isUploading) return;

    // 检查是否允许上传
    if (onBeforeUpload && !onBeforeUpload()) {
      return;
    }

    fileInputRef.current?.click();
  }, [isUploading, onBeforeUpload]);

  // 设置支持的文件类型
  const acceptTypes = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xls,.xlsx';
  const tooltipTitle = showTooltip ? `支持格式：${getSupportedFormatsText()}，单个文件最大50MB` : undefined;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div title={tooltipTitle}>
        <WuiAliceBtn
          icon={<UploadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          onClick={handleClick}
          loading={isUploading}
          disabled={disabled}
        >
          <span>{t(labelText, { defaultValue: labelText })}</span>
        </WuiAliceBtn>
      </div>
    </>
  );
};
