import { Button, Tooltip } from '@wind/wind-ui'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './style/modalFooters.module.less'
import { t } from 'gel-util/intl'

const STRINGS = {
  RESET: t('', '重置筛选'),
  SEARCH: t('', '立即搜索'),
  NO_VALID_FILTER: t('', '请至少选择一个筛选项'),
  RETURN: t('', '返回'),
  ADD_TO_TABLE: t('', '添加至表格'),
}

// 筛选模式下的底部按钮
export const CDEFilterFooter: FC<{
  style?: React.CSSProperties
  className?: string
  hasValidFilter: boolean
  resetFilters: () => void
  handleSearch: () => void
  loading: boolean | undefined
}> = ({ hasValidFilter, resetFilters, handleSearch, loading, style, className }) => {
  return (
    <div style={style} className={classNames(styles['cde-filter-footer'], className)}>
      {/* 重置筛选 */}
      <Button key="reset" onClick={resetFilters}>
        {STRINGS.RESET}
      </Button>
      {/* 立即搜索 */}
      <Tooltip title={!hasValidFilter ? STRINGS.NO_VALID_FILTER : ''}>
        <Button key="submit" type="primary" loading={loading} onClick={handleSearch} disabled={!hasValidFilter}>
          {STRINGS.SEARCH}
        </Button>
      </Tooltip>
    </div>
  )
}

// 显示模式下的底部按钮
export const CDEDisplayFooter: FC<{
  handleReturn: () => void
  handleAddToTable: () => void
  isAddable: boolean
  fetchResLoading: boolean | undefined
  confirmLoading: boolean | undefined
  className?: string
}> = ({ handleReturn, handleAddToTable, isAddable, fetchResLoading, confirmLoading, className }) => {
  return (
    <div className={className}>
      <Button key="return" type="link" disabled={confirmLoading || fetchResLoading} onClick={handleReturn}>
        {STRINGS.RETURN}
      </Button>
      {/* 添加至表格 */}
      <Button
        key="add"
        type="primary"
        disabled={!isAddable || fetchResLoading}
        loading={confirmLoading}
        onClick={handleAddToTable}
      >
        {STRINGS.ADD_TO_TABLE}
      </Button>
    </div>
  )
}
