import { isMultiCDEFilterItemUser } from '@/types/filter.ts'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import { InputKeyWords, InputKeyWordsProps } from '../filterOptions/InputKeyWords.tsx'
import styles from './style/conditionItem.module.less'
import { CDEFilterCompType } from './type.ts'

export const KeywordFilter: CDEFilterCompType = ({ item, updateFilter, filter }) => {
  const { itemName, logicOption, hoverHint } = item

  // 类型守卫，确定 filter 的 value 类型
  if (filter && !isMultiCDEFilterItemUser(filter)) {
    console.error('itemOption is not multi option', item, filter)
    return null
  }

  const onChangeCallback: InputKeyWordsProps['onChange'] = (value) => {
    updateFilter({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <div className={styles.conditionItem}>
      <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />
      <InputKeyWords value={filter?.value ?? []} onChange={onChangeCallback} />
    </div>
  )
}
