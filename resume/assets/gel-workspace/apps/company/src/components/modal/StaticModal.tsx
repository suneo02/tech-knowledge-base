import { CloseO } from '@wind/icons'
import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './styles/staticModal.module.less'

interface StaticModalProps {
  open?: boolean
  onCancel?: () => void
  closable?: boolean
  mask?: boolean
  maskClosable?: boolean
  children?: React.ReactNode
  className?: string
  wrapClassName?: string
}

export const StaticModal: FC<StaticModalProps> = ({
  open = false,
  onCancel,
  closable = true,
  mask = true,
  maskClosable = false,
  children,
  className = '',
  wrapClassName = '',
}) => {
  if (!open) return null

  const handleMaskClick = () => {
    if (maskClosable && onCancel) {
      onCancel()
    }
  }

  return (
    <>
      {mask && <div className={styles.mask} onClick={handleMaskClick} />}
      <div className={`${styles.wrapper} ${wrapClassName}`}>
        <div className={`${styles.content} ${className}`}>
          {closable && (
            <button className={classNames(styles.closeButton, 'w-modal-close')} onClick={onCancel}>
              <CloseO className="w-modal-close-x" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
