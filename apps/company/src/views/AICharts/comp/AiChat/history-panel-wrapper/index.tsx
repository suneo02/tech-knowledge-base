import { useAIChartData } from '@/views/AICharts/hooks/useChartData'
import React, { useState } from 'react'
import { Button } from '@wind/wind-ui'
import { PlusO } from '@wind/icons'
import styles from './index.module.less'
import HistoryRecords from '../history-records'
import classNames from 'classnames'
import { MyIcon } from '@/components/Icon'
import { useAIChartsStore } from '@/views/AICharts/store'

interface HistoryPanelWrapperProps {
  handleAddNewChat: () => void
  handleHistoryClick: (id: string) => void
  position: 'left' | 'top'
}
const HistoryPanelWrapper: React.FC<HistoryPanelWrapperProps> = (props) => {
  const { handleAddNewChat, handleHistoryClick, position} = props
  const { historyPanelShow, setHistoryPanelShow, activeChatId } = useAIChartsStore()
  // const { historyPanelShow, setHistoryPanelShow, chatId } = useAIChartData()
  const [historyPanelHover, setHistoryPanelHover] = useState(false)

  function renderLeftContent() {
    return (
      <div className={styles.leftContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 16 }}>
          <Button
            icon={<PlusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            className={styles.addBtn}
            style={{ width: 260 }}
            onClick={handleAddNewChat}
          >
            新增关系探查
          </Button>
          {/* <div
            className={styles.historyBtnBox}
            onClick={() => {
              setHistoryPanelShow((prev) => !prev)
              setHistoryPanelHover(false)
            }}
          >
            <Button type="text" icon={<MyIcon name="menuFolderLeft" />} />
          </div> */}
        </div>

        <div className={styles.historyList}>
          <HistoryRecords
            handleClick={handleHistoryClick}
            activeHistoryChatId={activeChatId}
          />
        </div>
      </div>
    )
  }

  function renderTopContent() {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', padding: '16px' }}
        >
          <Button
            icon={<PlusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            className={styles.addBtn}
            onClick={handleAddNewChat}
            style={{ width: 460 }}
          >
            新建对话
          </Button>
          <div
            className={styles.historyBtnBox}
            onMouseEnter={() => {
              if (!historyPanelShow) {
                setHistoryPanelHover(true)
              }
            }}
            onMouseLeave={() => {
              if (!historyPanelShow) {
                setHistoryPanelHover(false)
              }
            }}
            onClick={() => {
              // setHistoryPanelShow((prev) => !prev)
              setHistoryPanelHover(false)
            }}
          >
            <Button type="text" icon={<MyIcon name="menuFolderRight" />} />
            <div
              className={classNames(
                styles.hoverHistoryList,
                historyPanelHover ? styles.historyOpen : styles.historyClose
              )}
            >
              <HistoryRecords
                handleClick={handleHistoryClick}
                activeHistoryChatId={activeChatId}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (position === 'left') {
    return renderLeftContent()
  }

  // if (position === 'top') {
  //   return renderTopContent()
  // }
  return null
}

// export default React.memo(HistoryPanelWrapper)
export default HistoryPanelWrapper
