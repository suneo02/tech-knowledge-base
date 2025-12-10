import { Card } from '@wind/wind-ui'
import classNames from 'classnames'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { FilterItemComp } from '../FilterItem/FilterItemComp'
import styles from './style/filterPanel.module.less'
import type { FilterListProps, FilterListRef } from './types'
import { useFilterOperations } from './useFilterOperations'

/**
 * 筛选面板组件
 */
const InternalCDEFilterList = forwardRef<FilterListRef, FilterListProps>((props, ref) => {
  const { className, currentFilterConfig, onFilterChange, style, ...rest } = props

  const { filters, setFilters, resetFilters, updateFilter, getFilterById, removeFilter, updateFilterList } =
    useFilterOperations(props.initialFilters)

  useEffect(() => {
    onFilterChange?.(filters)
  }, [filters])

  useImperativeHandle(
    ref,
    () => ({
      filters,
      resetFilters,
      setFilters,
      updateFilterList,
      getFilters: () => filters,
    }),
    [filters, resetFilters, setFilters, updateFilterList]
  )

  return (
    <Card
      style={style}
      className={classNames(styles.panel, className)}
      title={
        <div className={styles.title}>
          {currentFilterConfig?.category}
          <span className={styles.support}>支持查询中国境内大陆企业</span>
        </div>
      }
    >
      {currentFilterConfig?.newFilterItemList?.map((item) => {
        if (!item) {
          return null
        }
        return (
          <FilterItemComp
            key={item.itemId}
            item={item}
            parent={currentFilterConfig}
            updateFilter={updateFilter}
            getFilterById={getFilterById}
            removeFilter={removeFilter}
            {...rest}
          />
        )
      })}
    </Card>
  )
})

InternalCDEFilterList.displayName = 'CDEFilterList'

export const CDEFilterList = InternalCDEFilterList
