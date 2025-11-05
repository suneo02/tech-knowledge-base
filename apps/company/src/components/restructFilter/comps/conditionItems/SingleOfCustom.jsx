import React from 'react'
import { ConditionItem } from '.'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'
import SingleOption from '../filterOptions/SingleOption'

const SingleOfCustom = ({ item }) => {
  const { isVip, itemId, itemName, logicOption, itemOption, hoverHint } = item

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter

  const changeOptionCallback = (value) => {
    // console.log(value);
    updateFilters({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <ConditionItem>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      <SingleOption
        itemOption={itemOption}
        info={item}
        defaultValue={filter ? filter.value[0] : ''}
        changeOptionCallback={changeOptionCallback}
      />
    </ConditionItem>
  )
}

export default SingleOfCustom
