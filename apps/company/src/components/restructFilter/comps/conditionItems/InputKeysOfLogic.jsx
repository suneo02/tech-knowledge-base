import React, { useState } from 'react'
import { ConditionItem } from '.'
import LogicOption from '../filterOptions/LogicOption'
import InputKeyWords from '../filterOptions/InputKeyWords'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'

const InputKeysOfLogic = ({ item }) => {
  const { isVip, itemId, itemName, hoverHint } = item

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter
  const [logic, setLogic] = useState(filter?.logic ? filter.logic : 'any')

  // logic变化
  const changeOptionCallback = (logic) => {
    setLogic(logic)
    if (filter) {
      updateFilters({
        filter: item,
        logic,
        value: filter.value,
      })
    }
  }

  // value变化
  const onChangeCallback = (value) => {
    console.log(value)
    updateFilters({
      filter: item,
      value,
      logic,
    })
  }

  return (
    <ConditionItem>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      <div className="flex">
        <LogicOption defaultOption={logic} changeOptionCallback={changeOptionCallback} />
        <InputKeyWords defalutValue={filter ? filter.value : []} onChangeCallback={onChangeCallback} />
      </div>
    </ConditionItem>
  )
}

export default InputKeysOfLogic
