import { useRequest } from 'ahooks'
import { t } from 'gel-util/intl'
import React, { useCallback, useMemo } from 'react'
import styles from './index.module.less'
import { Spin } from '@wind/wind-ui'
import { Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TaskStatus } from 'gel-api'
import type { TaskListItemWithAreaName } from '@/store'
import { postPointBuried, SUPER_AGENT_BURY_POINTS } from '@/utils/bury'
import { formatTaskName } from '@/utils/area'

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

export const CustomList: React.FC<CustomListProps> = (props) => {
  const {
    statusFilter,
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

  const defaultRender = useCallback<RenderFn>(
    ({ item }) => {
      const getStatusText = (status: TaskStatus) => {
        switch (status) {
          case TaskStatus.SUCCESS:
            return t('481520', '挖掘完成')
          case TaskStatus.RUNNING:
            return t('481502', '挖掘中')
          case TaskStatus.PENDING:
            return t('481501', '排队中')
          case TaskStatus.FAILED:
          case TaskStatus.TERMINATED:
            return t('481521', '挖掘失败')
          default:
            return ''
        }
      }

      return (
        <>
          <div className={styles['custom-list-card-content']}>
            <div className={styles['custom-list-card-title']}>
              {formatTaskName(item.areaCode, item.taskName)}
              <span className={styles['custom-list-chip']}>{t('254999', '找客户')}</span>
            </div>
            <div className={styles['custom-list-meta']}>
              <span>{item.createTime}</span>
              <span>{getStatusText(item.status)}</span>
            </div>
          </div>

          <div className={styles['custom-list-actions']}>
            <button
              className={styles['custom-list-view-btn']}
              onClick={(e) => {
                e.stopPropagation()
                postPointBuried(SUPER_AGENT_BURY_POINTS.DRILLING_OPERATION, {
                  action: 'view',
                })
                if (item.status === TaskStatus.SUCCESS) {
                  navigator(`/company-directory?selected=${item.taskId}`)
                } else {
                  navigator(`/prospect?id=${item.taskId}`)
                }
              }}
            >
              {item.status === TaskStatus.SUCCESS ? t('481504', '查看名单') : t('315373', '查看进度')}
            </button>
          </div>
        </>
      )
    },
    [navigator, t]
  )

  // 选择最终渲染函数：优先外部传入，其次使用内置默认渲染
  const finalRender: RenderFn = render || defaultRender

  const filteredDataMemo = useMemo(() => {
    const source = Array.isArray(externalData) ? externalData : []
    const list: TaskListItemWithAreaName[] = source
    return list.filter((item) => {
      if (typeof statusFilter === 'undefined') return true
      return item.status === statusFilter
    })
  }, [externalData, statusFilter])

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
      {/* @ts-expect-error windUI */}
      <Spin spinning={externalLoading || loading}>
        <div className={styles['custom-list-content']}>
          {!filteredData || filteredData.length === 0 ? (
            <div className={styles['custom-list-border']}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('17235', '暂无数据')} />
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
                        // Analytics for clicking the card itself?
                        // The user specified "View List" button has a point.
                        // I will stick to the button analytics.
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
