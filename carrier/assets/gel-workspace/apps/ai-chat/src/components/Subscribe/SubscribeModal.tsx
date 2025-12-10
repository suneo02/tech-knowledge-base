import { CloseO } from '@wind/icons'
import { Button, Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React, { useCallback, useMemo, useState } from 'react'
import type { SubscribeFormValues } from './Subscribe'
import Subscribe from './Subscribe'
import styles from './index.module.less'

const PREFIX = 'subscribe'

const STRINGS = {
  TITLE: t('464198', '订阅设置'),
  TITLE_NEWS: t('464195', '订阅动态'),
}

interface SubscribeModalProps extends SubscribeModalOptions {
  visible: boolean
  onCancel: () => void
  title?: string
}

const DEFAULT_BODY_STYLE = {
  height: '70vh',
  overflow: 'hidden',
  padding: 0,
  minHeight: 400,
  maxHeight: 800,
  position: 'relative',
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  tableId,
  visible,
  onCancel,
  onOk,
  onGoToSetting,
  showFooter,
  preview,
  title,
  onDismiss,
}) => {
  const handleCancel = () => {
    onCancel()
  }

  const handleSubmit = () => {
    onOk?.({} as SubscribeFormValues)
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      onCancel={handleCancel}
      width={'60vw'}
      footer={null}
      bodyStyle={DEFAULT_BODY_STYLE}
      title={null}
      closable={false}
    >
      <div className={styles[`${PREFIX}-modal-wrapper`]}>
        <div className={styles[`${PREFIX}-modal-header`]}>
          <h3>{title || preview ? STRINGS.TITLE_NEWS : STRINGS.TITLE}</h3>
          <div className={styles[`${PREFIX}-modal-header-right`]}>
            {/* @ts-expect-error wind-ui 类型错误 */}
            <Button type="text" size="small" onClick={handleCancel} icon={<CloseO />}></Button>
          </div>
        </div>
        <div className={styles[`${PREFIX}-modal-body`]}>
          <Subscribe
            tableId={tableId}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onGoToSetting={onGoToSetting}
            showFooter={showFooter}
            preview={preview}
            onDismiss={onDismiss}
          />
        </div>
      </div>
    </Modal>
  )
}

export interface SubscribeModalOptions {
  tableId: string
  sheetId?: string
  onOk?: (values: SubscribeFormValues) => void
  onGoToSetting?: () => void // 跳转到订阅设置的回调
  showFooter?: boolean
  preview?: boolean // 预览模式 不能操作
  onDismiss?: () => void // 取消订阅的回调
}

interface SubscribeModalAPI {
  show: (options: SubscribeModalOptions) => void
  hide: () => void
}

export const useSubscribeModal = (): [SubscribeModalAPI, React.ReactNode] => {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<SubscribeModalOptions>({ tableId: '' })

  const show = useCallback((newOptions: SubscribeModalOptions) => {
    setOptions(newOptions)
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  const modalAPI = useMemo<SubscribeModalAPI>(
    () => ({
      show,
      hide,
    }),
    [show, hide]
  )

  const contextHolder = useMemo(
    () => (
      <SubscribeModal
        key={new Date().getTime()}
        visible={visible}
        onCancel={hide}
        tableId={options.tableId}
        sheetId={options.sheetId}
        onOk={options.onOk}
        onGoToSetting={options.onGoToSetting}
        showFooter={options.showFooter}
        preview={options.preview}
        onDismiss={options.onDismiss}
      />
    ),
    [
      visible,
      hide,
      options.tableId,
      options.sheetId,
      options.onOk,
      options.onGoToSetting,
      options.showFooter,
      options.preview,
      options.onDismiss,
    ]
  )

  return [modalAPI, contextHolder]
}

export default SubscribeModal
