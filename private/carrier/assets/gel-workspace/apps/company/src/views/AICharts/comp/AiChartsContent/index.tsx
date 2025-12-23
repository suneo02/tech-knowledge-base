import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Layout, Pagination, Resizer } from '@wind/wind-ui'
import AIChartsRight from '../AiChartsRight'
import styles from './index.module.less'
import { useAIChartData } from '../../hooks/useChartData'
import AiChat from '../AiChat'
import classNames from 'classnames'
import { LeftO, RightO } from '@wind/icons'
import { useSSE } from '@/api/ai-graph/useSSE'
import { ROBOT_SUMMARY_PREFIX, ROBOT_THINKING_MESSAGE_ID } from '../AiChat/constant'
import { getRandomId } from '../../utils'
import Introduce from './introduce'
import { useAIChartsStore } from '../../store'

const { Content } = Layout

/**
 * @description AI图谱内容组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsContent = () => {
  const { chatMessageIdRef } = useAIChartData()
  const {
    activeChatId,
    historyChatList,
    setFetchingStatus,
    currentVersion,
    setCurrentVersion,
    totalVersionCount,
    historyPanelShow,
    addChatMessageItems,
    finishChatMessageSummaryStatus,
    handleUpdateChatMessageAfterAiSummaryResponse,
  } = useAIChartsStore()
  const chatContainerRef = useRef<HTMLDivElement>()
  const chartLeftWidth = activeChatId ? 876 : 300

  const [resizerTrigger, setResizerTrigger] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Resizer组件默认会分配左右两侧宽度，此处需要强制设置自定义的宽度
    if (chatContainerRef.current) {
      chatContainerRef.current.style.width = `${chartLeftWidth}px`
      setDimensions({ width: chatContainerRef.current.offsetWidth, height: chatContainerRef.current.offsetHeight })
    }

    setResizerTrigger((prev) => prev + 1)
  }, [activeChatId])

  function handleResizeCallback() {
    setResizerTrigger((prev) => prev + 1)
  }

  const onMessage = useCallback(
    (res) => {
      const data = res.data
      if (data.done) {
        resetSummaryStatus()
      }
      if (data.content) {
        const id = `${ROBOT_SUMMARY_PREFIX}${++chatMessageIdRef.current}` // 使用字符串ID确保唯一性
        handleUpdateChatMessageAfterAiSummaryResponse(activeChatId, data.content, id)
      }
    },
    [activeChatId]
  )

  const resetSummaryStatus = useCallback(() => {
    setFetchingStatus({
      type: 'summary',
      value: false,
    })
    finishChatMessageSummaryStatus()
  }, [])

  const onError = useCallback(() => {
    resetSummaryStatus()
  }, [])

  const { connect, close } = useSSE(`/EnterpriseGraph/v1/graph-summary`, {
    onMessage,
    onError,
  })

  async function handleSummaryClick() {
    addChatMessageItems([
      {
        id: ++chatMessageIdRef.current,
        role: 1,
        content: '请帮我总结分析这个生成的图谱',
      },
      {
        id: ROBOT_THINKING_MESSAGE_ID,
        role: 2,
      },
    ])
    const requestId = getRandomId()
    setFetchingStatus({
      type: 'summary',
      value: true,
    })
    connect({ chatId: activeChatId, version: currentVersion, requestId, question: '请帮我总结分析这个生成的图谱' })
  }

  const handleCancelSummary = useCallback(() => {
    close()
    resetSummaryStatus()
  }, [close, setFetchingStatus])

  const onModalConfirm = (data) => {
    console.log(data)
  }

  return (
    // @ts-ignore wind-ui
    <Layout className={styles.aiChartsContent}>
      <>
        {/* @ts-ignore wind-ui */}
        <div className={styles.aiChartsLeft} style={{ width: `${chartLeftWidth}px !important` }} ref={chatContainerRef}>
          <AiChat handleCancelSummary={handleCancelSummary} />
        </div>
        {activeChatId && (
          <Resizer
            style={{ background: '#F3F5F7' }}
            key={`${historyPanelShow}`}
            data-uc-id="pn1tpWeg38"
            data-uc-ct="resizer"
            onResize={handleResizeCallback}
          />
        )}
      </>
      {/* 先获取历史记录列表后再渲染右侧内容区 */}
      {!!historyChatList && (
        // @ts-ignore
        <Content className={styles.aiChartsRight}>
          {activeChatId ? (
            <>
              <AIChartsRight
                resizerTrigger={resizerTrigger}
                dimensions={dimensions}
                handleSummaryClick={handleSummaryClick}
              />
              {totalVersionCount > 0 && (
                <>
                  {/* <div className={styles.AiTips}>内容由AI生成，请核查重要信息</div> */}
                  <div
                    className={classNames(
                      styles.versionSwitch,
                      totalVersionCount < 8 && styles.hiddenPrevBtn,
                      totalVersionCount < 8 && styles.hiddenNextBtn
                    )}
                  >
                    <Pagination
                      defaultPageSize={1}
                      showSizeChanger={false}
                      current={currentVersion}
                      total={totalVersionCount}
                      showTitle={false}
                      onChange={(version) => setCurrentVersion(version)}
                      // what? 没有提供第三个参数？originalElement
                      itemRender={(page, type) => {
                        if (type === 'prev') {
                          return <LeftO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        }
                        if (type === 'next') {
                          return <RightO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        }
                        if (type === 'jump-prev') {
                          return (
                            <span>
                              <LeftO
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                style={{ marginRight: -6 }}
                              />
                              <LeftO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </span>
                          )
                        }
                        if (type === 'jump-next') {
                          return (
                            <span>
                              <RightO
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                style={{ marginRight: -6 }}
                              />
                              <RightO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </span>
                          )
                        }
                        if (type === 'page') {
                          return `G${page}`
                        }
                        return null
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <Introduce />
          )}
        </Content>
      )}
    </Layout>
  )
}

export default AIChartsContent
