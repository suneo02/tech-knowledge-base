import { CDEFilterMenu } from '@/components'
import { useCDEFilterCfgCtx } from '@/ctx'
import { useSubscriptionHandlers } from '@/FilterCatalog/handle'
import { CDEFilterItemApi } from '@/FilterItem/conditionItems/type'
import { CDEFilterList, useCDEFilterList } from '@/FilterList'
import { getCDESubscribeTextUtil, isValidUserFilterItem } from '@/handle'
import { CDESubscriptionListOverall } from '@/subscribe'
import { CDEFilterItemUser } from '@/types'
import { Button, Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { CDESubscribeItem, TRequestToWFCSpacfic } from 'gel-api'
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import styles from './style/index.module.less'
import { CDEFilterConsoleRef } from './useCDEFilterConsole'

export interface CDEFilterConsoleCustomFooterProps {
  className?: string
  hasValidFilter: boolean
  resetFilters: () => void
  filtersValid: CDEFilterItemUser[]
  viewMode: 'main' | 'subscribe'
  setViewMode: (mode: 'main' | 'subscribe') => void
}

export interface CDEFilterConsoleProps extends CDEFilterItemApi {
  style?: React.CSSProperties
  onFilterChange?: (filters: CDEFilterItemUser[]) => void
  filterCfgLoading?: boolean
  subscribeLoading?: boolean
  delSubFunc: TRequestToWFCSpacfic<'operation/delete/deletesubcorpcriterion'>
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  subscriptions: CDESubscribeItem[]
  subEmail?: string
  defaultCurrent?: number
  fetchCDESubscriptions: () => void
  // 主视图底部
  customMainFooter?: (props: CDEFilterConsoleCustomFooterProps) => React.ReactNode
}

/**
 * 简化版超级名单筛选组件，支持保存筛选和查看已保存筛选
 */
export const CDEFilterConsole = forwardRef<CDEFilterConsoleRef, CDEFilterConsoleProps>(
  (
    {
      onFilterChange,
      style,
      delSubFunc,
      updateSubFunc,
      subscriptions,
      subEmail,
      filterCfgLoading,
      subscribeLoading,
      defaultCurrent = 0,
      fetchCDESubscriptions,
      customMainFooter,
      ...rest
    },
    ref
  ) => {
    const [filtersLocal, setFiltersLocal] = useState<CDEFilterItemUser[]>([])
    // 当前视图模式：'main' 为筛选面板，'subscribe' 为订阅设置
    const [viewMode, setViewMode] = useState<'main' | 'subscribe'>('main')
    // 当前选择的筛选配置索引
    const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(defaultCurrent)

    // 创建内部引用以传递给CDEFilterPanel
    const filterPanelRef = useCDEFilterList()

    const { getFilterItemById, codeMap, filterCfg } = useCDEFilterCfgCtx()

    // 将内部实例暴露给外部ref
    useImperativeHandle(
      ref,
      () => ({
        resetFilters: () => filterPanelRef.resetFilters(),
      }),
      [filterPanelRef]
    )

    // 使用filterPanelInstance
    const { handleClickApply } = useSubscriptionHandlers(filterPanelRef, () => setViewMode('main'))

    const currentFilterConfig = useMemo(() => {
      if (filterCfg && filterCfg.length > 0) {
        return filterCfg[currentFilterIndex]
      }
      return undefined
    }, [filterCfg, currentFilterIndex])

    const filtersValid = useMemo(() => filtersLocal.filter(isValidUserFilterItem), [filtersLocal])

    // 创建包装器类名
    const wrapperClassName = classNames(styles.console, {
      [styles['console--loading']]: filterCfgLoading,
    })

    // 创建菜单类名
    const menuClassName = classNames(styles.menu, {
      [styles['menu--hidden']]: viewMode === 'subscribe',
    })

    return (
      <div className={wrapperClassName} style={style}>
        {/* 加载中的遮罩层和Spin */}
        {filterCfgLoading && (
          <div className={styles['loading-container']}>
            <Spin spinning />
          </div>
        )}

        {/* 内容区域 - 直接使用Flex布局减少嵌套 */}
        <div className={styles['content-area']}>
          {/* 左侧菜单 */}
          <CDEFilterMenu
            className={menuClassName}
            current={currentFilterIndex}
            onSelect={setCurrentFilterIndex}
            filters={filtersLocal}
          />

          {/* 内容区 - 通过类名控制显示内容 */}
          <div className={styles.content}>
            {/* 过滤列表 */}
            <CDEFilterList
              ref={filterPanelRef.getCurrent()}
              className={classNames({
                [styles['filter-container--hidden']]: viewMode === 'subscribe',
              })}
              currentFilterConfig={currentFilterConfig}
              onFilterChange={(filters) => {
                setFiltersLocal(filters)
                onFilterChange?.(filters)
              }}
              {...rest}
            />

            {/* 订阅列表 */}
            {viewMode === 'subscribe' && (
              <CDESubscriptionListOverall
                className={styles['sub-overview']}
                emptyClassName={styles['sub-overview--empty']}
                loading={!!subscribeLoading}
                onClickApply={handleClickApply}
                getCDESubscribeText={(item) => getCDESubscribeTextUtil(item, getFilterItemById, codeMap)}
                subscribeList={subscriptions}
                subEmail={subEmail}
                delSubFunc={delSubFunc}
                updateSubFunc={updateSubFunc}
                onRefresh={fetchCDESubscriptions}
              />
            )}
          </div>
        </div>

        {/* subscribe 模式 footer */}
        {viewMode === 'subscribe' && <Button onClick={() => setViewMode('main')}>返回</Button>}
        {/* 自定义底部 */}
        {customMainFooter &&
          viewMode === 'main' &&
          customMainFooter({
            className: styles.footer,
            hasValidFilter: filtersValid.length > 0,
            resetFilters: filterPanelRef.resetFilters,
            filtersValid,
            viewMode,
            setViewMode,
          })}
      </div>
    )
  }
)

CDEFilterConsole.displayName = 'CDEFilterConsole'
