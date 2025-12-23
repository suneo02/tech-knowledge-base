import { AddtagO, FolderO } from '@wind/icons'
import { Button, Divider, Input, Popover, Tooltip } from '@wind/wind-ui'
import { AIBox } from 'gel-ui'
import React from 'react'
import { ExtraConditions } from '../ExtraConditions'
import styles from './index.module.less'

export interface SearchToolbarProps {
  value: string
  onChange: (val: string) => void
  filteredCount?: number
  totalCount?: number
  onExpandAll?: () => void
  onAddColumn?: () => void
  onAIGenerateColumn?: () => void
  expandButtonText?: string
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  value,
  onChange,
  onExpandAll,
  onAddColumn,
  onAIGenerateColumn,
  expandButtonText,
}) => {
  // const showCounts = typeof filteredCount === 'number' && typeof totalCount === 'number'

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <Input.Search
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索企业名称、描述..."
          style={{ width: 420 }}
        />
        {/* {showCounts && (
          <div className={styles.stat}>
            <span>结果</span>
            <span className={styles.statStrong}>{filteredCount}</span>
            <span>/</span>
            <span>{totalCount}</span>
            <span>家企业</span>
          </div>
        )} */}
      </div>
      <div className={styles.right}>
        <Popover placement="bottomRight" content={<ExtraConditions />} trigger="click">
          <Tooltip title="可以通过对话描述的方式对表格进行精细化筛选">
            <Button type="text">精细筛选</Button>
          </Tooltip>
        </Popover>

        <Divider type="vertical" style={{ margin: 0 }} />
        <Button type="text" icon={<FolderO />} onClick={onExpandAll}>
          {expandButtonText ?? '全部展开'}
        </Button>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Button type="text" onClick={onAIGenerateColumn}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AIBox size="small" /> AI生成列
          </div>
        </Button>
        <Divider type="vertical" style={{ margin: 0 }} />
        <Button type="text" onClick={onAddColumn} icon={<AddtagO />}>
          新增列
        </Button>
        <Divider type="vertical" style={{ margin: 0 }} />
        {/* <Button type="text" onClick={onExport} icon={<DownloadO />}>
          导出
        </Button> */}
      </div>
    </div>
  )
}
