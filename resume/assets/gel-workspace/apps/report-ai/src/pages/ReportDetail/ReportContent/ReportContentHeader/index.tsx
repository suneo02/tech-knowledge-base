import { RedoO, UndoO } from '@wind/icons';
import { Button } from '@wind/wind-ui';
import { FC } from 'react';
import { SaveStatusIndicator } from '../SaveStatusIndicator';
import styles from './index.module.less';

export interface ReportContentHeaderProps {
  // 左侧按钮
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;

  // 右侧按钮
  onSelectReference?: () => void;
  onGenerateFullText?: () => void;
  isGenerating?: boolean;
  generationProgress?: {
    currentIndex: number;
    total: number;
  };
  disableGeneration?: boolean;

  // 保存状态
  saving?: boolean;
  hasUnsaved?: boolean;
  lastSavedAt?: number;
  lastError?: string | null;
  onRetry?: () => void;
}

export const ReportContentHeader: FC<ReportContentHeaderProps> = ({
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onSelectReference,
  onGenerateFullText,
  isGenerating = false,
  generationProgress,
  disableGeneration = false,
  saving = false,
  hasUnsaved = false,
  lastSavedAt,
  lastError = null,
  onRetry,
}) => {
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
        <Button onClick={onSelectReference} size="small">
          选择引用数据
        </Button>
        <Button onClick={onGenerateFullText} loading={isGenerating} disabled={disableGeneration} size="small">
          {isGenerating && generationProgress
            ? `生成中… (${generationProgress.currentIndex + 1}/${generationProgress.total})`
            : '全文生成'}
        </Button>
      </div>
    </div>
  );
};
