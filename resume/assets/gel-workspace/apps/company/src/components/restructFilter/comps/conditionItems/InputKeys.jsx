import React from 'react'
import { ConditionItem } from '.'
import InputKeyWords from '../filterOptions/InputKeyWords'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'

const InputKeys = ({ item }) => {
  const { isVip, itemName, logicOption, itemId, hoverHint } = item

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter

  const onChangeCallback = (value) => {
    console.log(value)
    updateFilters({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <ConditionItem>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      <InputKeyWords defalutValue={filter ? filter.value : []} onChangeCallback={onChangeCallback} />
    </ConditionItem>
  )
}

export default InputKeys
