import React, { useCallback, useMemo, useState } from 'react'

import { Button, Modal as WModal } from '@wind/wind-ui'
import Advice, { type AdviceProps } from './Advice'
import { CloseO } from '@wind/icons'
import { ModalFuncProps, ModalProps } from '@wind/wind-ui/lib/modal/Modal'
import styles from './index.module.less'
import { IndicatorTreePanelLocal } from '../Indicator/TreePanel'
import { confirmUsage, ConfirmUsageOptions, isUsageAcknowledged, type ConfirmUsageType } from './confirm'

const PREFIX = 'c-modal'
export const CMODALS = {
  ADVICE: 'ADVICE',
  INDICATOR: 'INDICATOR',
} as const

export type ModalKey = keyof typeof CMODALS

export interface ModalPropsMap {
  ADVICE: AdviceProps & ModalProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  INDICATOR: any & ModalProps
}

type ModalComponent<K extends ModalKey> = React.ComponentType<ModalPropsMap[K]>

const MODAL_COMPONENTS: Record<ModalKey, ModalComponent<ModalKey>> = {
  ADVICE: Advice as ModalComponent<'ADVICE'>,
  INDICATOR: IndicatorTreePanelLocal as ModalComponent<'INDICATOR'>,
}

export interface ModalAPI {
  open: <K extends ModalKey>(type: K, props: ModalPropsMap[K]) => void
  close: () => void
}

export interface ModalAPIFor<K extends ModalKey> {
  open: (props: ModalPropsMap[K]) => void
  close: () => void
}

type ActiveState = { type: ModalKey | null; props: ModalPropsMap[ModalKey] }

// Overloads
function useInternalModal(): [ModalAPI, React.ReactNode]
function useInternalModal<K extends ModalKey>(defaultType: K): [ModalAPIFor<K>, React.ReactNode]
function useInternalModal(defaultType?: ModalKey): [ModalAPI | ModalAPIFor<ModalKey>, React.ReactNode] {
  const [active, setActive] = useState<ActiveState>({ type: null, props: {} as ModalPropsMap[ModalKey] })

  const open = useCallback(<K extends ModalKey>(type: K, props: ModalPropsMap[K]) => {
    setActive({ type, props })
  }, [])

  const close = useCallback(() => setActive({ type: null, props: {} as ModalPropsMap[ModalKey] }), [])

  const api = useMemo(() => {
    if (defaultType) {
      const openWithFixedType = (props: ModalPropsMap[typeof defaultType]) => open(defaultType, props as never)
      return { open: openWithFixedType, close } as ModalAPIFor<typeof defaultType>
    }
    return { open, close } as ModalAPI
  }, [close, defaultType, open])

  const holder = useMemo(() => {
    if (!active.type) return null
    const Component = MODAL_COMPONENTS[active.type]
    const props = active.props

    switch (active.type) {
      case 'ADVICE':
        return (
          <WModal
            className={styles[`${PREFIX}-modal`]}
            open
            visible
            onCancel={close}
            footer={null}
            destroyOnClose
            closable={false}
            bodyStyle={{ padding: '4px 12px 12px' }}
            width={'600px'}
          >
            <div className={styles[`${PREFIX}-modal-header`]}>
              <h3>{props.title ?? ''}</h3>
              {/* @ts-expect-error wind-ui 类型错误 */}
              <Button type="text" onClick={close} icon={<CloseO />} size="large"></Button>
            </div>

            <Component {...props} onCancel={close} onSubmit={() => close()} />
          </WModal>
        )
        break
      case 'INDICATOR':
        return (
          <WModal
            className={styles[`${PREFIX}-modal`]}
            open
            visible
            onCancel={close}
            footer={null}
            destroyOnClose
            closable={false}
            bodyStyle={{ padding: '4px 12px 12px' }}
            width={'80vw'}
          >
            <div className={styles[`${PREFIX}-modal-header`]}>
              <h3>{props.title ?? ''}</h3>
              {/* @ts-expect-error wind-ui 类型错误 */}
              <Button type="text" onClick={close} icon={<CloseO />} size="large"></Button>
            </div>

            <Component {...props} onCancel={close} onSubmit={() => close()} />
          </WModal>
        )
      default:
        return null
    }
  }, [active, close])

  return [api as ModalAPI | ModalAPIFor<ModalKey>, holder]
}

// 与 AntD 对齐的 API：Modal.useModal()
export const CModal = {
  useModal: useInternalModal,
  /**
   * 业务使用须知确认弹窗
   * 仅需传入 type 与 onOk，其他参数透传给原生 confirm
   */
  confirm: (options: ConfirmUsageOptions) => confirmUsage(options),

  /**
   * 读取是否已勾选“后续默认为我勾中提示”
   */
  isUsageAcknowledged: (type: ConfirmUsageType) => isUsageAcknowledged(type),
}

export type { AdviceProps }
