import { InfoCircleOutlined } from '@/assets/icons'
import { Popover } from '@wind/wind-ui'
import classNames from 'classnames'
import { FC } from 'react'
import styles from './style/filterLabel.module.less'

interface ConditionTitleProps {
  filter?: boolean
  itemName?: string
  hoverHint?: string
}

export const FilterLabel: FC<ConditionTitleProps> = ({ filter, itemName, hoverHint }) => {
  return (
    <p className={classNames(styles.subTitle, { [styles.hasVal]: filter })}>
      <p>{itemName}</p>

      {hoverHint ? (
        <Popover content={hoverHint} style={{ width: 400 }}>
          <InfoCircleOutlined />
        </Popover>
      ) : null}
    </p>
  )
}
