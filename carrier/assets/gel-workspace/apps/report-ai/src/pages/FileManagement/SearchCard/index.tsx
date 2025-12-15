import { searchCompanies } from '@/api/service';
import { FILE_TAG_FILTER_OPTIONS } from '@/components/File/config';
import { useTagFilter } from '@/hooks/useTagFilter';
import { Button, Card, Checkbox, DatePicker, Input } from '@wind/wind-ui';
import { Dayjs } from 'dayjs';
import { CorpPresearch } from 'gel-ui';
import React, { useCallback } from 'react';
import styles from './index.module.less';

// 筛选参数类型
export interface FileSearchFormFields {
  fileName?: string;
  dateRange?: [Dayjs, Dayjs] | null;
  tags?: string[];
  corpId?: string;
  corpName?: string;
}

// 组件 Props 类型
interface SearchCardProps {
  searchParams: FileSearchFormFields;
  onChange: (params: FileSearchFormFields) => void;
  onReset?: () => void;
  onApplyFilter?: () => void;
  isPolling?: boolean;
  isDev?: boolean;
  pendingCount?: number;
  loading?: boolean;
}

/**
 * 搜索卡片组件
 *
 * @description 文件管理页面的搜索筛选区域
 * @since 1.0.0
 */
export const SearchCard: React.FC<SearchCardProps> = ({
  searchParams,
  onChange,
  onReset,
  onApplyFilter,
  isPolling = false,
  isDev = false,
  pendingCount = 0,
  loading = false,
}) => {
  // 处理标签变化的回调
  const handleTagsChange = useCallback(
    (tags: string[]) => {
      onChange({ ...searchParams, tags });
    },
    [searchParams, onChange]
  );

  // 使用标签筛选 hook
  const { displayValue, handleChange } = useTagFilter(searchParams.tags, handleTagsChange);

  return (
    <Card className={styles.searchCard}>
      <div className={styles.searchControls}>
        <div className={styles.searchRow}>
          <div className={styles.searchItem}>
            <label>文件名</label>
            <Input
              placeholder="请输入文件名"
              value={searchParams.fileName}
              onChange={(e) => onChange({ ...searchParams, fileName: e.target.value })}
              allowClear
            />
          </div>
          <div className={styles.searchItem}>
            <label>企业名称</label>
            <CorpPresearch
              placeholder="请输入企业名称"
              onChange={(corpId, corpName) => onChange({ ...searchParams, corpId, corpName })}
              requestAction={searchCompanies}
              needHistory={false}
              withClear={true}
              widthAuto={true}
              debounceTime={500}
              minWidth={200}
            />
          </div>
          <div className={styles.searchItem}>
            <label>上传日期</label>
            <DatePicker.RangePicker
              value={searchParams.dateRange}
              onChange={(dates: [Dayjs, Dayjs] | null) => onChange({ ...searchParams, dateRange: dates })}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className={styles.searchRow}>
          <div className={`${styles.searchItem} ${styles.tagItem}`}>
            <label>标签</label>
            <Checkbox.Group
              options={FILE_TAG_FILTER_OPTIONS}
              value={displayValue}
              onChange={handleChange}
              className={styles.checkboxGroup}
            />
          </div>
          <div className={styles.searchActions}>
            <Button onClick={onReset}>重置</Button>
            <Button type="primary" onClick={onApplyFilter} loading={loading}>
              应用筛选
            </Button>
          </div>
        </div>
      </div>
      {isPolling && isDev && (
        <div className={styles.pollingStatus}>
          <span>开发环境信息：正在轮询文件状态，待处理文件: {pendingCount}</span>
        </div>
      )}
    </Card>
  );
};
