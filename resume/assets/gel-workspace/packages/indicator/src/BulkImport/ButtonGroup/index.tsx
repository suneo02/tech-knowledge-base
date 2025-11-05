import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import styles from './style.module.less'

interface ButtonGroupProps {
  onCancel: () => void
  onSubmit: () => void
  submitDisabled: boolean
  submitText?: string
  cancelText?: string
  submitButtonWidth?: string
}

export function ButtonGroup({
  onCancel,
  onSubmit,
  submitDisabled,
  submitText,
  cancelText,
  submitButtonWidth = '100px',
}: ButtonGroupProps) {
  return (
    <div className={styles['button-group__container']}>
      <Button className={styles['button-group__button']} onClick={onCancel}>
        {cancelText ? t(cancelText) : t('3372173', '取消')}
      </Button>
      <Button
        className={styles['button-group__button']}
        type="primary"
        htmlType="submit"
        style={{ width: submitButtonWidth }}
        onClick={onSubmit}
        disabled={submitDisabled}
      >
        {submitText ? t(submitText) : t('', '导入并匹配')}
      </Button>
    </div>
  )
}
