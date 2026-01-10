import React, { useState, useEffect, useRef, useCallback } from 'react'
import { GRAPH_MENU_TYPE, WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE } from '@/views/Charts/types'
import OperatorRight from '@/views/Charts/comp/operatorRight'
import { useAIGraph } from '../../context'
import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import '@wind/Wind.Base.Enterprise.Graph/lib/index.css'
import SpinLoading from '@/views/Charts/comp/spin-loading'
import useTableData from '../../hooks/useTableData'
import { ROBOT_THINKING_MESSAGE_ID } from '../AiChat/constant'
import { t } from 'gel-util/intl'
import styles from './index.module.less'
import { AliceBitmapAnimation } from '@wind/alice-bitmap-animation'
import liuguang from '@/assets/imgs/f5_header_animation_1.png' // 一半是圆角的精灵图
import { useAIChartsStore } from '../../store'

interface AIChartsGraphProps {
  resizerTrigger: number // 记录内容区宽度变化事件
  width: number
  height: number
  fetching: boolean
  handleSummaryClick: () => void
}

const AIChartsGraph: React.FC<AIChartsGraphProps> = (props) => {
  const { resizerTrigger, width, height, fetching, handleSummaryClick } = props
  const { onChartThumbnailsChange } = useAIGraph()
  const { activeChatId, chatMessageList, currentVersion, getCurrentChartData } = useAIChartsStore()
  const [menu, setMenu] = useState({ type: GRAPH_MENU_TYPE.ACTUAL_CONTROLLER, title: '实控人图' })
  const [actions, setActions] = useState({
    triggerSave: 0,
    triggerRefresh: 0,
    triggerLarge: 0,
    triggerSmall: 0,
    zoomFactor: 1,
    onZoom: (scale: number) => {
      setActions((prev) => ({ ...prev, zoomFactor: scale }))
    },
  })

  const { graphConfig } = useTableData()
  const [dimensions, setDimensions] = useState({ width, height })
  const containerRef = useRef(null)

  const currentChartData = getCurrentChartData()

  // 获取当前版本对应的消息
  const getCurrentMessage = useCallback(() => {
    if (!chatMessageList || !currentVersion) return undefined
    // 查找当前版本对应的机器人消息
    const currentMessage = chatMessageList.find(
      (item) => item.version === currentVersion && item.role === 2 && item.id !== ROBOT_THINKING_MESSAGE_ID
    )
    return currentMessage
  }, [chatMessageList, currentVersion])

  // 更新尺寸的函数
  const updateDimensions = useCallback(() => {
    // 使用setTimeout确保在DOM更新后获取新的尺寸
    setTimeout(() => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current

        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        })
      }
    }, 0) // 延迟确保DOM已更新
  }, [resizerTrigger])

  // 初始化和尺寸变化时更新
  useEffect(() => {
    // 初始获取尺寸
    updateDimensions()

    // 监听窗口大小变化
    window.addEventListener('resize', updateDimensions)

    // 清理函数
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [updateDimensions])

  const handleSave = () => {
    setActions((prev) => ({ ...prev, triggerSave: prev.triggerSave + 1 }))
  }

  const handleRefresh = () => {
    setActions((prev) => ({ ...prev, triggerRefresh: prev.triggerRefresh + 1, zoomFactor: 1 }))
  }

  const handleSize = (value: number) => {
    setActions((prev) => ({ ...prev, zoomFactor: value / 100 }))
  }

  // 操作区域handle
  const handleOperatorAction = (type: string, value?: number) => {
    switch (type) {
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.SaveImage:
        handleSave()
        break
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.Restore:
        handleRefresh()
        break
      case WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.Size:
        handleSize(value)
        break
      default:
        break
    }
  }

  // 处理图表缩略图变化
  const handleGraphThumbnailChange = useCallback(
    (img: string) => {
      const currentMessage = getCurrentMessage()
      if (img && currentMessage?.role === 2) {
        onChartThumbnailsChange(img, currentMessage?.role, activeChatId, currentVersion)
      }
    },
    [getCurrentMessage, onChartThumbnailsChange, activeChatId, currentVersion]
  )

  // 只有当前消息没有thumbnail时才传递回调
  const currentMessage = getCurrentMessage()
  const shouldGenerateThumbnail = !currentMessage?.thumbnail

  return (
    <div className={styles.root} ref={containerRef}>
      {fetching ? (
        <SpinLoading />
      ) : (
        <>
          <OperatorRight
            menu={menu}
            onOperatorAction={handleOperatorAction}
            resetSize={actions.zoomFactor === 1 ? true : false}
            zoomFactor={actions.zoomFactor}
            data-uc-id="Km2b_TSv8M"
            data-uc-ct="operatorright"
          />
          <WindBDGraph
            config={{
              ...graphConfig,
              width: dimensions.width,
              height: dimensions.height,
            }}
            width={dimensions.width}
            height={dimensions.height}
            data={currentChartData?.relations ? currentChartData : null}
            actions={actions}
            saveImgName={currentChartData?.name}
            {...(shouldGenerateThumbnail && { onGraphThumbnailChange: handleGraphThumbnailChange })}
            fromAi
            data-uc-id="0cIuTpyjpi"
            data-uc-ct="windbdgraph"
            footerTips={t('453642', '内容由AI生成，请核查重要信息')}
          />
          <div className={styles.summaryIcon} onClick={handleSummaryClick}>
            <AliceBitmapAnimation imageSrc={liuguang} frameWidth={94} frameHeight={36} fps={10} />
            <span className={styles.summaryText}>{t('', 'AI智能总结')}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default AIChartsGraph
