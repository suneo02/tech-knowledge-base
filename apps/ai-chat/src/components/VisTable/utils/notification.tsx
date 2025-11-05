import { requestToWFCSuperlistFcs } from '@/api/requestFcs'
import { UnorderedListOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { SourceTypeEnum } from 'gel-api'
import { useEffect, useRef } from 'react'
import { NotificationDescription } from '../components/notification/NotificationDescription'
import { parseProgressSteps } from './progressUtils'

/**
 * 创建单元格通知服务
 * 用于显示单元格详细信息的通知组件
 *
 * @returns 返回包含 openCellNotification 方法的对象
 */
export const useCellNotification = () => {
  const [api, contextHolder] = notification.useNotification({ top: 100 })
  const notificationRef = useRef<string | null>(null)
  const handleOutsideClickRef = useRef<(event: MouseEvent) => void>()

  // 使用常量定义通知的key
  const notificationKey = 'cell-info'

  const removeGlobalClickListener = () => {
    if (handleOutsideClickRef.current) {
      document.removeEventListener('mousedown', handleOutsideClickRef.current)
      handleOutsideClickRef.current = undefined
    }
  }

  const addGlobalClickListener = () => {
    // 确保移除任何已存在的监听器，避免重复添加
    removeGlobalClickListener()

    handleOutsideClickRef.current = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Ant Design 通知的 DOM 结构通常包含 .ant-notification-notice 类
      const notificationWrappers = document.querySelectorAll('.ant-notification-notice')
      let clickInsideNotification = false
      for (const wrapper of Array.from(notificationWrappers)) {
        if (wrapper.contains(target)) {
          clickInsideNotification = true
          break
        }
      }

      if (!clickInsideNotification && notificationRef.current === notificationKey) {
        api.destroy(notificationKey)
        // onClose 回调会自动调用 removeGlobalClickListener
      }
    }
    document.addEventListener('mousedown', handleOutsideClickRef.current)
  }

  // 清理函数，在组件卸载时执行
  useEffect(() => {
    return () => {
      // 如果 cell-info 通知仍然是当前活动的通知，则销毁它
      if (notificationRef.current === notificationKey) {
        api.destroy(notificationKey) // 这将触发 onClose 回调
      }
      // 确保监听器在组件卸载时被移除
      removeGlobalClickListener()
    }
  }, [api]) // api 对象通常是稳定的

  /**
   * 显示通知内容
   */
  const showNotification = (props: {
    sourceType: SourceTypeEnum
    value?: string
    sourceId?: string
    isLoading?: boolean
    sourceDetail?: string
    progressSteps?: string[]
  }) => {
    const { sourceType, value, sourceId, isLoading, sourceDetail, progressSteps = [] } = props

    api.open({
      key: notificationKey,
      message: (
        <>
          <UnorderedListOutlined style={{ marginInlineEnd: 4 }} />
          单元格详情
        </>
      ),
      duration: 0,
      description: (
        <NotificationDescription
          sourceType={sourceType}
          value={value}
          sourceId={sourceId}
          isLoading={isLoading}
          sourceDetail={sourceDetail}
          progressSteps={progressSteps}
        />
      ),
      onClose: () => {
        removeGlobalClickListener()
        if (notificationRef.current === notificationKey) {
          notificationRef.current = null
        }
      },
    })

    addGlobalClickListener()
  }

  /**
   * 打开单元格详情通知
   * @param cellInfo 单元格信息，包含来源类型、值和来源值
   */
  const openCellNotification = async (props?: { sourceType?: SourceTypeEnum; value?: string; sourceId?: string }) => {
    const { sourceType, value, sourceId } = props || {}

    if (notificationRef.current && notificationRef.current !== notificationKey) {
      api.destroy(notificationRef.current)
    }

    if (!sourceType) {
      if (notificationRef.current === notificationKey) {
        api.destroy(notificationKey)
      }
      return
    }

    notificationRef.current = notificationKey

    showNotification({ sourceType, value, sourceId, isLoading: true, progressSteps: [] })

    if (sourceId) {
      try {
        const response = await requestToWFCSuperlistFcs('superlist/excel/sourceDetail', {
          sourceId,
          sourceType,
        })
        const anyResponse = response

        let source = ''
        let cdeDescription = ''
        let progress = ''
        let indicatorFilterDetail = ''
        let rawSentence = ''

        if (anyResponse?.Data) {
          const data = anyResponse.Data
          source = data.source || ''
          cdeDescription = data.cdeDescription || ''
          progress = data.progress || ''
          indicatorFilterDetail = data.indicatorFilterDetail || ''
          rawSentence = data.rawSentence || ''
        }

        const sourceDetail =
          sourceType === SourceTypeEnum.AI_GENERATE_COLUMN
            ? source || '无数据来源'
            : sourceType === SourceTypeEnum.INDICATOR
              ? indicatorFilterDetail || '无详细描述'
              : sourceType === SourceTypeEnum.AI_CHAT
                ? rawSentence || '无数据来源'
                : cdeDescription || '无详细描述'

        const progressSteps = progress ? parseProgressSteps(progress) : []

        if (notificationRef.current === notificationKey) {
          showNotification({
            sourceType,
            value,
            sourceId,
            isLoading: false,
            sourceDetail,
            progressSteps,
          })
        }
      } catch (error) {
        console.error('获取数据来源详情失败:', error)
        if (notificationRef.current === notificationKey) {
          showNotification({
            sourceType,
            value,
            sourceId,
            isLoading: false,
            sourceDetail: '获取数据失败',
            progressSteps: [],
          })
        }
      }
    }
  }

  return {
    openCellNotification,
    contextHolder,
  }
}
