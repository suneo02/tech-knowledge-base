import { Select } from '@wind/wind-ui'
import classNames from 'classnames'
import { CDELogicOptionValue } from 'gel-api'
import { intl } from 'gel-util/intl'
import { CDELogicDefault } from '../config'
import styles from './style/logicOption.module.less'

const OPTIONS = [
  { value: 'notAny', label: intl('257771', '不含') },
  { value: 'any', label: intl('257770', '含任一') },
  { value: 'all', label: intl('257777', '含所有') },
]

export interface LogicOptionProps {
  value?: CDELogicOptionValue
  onChange?: (value: CDELogicOptionValue) => void
  className?: string
}

export const LogicOption = ({ value, onChange, className }: LogicOptionProps) => {
  return (
    <Select
      size="large"
      options={OPTIONS}
      value={value}
      defaultValue={CDELogicDefault}
      onChange={onChange}
      className={classNames('prefixLogic', styles.box, className)}
    />
  )
}
