import React from 'react'
import { ConditionItem } from '.'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import { CheckBoxOption } from '../filterOptions/CheckBoxOption'
import ConditionTitle from '../filterOptions/ConditionTitle'

const CheckBoxOfCustom = ({ item }) => {
  const { isVip, itemName, itemId, logicOption, hoverHint } = item

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter

  const changeOptionCallback = (value) => {
    updateFilters({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <ConditionItem>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      <CheckBoxOption
        filterItem={item}
        value={filter ? filter.value : []}
        changeOptionCallback={changeOptionCallback}
        data-uc-id="9cnv4NPaGj"
        data-uc-ct="checkboxoption"
      />
    </ConditionItem>
  )
}

export default CheckBoxOfCustom
