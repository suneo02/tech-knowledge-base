import { useRequest } from 'ahooks'
import { t } from 'gel-util/locales'
import React, { useCallback, useMemo } from 'react'
import styles from './index.module.less'
import { Button, Divider, Spin } from '@wind/wind-ui'
import { Empty } from 'antd'
import { DeleteO, DownloadO } from '@wind/icons'
import { useNavigate } from 'react-router-dom'
import { TaskStatus } from 'gel-api'
import type { TaskListItemWithAreaName } from '@/store'

/**
 * 单一渲染函数：根据数据项与变体配置，生成卡片内容
 */
type RenderFn = (args: { item: TaskListItemWithAreaName }) => React.ReactNode

/**
 * 组件入参
 */
export interface CustomListProps {
  /** 可选：名称（预留，外部可自行使用） */
  name?: string
  /** 状态筛选：使用 TaskStatus；未设置表示全部 */
  statusFilter?: TaskStatus
  /** 订阅筛选：ALL/SUBSCRIBED(已订阅)/NOT_SUBSCRIBED(未订阅) */
  subscriptionFilter?: 'ALL' | 'SUBSCRIBED' | 'NOT_SUBSCRIBED'
  /** 外部传入的数据（若提供，将跳过内置模拟数据） */
  data?: TaskListItemWithAreaName[]
  /** 外部加载态（优先级高于内部 loading） */
  loading?: boolean
  /**
   * 提取条目的变体标识（如：company/product/supplier）。默认使用 item.type || 'company'。
   */
  getVariant?: (item: TaskListItemWithAreaName) => string
  /**
   * 自定义渲染函数（可选）。若不提供，将使用内置默认渲染（芯片式卡片）。
   */
  render?: RenderFn

  /**
   * 刷新回调
   */
  onRefresh?: () => void

  /**
   * 列表项点击
   */
  onItemClick?: (item: TaskListItemWithAreaName) => void
  /**
   * 选中项 id，用于高亮
   */
  selectedId?: number
}

// 使用静态 className 以匹配 less 生成的 css module key

const STRINGS = {
  NEW_COMPANY: t('', '新增企业'),
  TOTAL_COMPANY: t('', '企业总数'),
  NEW_PRODUCT: t('', '新增产品'),
  NEW_SUPPLIER: t('', '新进供应商'),
  TOTAL_PRODUCT: t('', '产品总数'),
  SUBSCRIBED: t('', '已订阅'),
  NOT_SUBSCRIBED: t('', '未订阅'),
  CREATE_TIME: t('', '创建'),
  UNIT: t('', '家'),
  UNIT_PRODUCT: t('', '个'),
  DELETE: t('', '删除'),
  EXPORT: t('', '导出'),
}
export const CustomList: React.FC<CustomListProps> = (props) => {
  const {
    statusFilter,
    subscriptionFilter = 'ALL',
    getVariant,
    render,
    onItemClick,
    selectedId,
    data: externalData,
    loading: externalLoading,
  } = props || {}

  const navigator = useNavigate()

  const getItemVariant = useCallback(
    (item: TaskListItemWithAreaName) =>
      typeof getVariant === 'function' ? getVariant(item) : item?.status || 'company',
    [getVariant]
  )

  const defaultRender = useCallback<RenderFn>(({ item }) => {
    return (
      <>
        <div className={styles['custom-list-card-header']}>
          <div className={styles['custom-list-card-title']}>
            {item.taskName} - {item.areaName}
          </div>
        </div>

        <div className={styles['custom-list-card-footer']}>
          <div className={styles['custom-list-time']}>
            <span
              className={styles['custom-list-chip']}
              data-kind="status"
              data-status={item.status === 2 ? 'drilling' : 'done'}
            >
              {item.status === TaskStatus.SUCCESS ? '挖掘完成' : '挖掘中'}
            </span>
            <Divider type="vertical" />
            {STRINGS.CREATE_TIME}：{item.createTime}
          </div>
          <div className={styles['custom-list-actions']}>
            <Button size="small" icon={<DeleteO />}>
              {STRINGS.DELETE}
            </Button>
            <Button size="small" icon={<DownloadO />}>
              {STRINGS.EXPORT}
            </Button>
          </div>
        </div>
      </>
    )
  }, [])

  // 选择最终渲染函数：优先外部传入，其次使用内置默认渲染
  const finalRender: RenderFn = render || defaultRender

  const filteredDataMemo = useMemo(() => {
    const source = Array.isArray(externalData) ? externalData : []
    const list: TaskListItemWithAreaName[] = source
    return list
      .filter((item) => {
        if (typeof statusFilter === 'undefined') return true
        return item.status === statusFilter
      })
      .filter((item) => {
        console.log('🚀 ~ CustomList ~ item:', item)
        if (subscriptionFilter === 'ALL') return true
        // if (subscriptionFilter === 'SUBSCRIBED') return item.subscribed === true
        // if (subscriptionFilter === 'NOT_SUBSCRIBED') return item.subscribed === false
        return true
      })
  }, [externalData, statusFilter, subscriptionFilter])

  const { data: filteredData = [], loading } = useRequest(
    async () => {
      // 模拟服务端延迟
      props.onRefresh?.()
      await new Promise((r) => setTimeout(r, 800))

      return filteredDataMemo
    },
    {
      refreshDeps: [filteredDataMemo],
    }
  )

  return (
    <div className={styles['custom-list-container']}>
      {/* @ts-expect-error will be fixed in next release */}
      <Spin spinning={externalLoading ?? loading}>
        <div className={styles['custom-list-content']}>
          {!filteredData || filteredData.length === 0 ? (
            <div className={styles['custom-list-border']}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('', '暂无数据')} />
            </div>
          ) : (
            <div className={styles['custom-list-grid']}>
              {filteredData.map((item) => {
                const variant = getItemVariant(item)

                return (
                  <div
                    key={item.taskId}
                    className={styles['custom-list-card']}
                    data-variant={variant}
                    data-selected={selectedId === item.taskId ? 'true' : 'false'}
                    onClick={() => {
                      if (typeof onItemClick === 'function') {
                        onItemClick(item)
                      } else {
                        if (item.status === TaskStatus.SUCCESS) {
                          navigator(`/company-directory?selected=${item.taskId}`)
                        } else {
                          navigator(`/prospect?id=${item.taskId}`)
                        }
                      }
                    }}
                  >
                    {finalRender({ item })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Spin>
      {/* )} */}
    </div>
  )
}
