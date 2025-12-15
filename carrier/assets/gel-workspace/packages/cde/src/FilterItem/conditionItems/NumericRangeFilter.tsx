import { isSingleCDEFilterItemUser } from '@/types/filter.ts'
import classNames from 'classnames'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import { NumberRangeOption } from '../filterOptions/NumberRangeOption.tsx'
import styles from './style/conditionItem.module.less'
import { CDEFilterCompType } from './type.ts'

export const NumericRangeFilter: CDEFilterCompType = ({ item, updateFilter, filter }) => {
  const { itemName, logicOption, hoverHint } = item

  if (filter && !isSingleCDEFilterItemUser(filter)) {
    console.error('filter is not single option', filter)
    return null
  }

  const handleChange = (value: string) => {
    updateFilter({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <div className={classNames(styles.conditionItem, 'range-box-absolute')}>
      <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />
      <NumberRangeOption onChange={handleChange} value={filter?.value || ''} />
    </div>
  )
}
