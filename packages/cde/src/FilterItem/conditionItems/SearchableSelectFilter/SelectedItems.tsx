import { DatePickerOption } from '@/FilterItem/filterOptions/DatePickerOption'
import { SingleOption } from '@/FilterItem/filterOptions/SingleOption'
import { Tag } from '@wind/wind-ui'
import { CDERankQueryFilterValue } from 'gel-api'
import { intl } from 'gel-util/intl'
import styles from './style/selectedItems.module.less'

interface SelectedItemsProps {
  selectedItems: CDERankQueryFilterValue[]
  handleDateChange: (dates: any, selectedItem: CDERankQueryFilterValue) => void
  handleYearChange: (yearValue: string, selectedItem: CDERankQueryFilterValue) => void
  onRemoveItem: (item: CDERankQueryFilterValue) => void
}

/**
 * Component for displaying selected items with date and year selection options
 */
export const SelectedItems = ({
  selectedItems,
  handleDateChange,
  handleYearChange,
  onRemoveItem,
}: SelectedItemsProps) => {
  if (selectedItems.length === 0) {
    return null
  }

  return (
    <div className={styles.selectedItemsWrapper}>
      {selectedItems.map((item) => (
        <div key={String(item.value)} className={styles.selectedItem}>
          {/* @ts-expect-error wind ui */}
          <Tag className={styles.selectedItemTag} closable onClose={() => onRemoveItem(item)}>
            {item.objectName}
          </Tag>
          {item.validDate ? (
            <div className={styles.selectCorplistOption}>
              <span>{intl('21235', '有效期')}：</span>
              <DatePickerOption value={item.objectDate} onChange={(dates) => handleDateChange(dates, item)} />
            </div>
          ) : null}

          {!item.validDate && item.certYear && item.itemOption && item.itemOption.length > 0 ? (
            <div className={styles.selectCorplistOption}>
              <div>{intl('334077', '认证年度')}：</div>
              <SingleOption
                itemOption={item.itemOption}
                info={{
                  selfDefine: item.selfDefine,
                  itemRemark: item.itemRemark,
                }}
                value={item.objectYear ? String(item.objectYear) : ''}
                changeOptionCallback={(val) => handleYearChange(val, item)}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
