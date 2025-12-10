import { Button } from '@wind/wind-ui'
import { CloseO } from '@wind/icons'
import { FC } from 'react'
import styles from './index.module.less'

// @ts-expect-error wind-ui-icons
const CloseIcon: FC<Partial<WIconProps>> = (props) => <CloseO {...props} />

const PREFIX = 'spl-table-modal-header'

export const ModalHeader: FC<{
  title: string
  onClose: () => void
}> = ({ title, onClose }) => (
  <div className={styles[`${PREFIX}-container`]}>
    <p className={styles[`${PREFIX}-title`]}>{title}</p>
    <Button icon={<CloseIcon />} onClick={onClose} type="text" />
  </div>
)
