import { EyeO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { DPUItem } from 'gel-api'
import { MultiTabId, multiTabIds } from 'gel-util/corpConfig'
import { t } from 'gel-util/intl'
import React from 'react'
import { ChatDPUTable } from '../ChatDPUTable'
import styles from './index.module.less'

// 常量定义
/** 自定义属性名，用于标识DOM元素 */
const CUSTOM_ATTR = 'data-custom-id'

/** 多标签ID属性名，用于多标签页面的元素标识 */
const MULTITAB_ID_ATTR = 'multitabid'

/** 最大重试次数，用于查找DOM元素时的循环限制 */
const MAX_RETRY_COUNT = 5

const intlMsg = {
  refData: t('', '查看原始数据'),
}

interface RefTableViewerProps {
  /** 表格数据 */
  data: DPUItem
  /** 跳转完成后的回调函数（可选） */
  onJumpComplete?: () => void
}

/**
 * 引用表格查看器组件
 *
 * @description 用于显示引用表格数据，包含工具栏和表格内容，支持查看原始数据功能
 * @since 1.0.0
 *
 * @param data - 表格数据对象
 * @param onJumpComplete - 跳转完成后的回调函数
 *
 * @returns JSX.Element 表格查看器组件
 */
export const ChatDPUTableViewer: React.FC<RefTableViewerProps> = ({ data, onJumpComplete }) => {
  /**
   * 跳转到指定模块
   * @description 当用户点击查看原始数据时，滚动到对应的模块位置
   */
  const handleJumpClick = () => {
    const moduleID = data.moduleID

    if (moduleID) {
      let table = document.querySelector(`[${CUSTOM_ATTR}="${moduleID}"]`)
      if (!table) {
        for (let i = 0; i < MAX_RETRY_COUNT; i++) {
          if (multiTabIds.indexOf(moduleID.toString() as MultiTabId) > -1) {
            table = document.querySelector(`[${MULTITAB_ID_ATTR}=${moduleID}]`)
            if (!table) {
              return
            }
            break
          }
          if (!table) {
            table = document.querySelector(`[${CUSTOM_ATTR}="${moduleID}-${i}"]`)
          }
        }
      }
      if (table) {
        table.scrollIntoView({ behavior: 'smooth' })
        onJumpComplete?.()
      }
    }
  }

  return (
    <>
      {data?.moduleID ? (
        <div className={styles.tools}>
          <Button
            onClick={handleJumpClick}
            icon={<EyeO onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />}
          >
            {intlMsg.refData}
          </Button>
        </div>
      ) : null}
      <ChatDPUTable data={data} />
    </>
  )
}
