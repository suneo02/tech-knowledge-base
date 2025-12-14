import { isDev } from '@/utils/env';
import { SaveO } from '@wind/icons';
import { Button, Tooltip } from '@wind/wind-ui';
import React from 'react';

type Props = {
  saving: boolean;
  hasUnsaved: boolean;
  lastSavedAt?: number;
  lastError?: string | null;
  onSaveAll?: () => void;
  onRetry?: () => void;
};

export const SaveStatusIndicator: React.FC<Props> = ({
  saving,
  hasUnsaved,
  lastSavedAt,
  lastError,
  onSaveAll,
  onRetry,
}) => {
  // 生产环境仅暴露最小化的状态文案；开发环境额外展示"已保存"等调试信息，
  // 并通过 devOnly 标记提醒这些内容不会对最终用户可见。
  const status = (() => {
    if (saving) return { label: '保存中…', devOnly: false } as const;
    if (lastError) return { label: '保存失败', devOnly: false } as const;
    if (hasUnsaved) return { label: '有未保存更改', devOnly: false } as const;
    if (isDev && lastSavedAt) {
      return { label: `已保存 ${new Date(lastSavedAt).toLocaleTimeString()}`, devOnly: true } as const;
    }
    if (isDev) {
      return { label: '已保存', devOnly: true } as const;
    }
    return null;
  })();

  const devBadge = <span style={{ marginLeft: 6, color: '#999', fontSize: 12 }}>(仅开发环境)</span>;

  const tooltip = lastError || (lastSavedAt ? `最近保存时间：${new Date(lastSavedAt).toLocaleString()}` : '');

  return (
    <Tooltip title={tooltip || '保存状态'}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 替代 gap: 8 */}
        <div style={{ marginLeft: '0' }}></div>
        {status && (
          <span style={{ color: saving ? '#1677ff' : lastError ? '#ff4d4f' : hasUnsaved ? '#faad14' : '#52c41a', marginLeft: '8px' }}>
            {status.label}
            {status.devOnly ? devBadge : null}
          </span>
        )}
        {onSaveAll && (
          <Button
            size="small"
            onClick={onSaveAll}
            disabled={!hasUnsaved || saving}
            icon={<SaveO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            style={{ marginLeft: '8px' }}
          />
        )}
        {isDev && lastError && onRetry && (
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', marginLeft: '8px' }}
            onClick={onRetry}
            loading={saving}
          >
            重试（仅开发环境）
          </Button>
        )}
      </div>
    </Tooltip>
  );
};
