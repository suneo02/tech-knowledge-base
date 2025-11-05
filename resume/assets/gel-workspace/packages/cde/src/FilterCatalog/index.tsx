import { CDEFilterFooter, CDEFilterMenu } from '@/components'
import { useCDEFilterCfgCtx } from '@/ctx'
import { CDEFilterItemApi } from '@/FilterItem/conditionItems/type'
import { CDEFilterList, useCDEFilterList } from '@/FilterList'
import { getCDESubscribeTextUtil, isValidUserFilterItem } from '@/handle'
import { CDESubscriptionListOverall } from '@/subscribe'
import { CDEFilterItemUser } from '@/types'
import { Button, Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { CDESubscribeItem, TRequestToWFCSpacfic } from 'gel-api'
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useSubscriptionHandlers } from './handle'
import styles from './index.module.less'
import { CDEFilterCatalogWithMenuSubRef } from './useCDEFilterCatalogWithMenuSub'
export { useSubscriptionHandlers } from './handle'
export * from './useCDEFilterCatalogWithMenuSub'

/**
 * 超级名单首页及对话页面使用使用 数据筛选，订阅
 */
interface CDEFilterCatalogProps extends CDEFilterItemApi {
  style?: React.CSSProperties
  defaultCurrent?: number
  onFilterChange?: (filters: CDEFilterItemUser[]) => void
  filterCfgLoading: boolean | undefined
  subscribeLoading: boolean | undefined
  fetchCDESubscriptions: () => void
  delSubFunc: TRequestToWFCSpacfic<'operation/delete/deletesubcorpcriterion'>
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  subscriptions: CDESubscribeItem[]
  subEmail: string | undefined
  handleSearch: () => void
  searchLoading: boolean | undefined
}

/**
 * 超级名单首页及对话页面使用使用 数据筛选，订阅
 * @returns
 */
export const CDEFilterCatalogWithMenuSub = forwardRef<CDEFilterCatalogWithMenuSubRef, CDEFilterCatalogProps>(
  (
    {
      defaultCurrent,
      onFilterChange,
      style,
      delSubFunc,
      updateSubFunc,
      subscriptions,
      subEmail,
      handleSearch,
      filterCfgLoading,
      subscribeLoading,
      searchLoading,
      fetchCDESubscriptions,
      ...rest
    },
    ref
  ) => {
    const [filtersLocal, setFiltersLocal] = useState<CDEFilterItemUser[]>([])
    // 数字为当前选中的筛选配置，'subscribe'为订阅设置
    const [current, setCurrent] = useState<number | 'subscribe'>(defaultCurrent ?? 0)

    // 创建内部引用以传递给CDEFilterPanel
    const filterPanelRef = useCDEFilterList()

    const hasValidFilter = useMemo(() => filtersLocal.some((item) => isValidUserFilterItem(item)), [filtersLocal])
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
    const { handleClickApply } = useSubscriptionHandlers(filterPanelRef, setCurrent)

    const currentFilterConfig = useMemo(() => {
      if (filterCfg && filterCfg.length > 0 && typeof current === 'number') {
        return filterCfg[current]
      }
      return undefined
    }, [filterCfg, current])

    return (
      <div
        className={classNames(styles.filterCatalogWrapper, { [styles.filterCatalogWrapperLoading]: filterCfgLoading })}
        style={style}
      >
        <Spin spinning={filterCfgLoading} />
        <div style={filterCfgLoading ? { display: 'none' } : {}} className={styles.filterMenuWrapper}>
          <CDEFilterMenu
            current={typeof current === 'number' ? current : undefined}
            onSelect={(index) => {
              setCurrent(index)
            }}
            filters={filtersLocal}
          />
          <Button onClick={() => setCurrent('subscribe')}>我的保存</Button>
        </div>
        <div className={styles.filterCatalogContentWrapper} style={filterCfgLoading ? { display: 'none' } : {}}>
          <CDEFilterList
            ref={filterPanelRef.getCurrent()}
            style={!currentFilterConfig ? { display: 'none' } : {}}
            className={styles.filterCatalogPanel}
            currentFilterConfig={currentFilterConfig}
            onFilterChange={(filters) => {
              setFiltersLocal(filters)
              onFilterChange?.(filters)
            }}
            {...rest}
          />
          {current === 'subscribe' && (
            <CDESubscriptionListOverall
              className={styles.filterSubOverview}
              emptyClassName={styles.filterSubOverviewEmpty}
              loading={subscribeLoading}
              onClickApply={handleClickApply}
              getCDESubscribeText={(item) => getCDESubscribeTextUtil(item, getFilterItemById, codeMap)}
              subscribeList={subscriptions}
              subEmail={subEmail}
              delSubFunc={delSubFunc}
              updateSubFunc={updateSubFunc}
              onRefresh={fetchCDESubscriptions}
            />
          )}
          <CDEFilterFooter
            style={filterCfgLoading ? { display: 'none' } : {}}
            className={styles.filterFooter}
            hasValidFilter={hasValidFilter}
            resetFilters={filterPanelRef.resetFilters}
            handleSearch={handleSearch}
            loading={searchLoading}
          />
        </div>
      </div>
    )
  }
)

CDEFilterCatalogWithMenuSub.displayName = 'CDEFilterCatalogWithMenuSub'
