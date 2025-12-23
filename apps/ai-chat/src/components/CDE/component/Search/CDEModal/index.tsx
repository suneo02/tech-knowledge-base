import { Modal, Button } from '@wind/wind-ui'
import React, { useMemo, useState, useCallback } from 'react'
import CDEContainer from '../components/container'
import styles from './index.module.less'
import { CloseO } from '@wind/icons'
import { CDEFormBizValues } from 'cde'
import { t } from 'gel-util/intl'

const PREFIX = 'cde-modal'

interface CDEModalProps extends CDEModalOptions {
  visible: boolean
  onCancel: () => void
}

const STRINGS = {
  TITLE: t('431119', '企业高级筛选'),
  ONLY_CHINA: t('355864', '仅限中国大陆企业筛选'),
}
const DEFAULT_BODY_STYLE = { height: '80vh', overflow: 'hidden', padding: 0, minHeight: 520, maxHeight: 1000 }
const CDEModal: React.FC<CDEModalProps> = ({ visible, onCancel, tableId, sheetId, initialValues, onOk }) => {
  return (
    <Modal
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      width={'80vw'}
      footer={null}
      bodyStyle={DEFAULT_BODY_STYLE}
      title={null}
      closable={false}
    >
      <div className={styles[`${PREFIX}-container`]}>
        <div className={styles[`${PREFIX}-header`]}>
          <h3>{STRINGS.TITLE}</h3>
          <div className={styles[`${PREFIX}-header-right`]}>
            <div className={styles[`${PREFIX}-header-right-text`]}>{STRINGS.ONLY_CHINA}</div>
            {/* @ts-expect-error wind-ui 类型错误 */}
            <Button type="text" size="small" onClick={onCancel} icon={<CloseO />}></Button>
          </div>
        </div>
        <div className={styles[`${PREFIX}-body`]}>
          <CDEContainer tableId={tableId} sheetId={sheetId} initialValues={initialValues} onOk={onOk} />
        </div>
      </div>
    </Modal>
  )
}

export interface CDEModalOptions {
  tableId?: string
  sheetId?: string
  initialValues?: CDEFormBizValues[]
  onOk?: (e: { sheetId: number; sheetName: string }[]) => void
}

export interface CDEModalAPI {
  show: (options?: CDEModalOptions) => void
  hide: () => void
}

export const useCDEModal = (): [CDEModalAPI, React.ReactNode] => {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<CDEModalOptions>({})

  const show = useCallback((newOptions: CDEModalOptions = {}) => {
    setOptions(newOptions)
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  const modalAPI = useMemo<CDEModalAPI>(
    () => ({
      show,
      hide,
    }),
    [show, hide]
  )

  const contextHolder = useMemo(
    () => (
      <CDEModal
        key={new Date().getTime()}
        visible={visible}
        onCancel={hide}
        tableId={options.tableId}
        sheetId={options.sheetId}
        initialValues={options.initialValues}
        onOk={options.onOk}
      />
    ),
    [visible, hide, options.tableId, options.sheetId, options.initialValues, options.onOk]
  )

  return [modalAPI, contextHolder]
}
