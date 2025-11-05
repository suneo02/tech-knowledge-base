/**
 * 渲染 item 单独的 checkbox
 */

import { Checkbox } from '@wind/wind-ui'
import { getCDEItemOptionLabel, getCheckBoxItemValue } from 'cde'
import { CDEFilterOption } from 'gel-api/*'
import React, { useMemo } from 'react'
import { useSelectionContext } from './ctx'

export const CheckBoxComp: React.FC<{
  item: CDEFilterOption
}> = ({ item }) => {
  const { selectedValues, calculateItemState, handleItemChange } = useSelectionContext()

  const { checked, indeterminate } = useMemo(
    () => calculateItemState(getCheckBoxItemValue(item)),
    [item, selectedValues]
  )

  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={(e) => handleItemChange(e.target.checked, getCheckBoxItemValue(item))}
    >
      {getCDEItemOptionLabel(item)}
    </Checkbox>
  )
}
