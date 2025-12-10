import React, { FC, ReactNode } from 'react'
import { ModalProps } from '@wind/wind-ui/es/modal/Modal'
import { Modal } from '@wind/wind-ui'

export const ModalSafeType: FC<
  ModalProps & {
    children: ReactNode
  }
> = ({ children, ...props }) => {
  return (
    <Modal {...props} data-uc-id="sm_6SzIj19" data-uc-ct="modal">
      {children}
    </Modal>
  )
}
