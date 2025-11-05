import { createWFCRequest } from '@/api'
import { selectFilterCategoriesLoading, useAppSelector } from '@/store'
import { SaveO } from '@wind/icons'
import { Button, Modal, Spin } from '@wind/wind-ui'
import {
  CDEFilterItemUser,
  CDEFilterList,
  CDEFilterMenu,
  CDESubscriptionListOverall,
  getCDESubscribeTextUtil,
  isValidUserFilterItem,
  useCDEFilterCatalogWithMenuSub,
  useCDEFilterCfgCtx,
  useCDEFilterList,
  useCDEMeasuresCtx,
  useSubscriptionHandlers,
} from 'cde'
import classNames from 'classnames'
import { rest, throttle } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { useFetchCDEConfig } from '../hooks/CDEConfig'
import { useCDESubscribeApi } from '../hooks/CDESubscribe'
import { useFetchCDERes } from '../hooks/FetchCDERes'
import { CDEFilterConsoleFooter } from './CDEFilterConsoleFooter'
import { buildAddDataToTableCondition } from './hooks/useFilterHandlers'
import { useModeHandler } from './hooks/useModeHandler'
import styles from './style/FilterPreviewModal.module.less'
import { CDEFilterPreviewModalProps, CDEModalMode } from './type'
import { getCorpListPresearch } from './handle'

// 主模态框内容组件
export const CDEFilterPreviewModal: FC<CDEFilterPreviewModalProps> = ({
  open,
  close,
  container,
  className,
  wrapperClassName,
  onFinish,
  confirmLoading,
  confirmText,
  defaultCurrent = 0,
  defaultViewMode = 'filter',
  canAddCdeToCurrent,
  ...restPorps
}) => {
  const filterCategoryPanelRef = useCDEFilterCatalogWithMenuSub()
  const { fetchSubscriptionLoading, fetchCDESubscriptions, subscriptions, subEmail } = useCDESubscribeApi()
  const [filters, setFilters] = useState<CDEFilterItemUser[]>([])

  const filtersValid = useMemo(() => filters.filter(isValidUserFilterItem), [filters])
  const { measuresOverall } = useCDEMeasuresCtx()
  const { fetch, loading: fetchResLoading, page } = useFetchCDERes(filters, measuresOverall)

  const { getFilterItemById, codeMap, filterCfg } = useCDEFilterCfgCtx()
  const filterCfgLoading = useAppSelector(selectFilterCategoriesLoading)
  // 创建内部引用以传递给CDEFilterPanel
  const filterPanelRef = useCDEFilterList()
  // 当前视图模式：'main' 为筛选面板，'subscribe' 为订阅设置
  const [viewMode, setViewMode] = useState<CDEModalMode>(defaultViewMode)

  // 只在模态框打开 或者 filter视图时获取配置
  useFetchCDEConfig(open || viewMode === 'filter')
  // 当前选择的筛选配置索引
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(defaultCurrent)

  const { mode, resetMode } = useModeHandler()
  // 使用filterPanelInstance
  const { handleClickApply } = useSubscriptionHandlers(filterPanelRef, () => setViewMode('filter'))

  useEffect(() => {
    if (open) {
      fetchCDESubscriptions()
    }
    if (!open) {
      resetMode()
      filterCategoryPanelRef.resetFilters()
    }
  }, [open])

  const currentFilterConfig = useMemo(() => {
    if (filterCfg && filterCfg.length > 0) {
      return filterCfg[currentFilterIndex]
    }
    return undefined
  }, [filterCfg, currentFilterIndex])

  // 筛选项变化时，重新请求数据，使用 throttle 确保第一次调用迅速且后续不会频繁调用
  const throttledFetch = throttle(
    () => {
      fetch()
    },
    1000,
    { leading: true, trailing: true }
  )

  useEffect(() => {
    if (open && viewMode === 'filter') {
      throttledFetch()
    }
    return () => {
      throttledFetch.cancel()
    }
  }, [filters, open, viewMode])

  const handleAddToTable = (addNum?: number) => {
    const result = buildAddDataToTableCondition(
      filters,
      measuresOverall,
      Math.min(addNum || page?.total || 0, 2000),
      getFilterItemById,
      codeMap
    )
    if (result) {
      onFinish(result.description, result.condition)
    }
    return result
  }
  return (
    <>
      {/* @ts-expect-error wind-ui */}
      <Modal
        title={mode === 'filter' ? '企业数据浏览器' : '数据预览'}
        visible={open}
        onCancel={close}
        footer={null}
        className={classNames(styles['cde-modal--body'], className, {
          [styles['cde-modal--body-filter']]: mode === 'filter',
          [styles['cde-modal--body-subscribe']]: mode === 'subscribe',
        })}
        wrapClassName={classNames(styles['cde-modal--wrapper'], wrapperClassName)}
        getContainer={() => container || document.body}
        mask={false}
        centered
        {...restPorps}
      >
        {/* 始终保持存在的 FilterCatalogLocal，避免filterPanel被卸载 */}
        <div className={classNames(styles.console)}>
          {/* 加载中的遮罩层和Spin */}
          {filterCfgLoading && (
            <div className={styles['loading-container']}>
              <Spin spinning />
            </div>
          )}

          {/* 内容区域 - 直接使用Flex布局减少嵌套 */}
          <div
            className={classNames(styles['content-area'], styles.contentAreaFilter, {
              [styles.hidden]: filterCfgLoading || viewMode === 'subscribe',
            })}
          >
            <div className={styles.contentAreaFilterLeft}>
              {/* 左侧菜单 */}
              <CDEFilterMenu
                className={classNames(styles.menu)}
                current={currentFilterIndex}
                onSelect={setCurrentFilterIndex}
                filters={filters}
              />
              <div className={styles.contentAreaFilterLeftBtn}>
                <Button onClick={() => setViewMode('subscribe')} type="link">
                  <SaveO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  我的保存
                </Button>
              </div>
            </div>
            {/* 内容区 - 通过类名控制显示内容 */}
            <div className={classNames(styles.contentAreaFilterMain)}>
              {/* 过滤列表 */}
              <CDEFilterList
                ref={filterPanelRef.getCurrent()}
                className={classNames(styles.filterList)}
                currentFilterConfig={currentFilterConfig}
                onFilterChange={(filters) => {
                  setFilters(filters)
                }}
                getCorpListPresearch={getCorpListPresearch}
                {...rest}
              />
              <CDEFilterConsoleFooter
                hasValidFilter={filtersValid.length > 0}
                resetFilters={filterPanelRef.resetFilters}
                filtersValid={filters}
                saveSubFunc={createWFCRequest('operation/insert/addsubcorpcriterion')}
                onSaveFilterFinish={fetchCDESubscriptions}
                total={!filtersValid.length ? 0 : page?.total}
                confirmLoading={confirmLoading || fetchResLoading}
                handleAddToTable={handleAddToTable}
                confirmText={confirmText}
                canAddCdeToCurrent={canAddCdeToCurrent}
              />
            </div>
          </div>

          {/* 内容区域 - 直接使用Flex布局减少嵌套 */}
          <div
            className={classNames(styles['content-area'], styles.contentAreaSubscribe, {
              [styles.hidden]: filterCfgLoading || viewMode === 'filter',
            })}
          >
            {/* 订阅列表 */}
            <CDESubscriptionListOverall
              className={styles['sub-overview']}
              emptyClassName={styles['sub-overview--empty']}
              loading={!!fetchSubscriptionLoading}
              onClickApply={handleClickApply}
              getCDESubscribeText={(item) => getCDESubscribeTextUtil(item, getFilterItemById, codeMap)}
              subscribeList={subscriptions}
              subEmail={subEmail}
              delSubFunc={createWFCRequest('operation/delete/deletesubcorpcriterion')}
              updateSubFunc={createWFCRequest('operation/update/updatesubcorpcriterion')}
              onRefresh={fetchCDESubscriptions}
            />
            <div className={styles.footer}>
              <Button onClick={() => setViewMode('filter')}>返回</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
