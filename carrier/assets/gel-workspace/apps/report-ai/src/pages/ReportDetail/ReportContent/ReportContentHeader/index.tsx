import { RedoO, UndoO } from '@wind/icons';
import { Button, message } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import { RPReferencePriority } from 'gel-api';
import { FC, useCallback, useEffect, useState } from 'react';
import { createChatRequest } from '../../../../api/helper';
import { SaveStatusIndicator } from '../SaveStatusIndicator';
import { ReferencePrioritySelector } from './ReferencePrioritySelector';
import styles from './index.module.less';

const updateReportRequest = createChatRequest('report/update');

export interface ReportContentHeaderProps {
  reportId?: string;
  // 左侧按钮
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;

  // 右侧按钮
  onGenerateFullText?: () => void;
  isGenerating?: boolean;
  generationProgress?: {
    currentIndex: number;
    total: number;
  };
  disableGeneration?: boolean;

  // 引用数据优先级
  referencePriority: RPReferencePriority | undefined;
  onReferencePriorityChange?: (priority: RPReferencePriority) => void;

  // 保存状态
  saving?: boolean;
  hasUnsaved?: boolean;
  lastSavedAt?: number;
  lastError?: string | null;
  onRetry?: () => void;
}

export const ReportContentHeader: FC<ReportContentHeaderProps> = ({
  reportId,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onGenerateFullText,
  isGenerating = false,
  generationProgress,
  disableGeneration = false,
  referencePriority,
  onReferencePriorityChange,
  saving = false,
  hasUnsaved = false,
  lastSavedAt,
  lastError = null,
  onRetry,
}) => {
  const [currentReferencePriority, setCurrentReferencePriority] = useState<RPReferencePriority | undefined>(
    referencePriority
  );

  useEffect(() => {
    setCurrentReferencePriority(referencePriority);
  }, [referencePriority]);

  const { loading: isUpdatingReferencePriority, run: updateReferencePriority } = useRequest(
    async (priority: RPReferencePriority) => {
      if (!reportId) {
        throw new Error('报告ID不存在');
      }

      await updateReportRequest({
        reportId,
        referencePriority: priority,
      });

      return priority;
    },
    {
      manual: true,
      onSuccess: (priority) => {
        setCurrentReferencePriority(priority);
        onReferencePriorityChange?.(priority);
        message.success('引用数据优先级已更新');
      },
      onError: (error) => {
        console.error('更新引用数据优先级失败:', error);
        message.error('更新引用数据优先级失败');
      },
    }
  );

  const handleReferencePriorityChange = useCallback(
    (priority: RPReferencePriority) => {
      if (priority === currentReferencePriority) {
        return;
      }

      if (!reportId) {
        message.error('缺少报告ID，无法更新引用数据优先级');
        return;
      }

      updateReferencePriority(priority);
    },
    [currentReferencePriority, reportId, updateReferencePriority]
  );

  return (
    <div className={styles['report-content-header']}>
      <div className={styles['report-content-header__left']}>
        <SaveStatusIndicator
          saving={saving}
          hasUnsaved={hasUnsaved}
          lastSavedAt={lastSavedAt}
          lastError={lastError}
          onSaveAll={onSave}
          onRetry={onRetry}
        />
        <Button
          onClick={onUndo}
          size="small"
          disabled={!canUndo}
          icon={<UndoO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        />
        <Button
          onClick={onRedo}
          size="small"
          disabled={!canRedo}
          icon={<RedoO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        />
      </div>

      <div className={styles['report-content-header__right']}>
        <ReferencePrioritySelector
          value={currentReferencePriority}
          onChange={handleReferencePriorityChange}
          loading={isUpdatingReferencePriority}
        />
        <Button onClick={onGenerateFullText} loading={isGenerating} disabled={disableGeneration} size="small">
          {isGenerating && generationProgress
            ? `生成中… (${generationProgress.currentIndex + 1}/${generationProgress.total})`
            : '全文生成'}
        </Button>
      </div>
    </div>
  );
};
