import React from 'react'
import { Button, DatePicker } from '@wind/wind-ui'
import { CloseO } from '@wind/icons'
import { ItemOptionItem } from '../../../types'
import styles from './index.module.less'
import { DateRangeValue } from '../../utils/date'

const { RangePicker } = DatePicker

const PREFIX = 'logic-with-searchable-tags'

export interface SelectedItem extends ItemOptionItem {
  dateRange?: DateRangeValue
}

interface SelectedItemTagProps {
  item: SelectedItem
  onRemove: (item: SelectedItem) => void
  onDateChange: (item: SelectedItem, dates: DateRangeValue) => void
}

const SelectedItemTag: React.FC<SelectedItemTagProps> = ({ item, onRemove, onDateChange }) => {
  return (
    <div key={item.id} className={styles[`${PREFIX}-tag-item`]}>
      <div className={styles[`${PREFIX}-tag-item-content`]}>
        <div className={styles[`${PREFIX}-tag-item-name`]}>{item.name}</div>
        {item.validDate === 1 && (
          <div className={styles[`${PREFIX}-tag-item-date-picker-container`]}>
            <RangePicker
              size="small"
              value={item.dateRange as DateRangeValue}
              onChange={(dates) => onDateChange(item, dates as DateRangeValue)}
            />
          </div>
        )}
      </div>
      <div className={styles[`${PREFIX}-tag-item-close`]}>
        {/* @ts-expect-error wind-ui's icon type is complex, using as any to bypass */}
        <Button type="text" size="small" icon={(<CloseO />) as any} onClick={() => onRemove(item)} />
      </div>
    </div>
  )
}

export default SelectedItemTag
