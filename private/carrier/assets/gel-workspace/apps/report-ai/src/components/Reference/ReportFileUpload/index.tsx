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
import { Button, Popover } from '@wind/wind-ui';
import { useIntl } from 'gel-ui';
import { FC, useCallback, useMemo, useState } from 'react';

export interface ReportFileUploadProps {
  /** 报告 ID */
  reportId: string;
  /** 文件上传成功回调 */
  onUploadSuccess?: (fileInfo: RPFileUploaded) => void;
  /** 确认重新生成全文回调 */
  onRegenerationConfirm?: () => void;
  /** 是否显示重新生成提示（默认 true） */
  showRegenerationPrompt?: boolean;
}

/**
 * 报告文件上传组件
 *
 * 使用示例：
 * ```tsx
 * <ReportFileUpload
 *   reportId={reportId}
 *   onUploadSuccess={handleFileUploadSuccess}
 *   onRegenerationConfirm={handleRegenerationConfirm}
 * />
 * ```
 */
export const ReportFileUpload: FC<ReportFileUploadProps> = ({
  reportId,
  onUploadSuccess,
  onRegenerationConfirm,
  showRegenerationPrompt = true,
}) => {
  const t = useIntl();

  // Popover 状态管理
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<RPFileUploaded | null>(null);

  // 构造上传文件需要的额外表单数据
  const uploadExtraFormData = useMemo(() => {
    return reportId ? { reportId } : undefined;
  }, [reportId]);

  // 文件上传成功处理
  const handleUploadSuccess = useCallback(
    (fileInfo: RPFileUploaded) => {
      // 调用父组件的回调
      onUploadSuccess?.(fileInfo);

      // 如果启用了重新生成提示，显示 Popover
      if (showRegenerationPrompt) {
        setLastUploadedFile(fileInfo);
        setPopoverOpen(true);
      }
    },
    [onUploadSuccess, showRegenerationPrompt]
  );

  // 确认重新生成
  const handleConfirm = useCallback(() => {
    setPopoverOpen(false);
    onRegenerationConfirm?.();
  }, [onRegenerationConfirm]);

  // 取消重新生成
  const handleCancel = useCallback(() => {
    setPopoverOpen(false);
  }, []);

  // Popover 内容
  const popoverContent = useMemo(() => {
    const description = lastUploadedFile
      ? `文件"${lastUploadedFile.fileName}"上传成功，是否基于新上传的文件重新生成全文？`
      : '是否基于新上传的文件重新生成全文？';

    return (
      <div style={{ width: 300, minWidth: 300 }}>
        <div style={{ marginBottom: 12 }}>{description}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleCancel}>
            暂不生成
          </Button>
          <Button type="primary" size="small" onClick={handleConfirm}>
            重新生成
          </Button>
        </div>
      </div>
    );
  }, [lastUploadedFile, handleCancel, handleConfirm]);

  return (
    <>
      <UploadFileBtn
        label={t('上传文件', { defaultValue: '上传文件' })}
        onUploadSuccess={handleUploadSuccess}
        showTooltip={false}
        apiEndpoint="report/reportFileUpload"
        extraFormData={uploadExtraFormData}
      />

      {/* 重新生成确认弹窗 */}
      <Popover
        visible={popoverOpen}
        content={popoverContent}
        title="重新生成全文"
        trigger="click"
        onVisibleChange={setPopoverOpen}
      >
        <span />
      </Popover>
    </>
  );
};
