/**
 * 报告文件上传组件
 *
 * @description
 * 负责报告详情页面的文件上传功能，包括：
 * 1. 文件上传按钮
 * 2. 上传成功后的 Popover 提示
 * 3. 询问用户是否重新生成全文
 *
 * @see {@link ../ReferenceView/index.tsx | ReferenceView 组件}
 */

import { UploadFileBtn } from '@/components/File';
import { RPFileUploaded } from '@/types';
import { useIntl } from 'gel-ui';
import { FC, useCallback, useMemo } from 'react';

export interface ReportFileUploadProps {
  reportId: string;
  onUploadSuccess?: (fileInfo: RPFileUploaded) => void;
}

/**
 * 报告文件上传组件
 *
 * 使用示例：
 * ```tsx
 * <ReportFileUpload
 *   reportId={reportId}
 *   onUploadSuccess={handleFileUploadSuccess}
 * />
 * ```
 */
export const ReportFileUpload: FC<ReportFileUploadProps> = ({
  reportId,
  onUploadSuccess,
}) => {
  const t = useIntl();

  // 构造上传文件需要的额外表单数据
  const uploadExtraFormData = useMemo(() => {
    return reportId ? { reportId } : undefined;
  }, [reportId]);

  const handleUploadSuccess = useCallback(
    (fileInfo: RPFileUploaded) => {
      onUploadSuccess?.(fileInfo);
    },
    [onUploadSuccess]
  );


  return (
    <>
      <UploadFileBtn
        label={t('上传文件', { defaultValue: '上传文件' })}
        onUploadSuccess={handleUploadSuccess}
        showTooltip={false}
        apiEndpoint="report/reportFileUpload"
        extraFormData={uploadExtraFormData}
      />

    </>
  );
};
