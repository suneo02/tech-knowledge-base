import React from 'react'
import { ConditionItem } from '.'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'
import NumberRangeOption from '../filterOptions/NumberRangeOption'

const NumberRange = ({ item, left }) => {
  const { isVip, itemId, itemName, logicOption, hoverHint } = item

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter
  const min = filter ? filter.value[0].split('-')[0] : ''
  const max = filter ? filter.value[0].split('-')[1] : ''
  // console.log(left);
  const changeOptionCallback = (value) => {
    // console.log(value);
    // const value = `${min ? min : ''}-${max ? max : ''}`

    updateFilters({
      filter: item,
      value: value === '-' ? [] : [value],
      logic: logicOption,
    })
  }

  return (
    <ConditionItem className={` range-box-absolute `} style={{ left }}>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      <NumberRangeOption min={min} max={max} changeOptionCallback={changeOptionCallback} />
    </ConditionItem>
  )
}

export default NumberRange
