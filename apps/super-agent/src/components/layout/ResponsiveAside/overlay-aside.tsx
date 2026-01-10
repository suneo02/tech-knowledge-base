import { InsertO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import styles from './index.module.less'
import type { PropsWithChildren } from 'react'

type OverlayAsideProps = {
  open: boolean
  onClose: () => void
  title?: string
  ariaLabelClose?: string
}

const PREFIX = 'responsive-aside'

export const OverlayAside: React.FC<PropsWithChildren<OverlayAsideProps>> = ({
  open,
  onClose,
  title,
  ariaLabelClose,
  children,
}) => {
  return (
    <>
      <div
        className={classNames(styles[`${PREFIX}-overlay`], {
          [styles[`${PREFIX}-overlayOpen`]]: open,
        })}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles[`${PREFIX}-overlayHeader`]}>
          {title ? <span className={styles[`${PREFIX}-titleGradient`]}>{title}</span> : null}
          <Button size="small" onClick={onClose} icon={<InsertO />} type="text" aria-label={ariaLabelClose} />
        </div>
        <div className={styles[`${PREFIX}-overlayBody`]}>{children}</div>
      </div>
      <div
        className={classNames(styles[`${PREFIX}-mask`], {
          [styles[`${PREFIX}-maskVisible`]]: open,
        })}
        onClick={onClose}
      />
    </>
  )
}

export default OverlayAside
