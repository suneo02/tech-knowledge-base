import { Button } from '@wind/wind-ui'
import styles from './actionButtons.module.less'
import { t } from 'gel-util/intl'

interface ActionButtonsProps {
  onClose: () => void
  onConfirm: () => void
  disabled: boolean
  okText?: string
  loading?: boolean
}

const STRINGS = {
  CLOSE: t('6653', '关闭'),
  OK: t('464142', '提取'),
}

export const ActionButtons = ({ onClose, onConfirm, disabled, okText = STRINGS.OK, loading }: ActionButtonsProps) => {
  return (
    <div className={styles.rightFooterButtons}>
      <Button onClick={onClose}>{STRINGS.CLOSE}</Button>
      <Button type="primary" disabled={disabled} onClick={onConfirm} loading={loading}>
        {okText}
      </Button>
    </div>
  )
}
