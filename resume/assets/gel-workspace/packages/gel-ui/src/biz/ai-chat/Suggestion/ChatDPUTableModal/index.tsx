import { Modal } from '@wind/wind-ui'
import { DPUItem } from 'gel-api'
import React from 'react'
import { ChatDPUTableViewer } from '../ChatDPUTableViewer'

/** Modal宽度，设置为屏幕宽度的70% */
const MODAL_WIDTH = '70%'

/** Modal最小宽度，单位为像素 */
const MODAL_MIN_WIDTH = 900

/** Modal最大宽度，单位为像素 */
const MODAL_MAX_WIDTH = 1920

interface RefTableModalProps {
  /** 是否显示Modal */
  visible: boolean
  /** 表格数据 */
  data: DPUItem
  /** 关闭Modal的回调函数 */
  onClose: () => void
}

/**
 * 引用表格Modal组件
 *
 * @description 用于显示引用表格数据的弹窗，支持查看原始数据功能
 * @since 1.0.0
 *
 * @param visible - 控制Modal显示状态
 * @param data - 表格数据对象
 * @param onClose - 关闭Modal的回调函数
 *
 * @returns JSX.Element Modal组件
 */
export const ChatDPUTableModal: React.FC<RefTableModalProps> = ({ visible, data, onClose }) => {
  return (
    <Modal
      title={data?.rawSentence || ''}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={MODAL_WIDTH}
      style={{ minWidth: MODAL_MIN_WIDTH, maxWidth: MODAL_MAX_WIDTH }}
      destroyOnClose
    >
      <ChatDPUTableViewer data={data} onJumpComplete={onClose} />
    </Modal>
  )
}
