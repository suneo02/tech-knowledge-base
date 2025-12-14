import { Select } from '@wind/wind-ui';
import { RPReferencePriority } from 'gel-api';
import { FC, useCallback } from 'react';

export interface ReferencePrioritySelectorProps {
  value?: RPReferencePriority;
  onChange?: (value: RPReferencePriority) => void;
  loading?: boolean;
}

const REFERENCE_PRIORITY_OPTIONS = [
  {
    label: '附件数据优先',
    value: 'UserFile' as RPReferencePriority,
    title: '优先使用用户上传的附件数据',
  },
  {
    label: '只用附件数据',
    value: 'UserFileOnly' as RPReferencePriority,
    title: '仅使用用户上传的附件数据，不使用公开数据',
  },
  {
    label: '只用公开数据',
    value: 'PublicDataOnly' as RPReferencePriority,
    title: '仅使用公开数据，不使用用户上传的附件',
  },
];

export const ReferencePrioritySelector: FC<ReferencePrioritySelectorProps> = ({
  value = 'UserFile',
  onChange,
  loading = false,
}) => {
  const handleChange = useCallback(
    (newValue: RPReferencePriority) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <Select
      value={value}
      onChange={handleChange}
      options={REFERENCE_PRIORITY_OPTIONS}
      size="small"
      style={{ width: 150 }}
      disabled={loading}
      placeholder="选择引用数据"
    />
  );
};
