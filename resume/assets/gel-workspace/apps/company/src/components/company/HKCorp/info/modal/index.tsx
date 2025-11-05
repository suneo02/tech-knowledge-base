import { HKCorpProcessing } from '@/components/company/HKCorp/info/modal/processing.tsx'
import { StaticModal } from '@/components/modal/StaticModal.tsx'
import React, { FC } from 'react'
import { useHKCorpInfoCtx } from '../ctx.tsx'
import { HKCorpInstruction } from './instruction.tsx'
import { HKCorpPay } from './pay.tsx'
import styles from './style/index.module.less'

export const HKCorpInfoModal: FC = () => {
  const { state, dispatch } = useHKCorpInfoCtx()

  return (
    <StaticModal
      open={state.modalType != null}
      onCancel={() =>
        dispatch({
          type: 'SET_MODAL_TYPE',
          payload: undefined,
        })
      }
      closable={state.showModalClose === true}
      maskClosable={false}
      wrapClassName={styles.hkModalContainer}
      className={styles.hkModalContent}
    >
      {state.modalType === 'instruction' ? (
        <HKCorpInstruction />
      ) : state.modalType === 'pay' ? (
        <HKCorpPay />
      ) : state.modalType === 'processing' ? (
        <HKCorpProcessing />
      ) : null}
    </StaticModal>
  )
}
