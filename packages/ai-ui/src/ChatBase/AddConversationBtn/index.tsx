import { Button } from '@wind/wind-ui'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import classNames from 'classnames'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'

export const AddConversationBtn: FC<ButtonProps> = ({ ...props }) => {
  return (
    // @ts-expect-error ttt
    <Button variant="alice" {...props} className={classNames(styles.addConversationBtn, props.className)}>
      {t('421522', '新建对话')}
    </Button>
  )
}
